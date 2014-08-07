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
        define(['rx.virtualtime', 'exports'], function (Rx, exports) {
            root.Rx = factory(root, exports, Rx);
            return root.Rx;
        });
    } else if (typeof module === 'object' && module && module.exports === freeExports) {
        module.exports = factory(root, module.exports, require('./rx.all'));
    } else {
        root.Rx = factory(root, {}, root.Rx);
    }
}.call(this, function (root, exp, Rx, undefined) {
    
    // Defaults
    var Observer = Rx.Observer,
        Observable = Rx.Observable,
        Notification = Rx.Notification,
        VirtualTimeScheduler = Rx.VirtualTimeScheduler,
        Disposable = Rx.Disposable,
        disposableEmpty = Disposable.empty,
        disposableCreate = Disposable.create,
        CompositeDisposable = Rx.CompositeDisposable,
        SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
        slice = Array.prototype.slice,
        inherits = Rx.internals.inherits,
        defaultComparer = Rx.internals.isEqual;

    function argsOrArray(args, idx) {
        return args.length === 1 && Array.isArray(args[idx]) ?
            args[idx] :
            slice.call(args);
    }

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

  var ReactiveTest = Rx.ReactiveTest = {
    /** Default virtual time used for creation of observable sequences in unit tests. */
    created: 100,
    /** Default virtual time used to subscribe to observable sequences in unit tests. */
    subscribed: 200,
    /** Default virtual time used to dispose subscriptions in unit tests. */
    disposed: 1000,

    /**
     * Factory method for an OnNext notification record at a given time with a given value or a predicate function.
     * 
     * 1 - ReactiveTest.onNext(200, 42);
     * 2 - ReactiveTest.onNext(200, function (x) { return x.length == 2; });
     * 
     * @param ticks Recorded virtual time the OnNext notification occurs.
     * @param value Recorded value stored in the OnNext notification or a predicate.
     * @return Recorded OnNext notification.
     */
    onNext: function (ticks, value) {
        if (typeof value === 'function') {
            return new Recorded(ticks, new OnNextPredicate(value));
        }
        return new Recorded(ticks, Notification.createOnNext(value));
    },
    /**
     * Factory method for an OnError notification record at a given time with a given error.
     * 
     * 1 - ReactiveTest.onNext(200, new Error('error'));
     * 2 - ReactiveTest.onNext(200, function (e) { return e.message === 'error'; });
     * 
     * @param ticks Recorded virtual time the OnError notification occurs.
     * @param exception Recorded exception stored in the OnError notification.
     * @return Recorded OnError notification. 
     */      
    onError: function (ticks, exception) {
        if (typeof exception === 'function') {
            return new Recorded(ticks, new OnErrorPredicate(exception));
        }
        return new Recorded(ticks, Notification.createOnError(exception));
    },
    /**
     * Factory method for an OnCompleted notification record at a given time.
     * 
     * @param ticks Recorded virtual time the OnCompleted notification occurs.
     * @return Recorded OnCompleted notification.
     */
    onCompleted: function (ticks) {
        return new Recorded(ticks, Notification.createOnCompleted());
    },
    /**
     * Factory method for a subscription record based on a given subscription and disposal time.
     * 
     * @param start Virtual time indicating when the subscription was created.
     * @param end Virtual time indicating when the subscription was disposed.
     * @return Subscription object.
     */
    subscribe: function (start, end) {
        return new Subscription(start, end);
    }
  };

  /**
   * Creates a new object recording the production of the specified value at the given virtual time.
   *
   * @constructor
   * @param {Number} time Virtual time the value was produced on.
   * @param {Mixed} value Value that was produced.
   * @param {Function} comparer An optional comparer.
   */
  var Recorded = Rx.Recorded = function (time, value, comparer) {
    this.time = time;
    this.value = value;
    this.comparer = comparer || defaultComparer;
  };

  /**
   * Checks whether the given recorded object is equal to the current instance.
   *
   * @param {Recorded} other Recorded object to check for equality.
   * @returns {Boolean} true if both objects are equal; false otherwise.  
   */  
  Recorded.prototype.equals = function (other) {
    return this.time === other.time && this.comparer(this.value, other.value);
  };

  /**
   * Returns a string representation of the current Recorded value.
   *
   * @returns {String} String representation of the current Recorded value. 
   */   
  Recorded.prototype.toString = function () {
    return this.value.toString() + '@' + this.time;
  };

  /**
   * Creates a new subscription object with the given virtual subscription and unsubscription time.
   * 
   * @constructor
   * @param {Number} subscribe Virtual time at which the subscription occurred.
   * @param {Number} unsubscribe Virtual time at which the unsubscription occurred.
   */
  var Subscription = Rx.Subscription = function (start, end) {
    this.subscribe = start;
    this.unsubscribe = end || Number.MAX_VALUE;
  };

  /**
   * Checks whether the given subscription is equal to the current instance.
   * @param other Subscription object to check for equality.
   * @returns {Boolean} true if both objects are equal; false otherwise.
   */
  Subscription.prototype.equals = function (other) {
    return this.subscribe === other.subscribe && this.unsubscribe === other.unsubscribe;
  };

  /**
   * Returns a string representation of the current Subscription value.
   * @returns {String} String representation of the current Subscription value.
   */
  Subscription.prototype.toString = function () {
    return '(' + this.subscribe + ', ' + (this.unsubscribe === Number.MAX_VALUE ? 'Infinite' : this.unsubscribe) + ')';
  };

    /** @private */
    var MockDisposable = Rx.MockDisposable = function (scheduler) {
        this.scheduler = scheduler;
        this.disposes = [];
        this.disposes.push(this.scheduler.clock);
    };

    /*
     * @memberOf MockDisposable#
     * @prviate
     */
    MockDisposable.prototype.dispose = function () {
        this.disposes.push(this.scheduler.clock);
    };

    /** @private */
    var MockObserver = (function (_super) {
        inherits(MockObserver, _super);

        /*
         * @constructor
         * @prviate
         */
        function MockObserver(scheduler) {
            _super.call(this);
            this.scheduler = scheduler;
            this.messages = [];
        }

        var MockObserverPrototype = MockObserver.prototype;

        /*
         * @memberOf MockObserverPrototype#
         * @prviate
         */
        MockObserverPrototype.onNext = function (value) {
            this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnNext(value)));
        };

        /*
         * @memberOf MockObserverPrototype#
         * @prviate
         */
        MockObserverPrototype.onError = function (exception) {
            this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnError(exception)));
        };

        /*
         * @memberOf MockObserverPrototype#
         * @prviate
         */
        MockObserverPrototype.onCompleted = function () {
            this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnCompleted()));
        };

        return MockObserver;
    })(Observer);

    /** @private */    
    var HotObservable = (function (_super) {

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

        inherits(HotObservable, _super);

        /**
         * @private
         * @constructor
         */
        function HotObservable(scheduler, messages) {
            _super.call(this, subscribe);
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
                        var obs = observable.observers.slice(0);

                        for (var j = 0, jLen = obs.length; j < jLen; j++) {
                            innerNotification.accept(obs[j]);
                        }
                        return disposableEmpty;
                    });
                })(notification);
            }
        }

        return HotObservable;
    })(Observable);

    /** @private */
    var ColdObservable = (function (_super) {

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

        inherits(ColdObservable, _super);

        /**
         * @private
         * @constructor
         */
        function ColdObservable(scheduler, messages) {
            _super.call(this, subscribe);
            this.scheduler = scheduler;
            this.messages = messages;
            this.subscriptions = [];
        }

        return ColdObservable;
    })(Observable);

    /** Virtual time scheduler used for testing applications and libraries built using Reactive Extensions. */
    Rx.TestScheduler = (function (_super) {
        inherits(TestScheduler, _super);

        function baseComparer(x, y) {
            return x > y ? 1 : (x < y ? -1 : 0);
        }

        /** @constructor */
        function TestScheduler() {
            _super.call(this, 0, baseComparer);
        }

        /**
         * Schedules an action to be executed at the specified virtual time.
         * 
         * @param state State passed to the action to be executed.
         * @param dueTime Absolute virtual time at which to execute the action.
         * @param action Action to be executed.
         * @return Disposable object used to cancel the scheduled action (best effort).
         */
        TestScheduler.prototype.scheduleAbsoluteWithState = function (state, dueTime, action) {
            if (dueTime <= this.clock) {
                dueTime = this.clock + 1;
            }
            return _super.prototype.scheduleAbsoluteWithState.call(this, state, dueTime, action);
        };
        /**
         * Adds a relative virtual time to an absolute virtual time value.
         * 
         * @param absolute Absolute virtual time value.
         * @param relative Relative virtual time value to add.
         * @return Resulting absolute virtual time sum value.
         */
        TestScheduler.prototype.add = function (absolute, relative) {
            return absolute + relative;
        };
        /**
         * Converts the absolute virtual time value to a DateTimeOffset value.
         * 
         * @param absolute Absolute virtual time value to convert.
         * @return Corresponding DateTimeOffset value.
         */
        TestScheduler.prototype.toDateTimeOffset = function (absolute) {
            return new Date(absolute).getTime();
        };
        /**
         * Converts the TimeSpan value to a relative virtual time value.
         * 
         * @param timeSpan TimeSpan value to convert.
         * @return Corresponding relative virtual time value.
         */
        TestScheduler.prototype.toRelative = function (timeSpan) {
            return timeSpan;
        };
        /**
         * Starts the test scheduler and uses the specified virtual times to invoke the factory function, subscribe to the resulting sequence, and dispose the subscription.
         * 
         * @param create Factory method to create an observable sequence.
         * @param created Virtual time at which to invoke the factory to create an observable sequence.
         * @param subscribed Virtual time at which to subscribe to the created observable sequence.
         * @param disposed Virtual time at which to dispose the subscription.
         * @return Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.
         */        
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
        /**
         * Starts the test scheduler and uses the specified virtual time to dispose the subscription to the sequence obtained through the factory function.
         * Default virtual times are used for factory invocation and sequence subscription.
         * 
         * @param create Factory method to create an observable sequence.
         * @param disposed Virtual time at which to dispose the subscription.
         * @return Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.
         */        
        TestScheduler.prototype.startWithDispose = function (create, disposed) {
            return this.startWithTiming(create, ReactiveTest.created, ReactiveTest.subscribed, disposed);
        };
        /**
         * Starts the test scheduler and uses default virtual times to invoke the factory function, to subscribe to the resulting sequence, and to dispose the subscription.
         * 
         * @param create Factory method to create an observable sequence.
         * @return Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.
         */        
        TestScheduler.prototype.startWithCreate = function (create) {
            return this.startWithTiming(create, ReactiveTest.created, ReactiveTest.subscribed, ReactiveTest.disposed);
        };
        /**
         * Creates a hot observable using the specified timestamped notification messages either as an array or arguments.
         * 
         * @param messages Notifications to surface through the created sequence at their specified absolute virtual times.
         * @return Hot observable sequence that can be used to assert the timing of subscriptions and notifications.
         */        
        TestScheduler.prototype.createHotObservable = function () {
            var messages = argsOrArray(arguments, 0);
            return new HotObservable(this, messages);
        };
        /**
         * Creates a cold observable using the specified timestamped notification messages either as an array or arguments.
         * 
         * @param messages Notifications to surface through the created sequence at their specified virtual time offsets from the sequence subscription time.
         * @return Cold observable sequence that can be used to assert the timing of subscriptions and notifications.
         */        
        TestScheduler.prototype.createColdObservable = function () {
            var messages = argsOrArray(arguments, 0);
            return new ColdObservable(this, messages);
        };
        /**
         * Creates an observer that records received notification messages and timestamps those.
         * 
         * @return Observer that can be used to assert the timing of received notifications.
         */
        TestScheduler.prototype.createObserver = function () {
            return new MockObserver(this);
        };

        return TestScheduler;
    })(VirtualTimeScheduler);

    return Rx;
}));