// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

;(function (factory) {
    var objectTypes = {
        'boolean': false,
        'function': true,
        'object': true,
        'number': false,
        'string': false,
        'undefined': false
    };

    var root = (objectTypes[typeof window] && window) || this,
        freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports,
        freeModule = objectTypes[typeof module] && module && !module.nodeType && module,
        moduleExports = freeModule && freeModule.exports === freeExports && freeExports,
        freeGlobal = objectTypes[typeof global] && global;
    
    if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
        root = freeGlobal;
    }

    // Because of build optimizers
    if (typeof define === 'function' && define.amd) {
        define(['rx', 'exports'], function (Rx, exports) {
            root.Rx = factory(root, exports, Rx);
            return root.Rx;
        });
    } else if (typeof module === 'object' && module && module.exports === freeExports) {
        module.exports = factory(root, module.exports, require('./rx'));
    } else {
        root.Rx = factory(root, {}, root.Rx);
    }
}.call(this, function (root, exp, Rx, undefined) {
    
    // Aliases
    var Observable = Rx.Observable,
        observableProto = Observable.prototype,
        AnonymousObservable = Rx.Internals.AnonymousObservable,
        observableThrow = Observable.throwException,
        observerCreate = Rx.Observer.create,
        SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
        CompositeDisposable = Rx.CompositeDisposable,
        AbstractObserver = Rx.Internals.AbstractObserver,
        isEqual = Rx.Internals.isEqual;

    // Defaults
    function defaultComparer(x, y) { return isEqual(x, y); }
    function noop() { }

    // Utilities
    var inherits = Rx.Internals.inherits;
    var slice = Array.prototype.slice;
    function argsOrArray(args, idx) {
        return args.length === 1 && Array.isArray(args[idx]) ?
            args[idx] :
            slice.call(args);
    }

    /** @private */
    var Map = (function () {

        /**
         * @constructor
         * @private
         */
        function Map() {
            this.keys = [];
            this.values = [];
        }

        /**
         * @private
         * @memberOf Map#
         */
        Map.prototype['delete'] = function (key) {
            var i = this.keys.indexOf(key);
            if (i !== -1) {
                this.keys.splice(i, 1);
                this.values.splice(i, 1);
            }
            return i !== -1;
        };

        /**
         * @private
         * @memberOf Map#
         */
        Map.prototype.get = function (key, fallback) {
            var i = this.keys.indexOf(key);
            return i !== -1 ? this.values[i] : fallback;
        };

        /**
         * @private
         * @memberOf Map#
         */
        Map.prototype.set = function (key, value) {
            var i = this.keys.indexOf(key);
            if (i !== -1) {
                this.values[i] = value;
            }
            this.values[this.keys.push(key) - 1] = value;
        };

        /**
         * @private
         * @memberOf Map#
         */
        Map.prototype.size = function () { return this.keys.length; };

        /**
         * @private
         * @memberOf Map#
         */        
        Map.prototype.has = function (key) {
            return this.keys.indexOf(key) !== -1;
        };

        /**
         * @private
         * @memberOf Map#
         */        
        Map.prototype.getKeys = function () { return this.keys.slice(0); };

        /**
         * @private
         * @memberOf Map#
         */        
        Map.prototype.getValues = function () { return this.values.slice(0); };

        return Map;
    }());

    /**
     * @constructor
     * Represents a join pattern over observable sequences.
     */
    function Pattern(patterns) {
        this.patterns = patterns;
    }

    /**
     *  Creates a pattern that matches the current plan matches and when the specified observable sequences has an available value.
     *  
     *  @param other Observable sequence to match in addition to the current pattern.
     *  @return Pattern object that matches when all observable sequences in the pattern have an available value.   
     */ 
    Pattern.prototype.and = function (other) {
        var patterns = this.patterns.slice(0);
        patterns.push(other);
        return new Pattern(patterns);
    };

    /**
     *  Matches when all observable sequences in the pattern (specified using a chain of and operators) have an available value and projects the values.
     *  
     *  @param selector Selector that will be invoked with available values from the source sequences, in the same order of the sequences in the pattern.
     *  @return Plan that produces the projected values, to be fed (with other plans) to the when operator.
     */
    Pattern.prototype.then = function (selector) {
        return new Plan(this, selector);
    };

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

    /** @private */
    var JoinObserver = (function (_super) {

        inherits(JoinObserver, _super);

        /**
         * @constructor
         * @private
         */
        function JoinObserver(source, onError) {
            _super.call(this);
            this.source = source;
            this.onError = onError;
            this.queue = [];
            this.activePlans = [];
            this.subscription = new SingleAssignmentDisposable();
            this.isDisposed = false;
        }

        var JoinObserverPrototype = JoinObserver.prototype;

        /**
         * @memberOf JoinObserver#
         * @private
         */
        JoinObserverPrototype.next = function (notification) {
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

        /**
         * @memberOf JoinObserver#
         * @private
         */        
        JoinObserverPrototype.error = noop;

        /**
         * @memberOf JoinObserver#
         * @private
         */        
        JoinObserverPrototype.completed = noop;

        /**
         * @memberOf JoinObserver#
         * @private
         */
        JoinObserverPrototype.addActivePlan = function (activePlan) {
            this.activePlans.push(activePlan);
        };

        /**
         * @memberOf JoinObserver#
         * @private
         */        
        JoinObserverPrototype.subscribe = function () {
            this.subscription.setDisposable(this.source.materialize().subscribe(this));
        };

        /**
         * @memberOf JoinObserver#
         * @private
         */        
        JoinObserverPrototype.removeActivePlan = function (activePlan) {
            var idx = this.activePlans.indexOf(activePlan);
            this.activePlans.splice(idx, 1);
            if (this.activePlans.length === 0) {
                this.dispose();
            }
        };

        /**
         * @memberOf JoinObserver#
         * @private
         */        
        JoinObserverPrototype.dispose = function () {
            _super.prototype.dispose.call(this);
            if (!this.isDisposed) {
                this.isDisposed = true;
                this.subscription.dispose();
            }
        };
        
        return JoinObserver;
    } (AbstractObserver));

    /**
     *  Creates a pattern that matches when both observable sequences have an available value.
     *  
     *  @param right Observable sequence to match with the current sequence.
     *  @return {Pattern} Pattern object that matches when both observable sequences have an available value.     
     */
    observableProto.and = function (right) {
        return new Pattern([this, right]);
    };

    /**
     *  Matches when the observable sequence has an available value and projects the value.
     *  
     *  @param selector Selector that will be invoked for values in the source sequence.
     *  @returns {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator. 
     */    
    observableProto.then = function (selector) {
        return new Pattern([this]).then(selector);
    };

    /**
     *  Joins together the results from several patterns.
     *  
     *  @param plans A series of plans (specified as an Array of as a series of arguments) created by use of the Then operator on patterns.
     *  @returns {Observable} Observable sequence with the results form matching several patterns. 
     */
    Observable.when = function () {
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

    return Rx;
}));