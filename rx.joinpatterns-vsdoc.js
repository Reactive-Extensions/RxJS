/**
* @preserve Copyright (c) Microsoft Corporation.  All rights reserved.
* This code is licensed by Microsoft Corporation under the terms
* of the Microsoft Reference Source License (MS-RSL).
* http://referencesource.microsoft.com/referencesourcelicense.aspx.
*/

(function (root, factory) {
    var freeExports = typeof exports == 'object' && exports &&
    (typeof root == 'object' && root && root == root.global && (window = root), exports);

    // Because of build optimizers
    if (typeof define === 'function' && define.amd) {
        define(['rx', 'exports'], function (Rx, exports) {
            root.Rx = factory(root, exports, Rx);
            return root.Rx;
        });
    } else if (typeof module == 'object' && module && module.exports == freeExports) {
        module.exports = factory(root, module.exports, require('./rx'));
    } else {
        root.Rx = factory(root, {}, root.Rx);
    }
}(this, function (global, exp, root, undefined) {
    
    // Aliases
    var Observable = root.Observable,
        observableProto = Observable.prototype,
        AnonymousObservable = root.Internals.AnonymousObservable,
        observableThrow = Observable.throwException,
        observerCreate = root.Observer.create,
        SingleAssignmentDisposable = root.SingleAssignmentDisposable,
        CompositeDisposable = root.CompositeDisposable,
        AbstractObserver = root.Internals.AbstractObserver;

    // Defaults
    function defaultComparer(x, y) { return x === y; }
    function noop() { }

    // Utilities
    var inherits = root.Internals.inherits;
    var slice = Array.prototype.slice;
    function argsOrArray(args, idx) {
        return args.length === 1 && Array.isArray(args[idx]) ?
            args[idx] :
            slice.call(args);
    }

    // TODO: Replace with a real Map once finalized
    var Map = (function () {
        function Map() {
            this.keys = [];
            this.values = [];
        }

        Map.prototype['delete'] = function (key) {
            var i = this.keys.indexOf(key);
            if (i !== -1) {
                this.keys.splice(i, 1);
                this.values.splice(i, 1);
            }
            return i !== -1;
        };

        Map.prototype.get = function (key, fallback) {
            var i = this.keys.indexOf(key);
            return i !== -1 ? this.values[i] : fallback;
        };

        Map.prototype.set = function (key, value) {
            var i = this.keys.indexOf(key);
            if (i !== -1) {
                this.values[i] = value;
            }
            this.values[this.keys.push(key) - 1] = value;
        };

        Map.prototype.size = function () { return this.keys.length; };
        Map.prototype.has = function (key) {
            return this.keys.indexOf(key) !== -1;
        };
        Map.prototype.getKeys = function () { return this.keys.slice(0); };
        Map.prototype.getValues = function () { return this.values.slice(0); };

        return Map;
    }());

    // Pattern
    function Pattern(patterns) {
        this.patterns = patterns;
    }
    Pattern.prototype.and = function (other) {
        /// <summary>
        /// Creates a pattern that matches the current plan matches and when the specified observable sequences has an available value.
        /// </summary>
        /// <param name="other">Observable sequence to match in addition to the current pattern.</param>
        /// <returns>Pattern object that matches when all observable sequences in the pattern have an available value.</returns>
        var patterns = this.patterns.slice(0);
        patterns.push(other);
        return new Pattern(patterns);
    };
    Pattern.prototype.then = function (selector) {
        /// <summary>
        /// Matches when all observable sequences in the pattern (specified using a chain of and operators) have an available value and projects the values.
        /// </summary>
        /// <param name="selector">Selector that will be invoked with available values from the source sequences, in the same order of the sequences in the pattern.</param>
        /// <returns>Plan that produces the projected values, to be fed (with other plans) to the when operator.</returns>
        return new Plan(this, selector);
    };

    // Plan
    function Plan(expression, selector) {
        this.expression = expression;
        this.selector = selector;
    }
    Plan.prototype.activate = function (externalSubscriptions, observer, deactivate) {
        var self = this;
        var joinObservers = [];
        for (var i = 0, len = this.expression.patterns.length; i < len; i++) {
            joinObservers.push(planCreateObserver(externalSubscriptions, this.expression.patterns[i], observer.onError.bind(observer)));
        }
        var activePlan = new ActivePlan(joinObservers, function () {
            var result;
            try {
                result = self.selector.apply(self, arguments);
            } catch (exception) {
                observer.onError(exception);
                return;
            }
            observer.onNext(result);
        }, function () {
            for (var j = 0, jlen = joinObservers.length; j < jlen; j++) {
                joinObservers[j].removeActivePlan(activePlan);
            }
            deactivate(activePlan);
        });
        for (i = 0, len = joinObservers.length; i < len; i++) {
            joinObservers[i].addActivePlan(activePlan);
        }
        return activePlan;
    };

    function planCreateObserver(externalSubscriptions, observable, onError) {
        var entry = externalSubscriptions.get(observable);
        if (!entry) {
            var observer = new JoinObserver(observable, onError);
            externalSubscriptions.set(observable, observer);
            return observer;
        }
        return entry;
    }

    // Active Plan
    function ActivePlan(joinObserverArray, onNext, onCompleted) {
        var i, joinObserver;
        this.joinObserverArray = joinObserverArray;
        this.onNext = onNext;
        this.onCompleted = onCompleted;
        this.joinObservers = new Map();
        for (i = 0; i < this.joinObserverArray.length; i++) {
            joinObserver = this.joinObserverArray[i];
            this.joinObservers.set(joinObserver, joinObserver);
        }
    }

    ActivePlan.prototype.dequeue = function () {
        var values = this.joinObservers.getValues();
        for (var i = 0, len = values.length; i < len; i++) {
            values[i].queue.shift();
        }
    };
    ActivePlan.prototype.match = function () {
        var firstValues, i, len, isCompleted, values, hasValues = true;
        for (i = 0, len = this.joinObserverArray.length; i < len; i++) {
            if (this.joinObserverArray[i].queue.length === 0) {
                hasValues = false;
                break;
            }
        }
        if (hasValues) {
            firstValues = [];
            isCompleted = false;
            for (i = 0, len = this.joinObserverArray.length; i < len; i++) {
                firstValues.push(this.joinObserverArray[i].queue[0]);
                if (this.joinObserverArray[i].queue[0].kind === 'C') {
                    isCompleted = true;
                }
            }
            if (isCompleted) {
                this.onCompleted();
            } else {
                this.dequeue();
                values = [];
                for (i = 0; i < firstValues.length; i++) {
                    values.push(firstValues[i].value);
                }
                this.onNext.apply(this, values);
            }
        }
    };

    // Join Observer
    var JoinObserver = (function () {

        inherits(JoinObserver, AbstractObserver);

        function JoinObserver(source, onError) {
            JoinObserver.super_.constructor.call(this);
            this.source = source;
            this.onError = onError;
            this.queue = [];
            this.activePlans = [];
            this.subscription = new SingleAssignmentDisposable();
            this.isDisposed = false;
        }

        JoinObserver.prototype.next = function (notification) {
            if (!this.isDisposed) {
                if (notification.kind === 'E') {
                    this.onError(notification.exception);
                    return;
                }
                this.queue.push(notification);
                var activePlans = this.activePlans.slice(0);
                for (var i = 0, len = activePlans.length; i < len; i++) {
                    activePlans[i].match();
                }
            }
        };
        JoinObserver.prototype.error = noop;
        JoinObserver.prototype.completed = noop;

        JoinObserver.prototype.addActivePlan = function (activePlan) {
            this.activePlans.push(activePlan);
        };
        JoinObserver.prototype.subscribe = function () {
            this.subscription.disposable(this.source.materialize().subscribe(this));
        };
        JoinObserver.prototype.removeActivePlan = function (activePlan) {
            var idx = this.activePlans.indexOf(activePlan);
            this.activePlans.splice(idx, 1);
            if (this.activePlans.length === 0) {
                this.dispose();
            }
        };
        JoinObserver.prototype.dispose = function () {
            JoinObserver.super_.dispose.call(this);
            if (!this.isDisposed) {
                this.isDisposed = true;
                this.subscription.dispose();
            }
        };
        return JoinObserver;
    } ());

    // Observable extensions
    observableProto.and = function (right) {
        /// <summary>
        /// Creates a pattern that matches when both observable sequences have an available value.
        /// </summary>
        /// <param name="right">Observable sequence to match with the current sequence.</param>
        /// <returns>Pattern object that matches when both observable sequences have an available value.</returns>
        return new Pattern([this, right]);
    };
    observableProto.then = function (selector) {
        /// <summary>
        /// Matches when the observable sequence has an available value and projects the value.
        /// </summary>
        /// <param name="selector">Selector that will be invoked for values in the source sequence.</param>
        /// <returns>Plan that produces the projected values, to be fed (with other plans) to the when operator.</returns>
        return new Pattern([this]).then(selector);
    };
    Observable.when = function () {
        /// <summary>
        /// Joins together the results from several patterns.
        /// </summary>
        /// <param name="plans">A series of plans (specified as an Array of as a series of arguments) created by use of the Then operator on patterns.</param>
        /// <returns>Observable sequence with the results form matching several patterns.</returns>
        var plans = argsOrArray(arguments, 0);
        return new AnonymousObservable(function (observer) {
            var activePlans = [],
                externalSubscriptions = new Map(),
                group,
                i, len,
                joinObserver,
                joinValues,
                outObserver;
            outObserver = observerCreate(observer.onNext.bind(observer), function (exception) {
                var values = externalSubscriptions.getValues();
                for (var j = 0, jlen = values.length; j < jlen; j++) {
                    values[j].onError(exception);
                }
                observer.onError(exception);
            }, observer.onCompleted.bind(observer));
            try {
                for (i = 0, len = plans.length; i < len; i++) {
                    activePlans.push(plans[i].activate(externalSubscriptions, outObserver, function (activePlan) {
                        var idx = activePlans.indexOf(activePlan);
                        activePlans.splice(idx, 1);
                        if (activePlans.length === 0) {
                            outObserver.onCompleted();
                        }
                    }));
                }
            } catch (e) {
                observableThrow(e).subscribe(observer);
            }
            group = new CompositeDisposable();
            joinValues = externalSubscriptions.getValues();
            for (i = 0, len = joinValues.length; i < len; i++) {
                joinObserver = joinValues[i];
                joinObserver.subscribe();
                group.add(joinObserver);
            }
            return group;
        });
    };
    

    return root;
}));