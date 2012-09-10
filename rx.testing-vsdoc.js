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
            /// <summary>
            /// Factory method for an OnNext notification record at a given time with a given value or a predicate function.
            /// &#10;
            /// &#10;1 - ReactiveTest.onNext(200, 42);
            /// &#10;2 - ReactiveTest.onNext(200, function (x) { return x.length == 2; });
            /// </summary>
            /// <param name="ticks">Recorded virtual time the OnNext notification occurs.</param>
            /// <param name="value">Recorded value stored in the OnNext notification or a predicate.</param>
            /// <returns>Recorded OnNext notification.</returns>
            if (typeof value === 'function') {
                return new Recorded(ticks, new OnNextPredicate(value));
            }
            return new Recorded(ticks, Notification.createOnNext(value));
        },
        onError: function (ticks, exception) {
            /// <summary>
            /// Factory method for an OnError notification record at a given time with a given error.
            /// &#10;
            /// &#10;1 - ReactiveTest.onNext(200, new Error('error'));
            /// &#10;2 - ReactiveTest.onNext(200, function (e) { return e.message === 'error'; });
            /// </summary>
            /// <param name="ticks">Recorded virtual time the OnError notification occurs.</param>
            /// <param name="exception">Recorded exception stored in the OnError notification.</param>
            /// <returns>Recorded OnError notification.</returns>
            if (typeof exception === 'function') {
                return new Recorded(ticks, new OnErrorPredicate(exception));
            }
            return new Recorded(ticks, Notification.createOnError(exception));
        },
        onCompleted: function (ticks) {
            /// <summary>
            /// Factory method for an OnCompleted notification record at a given time.
            /// </summary>
            /// <param name="ticks">Recorded virtual time the OnCompleted notification occurs.</param>
            /// <returns>Recorded OnCompleted notification.</returns>
            return new Recorded(ticks, Notification.createOnCompleted());
        },
        subscribe: function (start, end) {
            /// <summary>
            /// Factory method for a subscription record based on a given subscription and disposal time.
            /// </summary>
            /// <param name="start">Virtual time indicating when the subscription was created.</param>
            /// <param name="end">Virtual time indicating when the subscription was disposed.</param>
            /// <returns>Subscription object.</returns>
            return new Subscription(start, end);
        }
    };

    var Recorded = root.Recorded = function (time, value, comparer) {
        /// <summary>
        /// Creates a new object recording the production of the specified value at the given virtual time.
        /// </summary>
        /// <param name="time">Virtual time the value was produced on.</param>
        /// <param name="value">Value that was produced.</param>
        /// <param name="comparer">An optional comparer.</param>
        this.time = time;
        this.value = value;
        this.comparer = comparer || defaultComparer;
    };
    Recorded.prototype.equals = function (other) {
        /// <summary>
        /// Checks whether the given recorded object is equal to the current instance.
        /// </summary>
        /// <param name="other">Recorded object to check for equality.</param>
        /// <returns>true if both objects are equal; false otherwise.</returns>
        return this.time === other.time && this.comparer(this.value, other.value);
    };
    Recorded.prototype.toString = function () {
        /// <summary>
        /// Returns a string representation of the current Recorded value.
        /// </summary>
        /// <returns>String representation of the current Recorded value.</returns>
        return this.value.toString() + '@' + this.time;
    };

    var Subscription = root.Subscription = function (start, end) {
        /// <summary>
        /// Creates a new subscription object with the given virtual subscription and unsubscription time.
        /// </summary>
        /// <param name="subscribe">Virtual time at which the subscription occurred.</param>
        /// <param name="unsubscribe">Virtual time at which the unsubscription occurred.</param>
        this.subscribe = start;
        this.unsubscribe = end || Number.MAX_VALUE;
    };
    Subscription.prototype.equals = function (other) {
        /// <summary>
        /// Checks whether the given subscription is equal to the current instance.
        /// </summary>
        /// <param name="other">Subscription object to check for equality.</param>
        /// <returns>true if both objects are equal; false otherwise.</returns>
        return this.subscribe === other.subscribe && this.unsubscribe === other.unsubscribe;
    };
    Subscription.prototype.toString = function () {
        /// <summary>
        /// Returns a string representation of the current Subscription value.
        /// </summary>
        /// <returns>String representation of the current Subscription value.</returns>
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
            /// <summary>
            /// Schedules an action to be executed at the specified virtual time.
            /// </summary>
            /// <param name="state">State passed to the action to be executed.</param>
            /// <param name="dueTime">Absolute virtual time at which to execute the action.</param>
            /// <param name="action">Action to be executed.</param>
            /// <returns>Disposable object used to cancel the scheduled action (best effort).</returns>
            if (dueTime <= this.clock) {
                dueTime = this.clock + 1;
            }
            return TestScheduler.super_.scheduleAbsoluteWithState.call(this, state, dueTime, action);
        };
        TestScheduler.prototype.add = function (absolute, relative) {
            /// <summary>
            /// Adds a relative virtual time to an absolute virtual time value.
            /// </summary>
            /// <param name="absolute">Absolute virtual time value.</param>
            /// <param name="relative">Relative virtual time value to add.</param>
            /// <returns>Resulting absolute virtual time sum value.</returns>
            return absolute + relative;
        };
        TestScheduler.prototype.toDateTimeOffset = function (absolute) {
            /// <summary>
            /// Converts the absolute virtual time value to a DateTimeOffset value.
            /// </summary>
            /// <param name="absolute">Absolute virtual time value to convert.</param>
            /// <returns>Corresponding DateTimeOffset value.</returns>
            return new Date(absolute).getTime();
        };
        TestScheduler.prototype.toRelative = function (timeSpan) {
            /// <summary>
            /// Converts the TimeSpan value to a relative virtual time value.
            /// </summary>
            /// <param name="timeSpan">TimeSpan value to convert.</param>
            /// <returns>Corresponding relative virtual time value.</returns>
            return timeSpan;
        };
        TestScheduler.prototype.startWithTiming = function (create, created, subscribed, disposed) {
            /// <summary>
            /// Starts the test scheduler and uses the specified virtual times to invoke the factory function, subscribe to the resulting sequence, and dispose the subscription.
            /// </summary>
            /// <param name="create">Factory method to create an observable sequence.</param>
            /// <param name="created">Virtual time at which to invoke the factory to create an observable sequence.</param>
            /// <param name="subscribed">Virtual time at which to subscribe to the created observable sequence.</param>
            /// <param name="disposed">Virtual time at which to dispose the subscription.</param>
            /// <returns>Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.</returns>
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
            /// <summary>
            /// Starts the test scheduler and uses the specified virtual time to dispose the subscription to the sequence obtained through the factory function.
            /// Default virtual times are used for factory invocation and sequence subscription.
            /// </summary>
            /// <param name="create">Factory method to create an observable sequence.</param>
            /// <param name="disposed">Virtual time at which to dispose the subscription.</param>
            /// <returns>Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.</returns>
            return this.startWithTiming(create, ReactiveTest.created, ReactiveTest.subscribed, disposed);
        };
        TestScheduler.prototype.startWithCreate = function (create) {
            /// <summary>
            /// Starts the test scheduler and uses default virtual times to invoke the factory function, to subscribe to the resulting sequence, and to dispose the subscription</see>.
            /// </summary>
            /// <param name="create">Factory method to create an observable sequence.</param>
            /// <returns>Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.</returns>
            return this.startWithTiming(create, ReactiveTest.created, ReactiveTest.subscribed, ReactiveTest.disposed);
        };
        TestScheduler.prototype.createHotObservable = function () {
            /// <summary>
            /// Creates a hot observable using the specified timestamped notification messages either as an array or arguments.
            /// </summary>
            /// <param name="messages">Notifications to surface through the created sequence at their specified absolute virtual times.</param>
            /// <returns>Hot observable sequence that can be used to assert the timing of subscriptions and notifications.</returns>
            var messages = argsOrArray(arguments, 0);
            return new HotObservable(this, messages);
        };
        TestScheduler.prototype.createColdObservable = function () {
            /// <summary>
            /// Creates a cold observable using the specified timestamped notification messages either as an array or arguments.
            /// </summary>
            /// <param name="messages">Notifications to surface through the created sequence at their specified virtual time offsets from the sequence subscription time.</param>
            /// <returns>Cold observable sequence that can be used to assert the timing of subscriptions and notifications.</returns>
            var messages = argsOrArray(arguments, 0);
            return new ColdObservable(this, messages);
        };
        TestScheduler.prototype.createObserver = function () {
            /// <summary>
            /// Creates an observer that records received notification messages and timestamps those.
            /// </summary>
            /// <typeparam name="T">The element type of the observer being created.</typeparam>
            /// <returns>Observer that can be used to assert the timing of received notifications.</returns>
            return new MockObserver(this);
        };

        return TestScheduler;
    })();

    return root;
}));