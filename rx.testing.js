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
    
    // Defaults
    var Observer = root.Observer,
        Observable = root.Observable,
        Notification = root.Notification,
        VirtualTimeScheduler = root.VirtualTimeScheduler,
        Disposable = root.Disposable,
        disposableEmpty = Disposable.empty,
        disposableCreate = Disposable.create,
        CompositeDisposable = root.CompositeDisposable,
        SingleAssignmentDisposable = root.SingleAssignmentDisposable,
        slice = Array.prototype.slice,
        inherits = root.Internals.inherits;

    // Utilities
    function defaultComparer(x, y) {
        if (!y.equals) {
            return x === y;
        }
        return y.equals(x);
    }

    function argsOrArray(args, idx) {
        return args.length === 1 && Array.isArray(args[idx]) ?
            args[idx] :
            slice.call(args);
    }

    // New predicate tests
    function OnNextPredicate(predicate) {
        this.predicate = predicate;
    };
    OnNextPredicate.prototype.equals = function (other) {
        if (other === this) { return true; }
        if (other == null) { return false; }
        if (other.kind !== 'N') { return false; }
        return this.predicate(other.value);
    };

    function OnErrorPredicate(predicate) {
        this.predicate = predicate;
    };
    OnErrorPredicate.prototype.equals = function (other) {
        if (other === this) { return true; }
        if (other == null) { return false; }
        if (other.kind !== 'E') { return false; }
        return this.predicate(other.exception);
    };

    var ReactiveTest = root.ReactiveTest = {
        created: 100,
        subscribed: 200,
        disposed: 1000,
        onNext: function (ticks, value) {
            if (typeof value === 'function') {
                return new Recorded(ticks, new OnNextPredicate(value));
            }
            return new Recorded(ticks, Notification.createOnNext(value));
        },
        onError: function (ticks, exception) {
            if (typeof exception === 'function') {
                return new Recorded(ticks, new OnErrorPredicate(exception));
            }
            return new Recorded(ticks, Notification.createOnError(exception));
        },
        onCompleted: function (ticks) {
            return new Recorded(ticks, Notification.createOnCompleted());
        },
        subscribe: function (start, end) {
            return new Subscription(start, end);
        }
    };

    var Recorded = root.Recorded = function (time, value, comparer) {
        this.time = time;
        this.value = value;
        this.comparer = comparer || defaultComparer;
    };
    Recorded.prototype.equals = function (other) {
        return this.time === other.time && this.comparer(this.value, other.value);
    };
    Recorded.prototype.toString = function () {
        return this.value.toString() + '@' + this.time;
    };

    var Subscription = root.Subscription = function (start, end) {
        this.subscribe = start;
        this.unsubscribe = end || Number.MAX_VALUE;
    };
    Subscription.prototype.equals = function (other) {
        return this.subscribe === other.subscribe && this.unsubscribe === other.unsubscribe;
    };
    Subscription.prototype.toString = function () {
        return '(' + this.subscribe + ', ' + this.unsubscribe === Number.MAX_VALUE ? 'Infinite' : this.unsubscribe + ')';
    };

    var MockDisposable = root.MockDisposable = function (scheduler) {
        this.scheduler = scheduler;
        this.disposes = [];
        this.disposes.push(this.scheduler.clock);
    };
    MockDisposable.prototype.dispose = function () {
        this.disposes.push(this.scheduler.clock);
    };

    var MockObserver = (function () {
        inherits(MockObserver, Observer);
        function MockObserver(scheduler) {
            this.scheduler = scheduler;
            this.messages = [];
        }
        MockObserver.prototype.onNext = function (value) {
            this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnNext(value)));
        };
        MockObserver.prototype.onError = function (exception) {
            this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnError(exception)));
        };
        MockObserver.prototype.onCompleted = function () {
            this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnCompleted()));
        };
        return MockObserver;
    })();

    var HotObservable = (function () {
        function subscribe(observer) {
            var observable = this;
            this.observers.push(observer);
            this.subscriptions.push(new Subscription(this.scheduler.clock));
            var index = this.subscriptions.length - 1;
            return disposableCreate(function () {
                var idx = observable.observers.indexOf(observer);
                observable.observers.splice(idx, 1);
                observable.subscriptions[index] = new Subscription(observable.subscriptions[index].subscribe, observable.scheduler.clock);
            });
        }

        inherits(HotObservable, Observable);
        function HotObservable(scheduler, messages) {
            HotObservable.super_.constructor.call(this, subscribe);
            var message, notification, observable = this;
            this.scheduler = scheduler;
            this.messages = messages;
            this.subscriptions = [];
            this.observers = [];
            for (var i = 0, len = this.messages.length; i < len; i++) {
                message = this.messages[i];
                notification = message.value;
                (function (innerNotification) {
                    scheduler.scheduleAbsoluteWithState(null, message.time, function () {
                        for (var j = 0; j < observable.observers.length; j++) {
                            innerNotification.accept(observable.observers[j]);
                        }
                        return disposableEmpty;
                    });
                })(notification);
            }
        }

        return HotObservable;
    })();

    var ColdObservable = (function () {
        function subscribe(observer) {
            var message, notification, observable = this;
            this.subscriptions.push(new Subscription(this.scheduler.clock));
            var index = this.subscriptions.length - 1;
            var d = new CompositeDisposable();
            for (var i = 0, len = this.messages.length; i < len; i++) {
                message = this.messages[i];
                notification = message.value;
                (function (innerNotification) {
                    d.add(observable.scheduler.scheduleRelativeWithState(null, message.time, function () {
                        innerNotification.accept(observer);
                        return disposableEmpty;
                    }));
                })(notification);
            }
            return disposableCreate(function () {
                observable.subscriptions[index] = new Subscription(observable.subscriptions[index].subscribe, observable.scheduler.clock);
                d.dispose();
            });
        }

        inherits(ColdObservable, Observable);
        function ColdObservable(scheduler, messages) {
            ColdObservable.super_.constructor.call(this, subscribe);
            this.scheduler = scheduler;
            this.messages = messages;
            this.subscriptions = [];
        }

        return ColdObservable;
    })();

    root.TestScheduler = (function () {
        inherits(TestScheduler, VirtualTimeScheduler);
        function TestScheduler() {
            TestScheduler.super_.constructor.call(this, 0, function (a, b) { return a - b; });
        }

        TestScheduler.prototype.scheduleAbsoluteWithState = function (state, dueTime, action) {
            if (dueTime <= this.clock) {
                dueTime = this.clock + 1;
            }
            return TestScheduler.super_.scheduleAbsoluteWithState.call(this, state, dueTime, action);
        };
        TestScheduler.prototype.add = function (absolute, relative) {
            return absolute + relative;
        };
        TestScheduler.prototype.toDateTimeOffset = function (absolute) {
            return new Date(absolute).getTime();
        };
        TestScheduler.prototype.toRelative = function (timeSpan) {
            return timeSpan;
        };
        TestScheduler.prototype.startWithTiming = function (create, created, subscribed, disposed) {
            var observer = this.createObserver(), source, subscription;
            this.scheduleAbsoluteWithState(null, created, function () {
                source = create();
                return disposableEmpty;
            });
            this.scheduleAbsoluteWithState(null, subscribed, function () {
                subscription = source.subscribe(observer);
                return disposableEmpty;
            });
            this.scheduleAbsoluteWithState(null, disposed, function () {
                subscription.dispose();
                return disposableEmpty;
            });
            this.start();
            return observer;
        };
        TestScheduler.prototype.startWithDispose = function (create, disposed) {
            return this.startWithTiming(create, ReactiveTest.created, ReactiveTest.subscribed, disposed);
        };
        TestScheduler.prototype.startWithCreate = function (create) {
            return this.startWithTiming(create, ReactiveTest.created, ReactiveTest.subscribed, ReactiveTest.disposed);
        };
        TestScheduler.prototype.createHotObservable = function () {
            var messages = argsOrArray(arguments, 0);
            return new HotObservable(this, messages);
        };
        TestScheduler.prototype.createColdObservable = function () {
            var messages = argsOrArray(arguments, 0);
            return new ColdObservable(this, messages);
        };
        TestScheduler.prototype.createObserver = function () {
            return new MockObserver(this);
        };

        return TestScheduler;
    })();

    return root;
}));