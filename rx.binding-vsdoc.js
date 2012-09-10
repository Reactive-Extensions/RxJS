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
    
    var Observable = root.Observable,
        observableProto = Observable.prototype,
        AnonymousObservable = root.Internals.AnonymousObservable,
        Subject = root.Subject,
        AsyncSubject = root.AsyncSubject,
        Observer = root.Observer,
        ScheduledObserver = root.Internals.ScheduledObserver,
        disposableCreate = root.Disposable.create,
        disposableEmpty = root.Disposable.empty,
        CompositeDisposable = root.CompositeDisposable,
        currentThreadScheduler = root.Scheduler.currentThread,
        inherits = root.Internals.inherits,
        addProperties = root.Internals.addProperties;

    // Utilities
    var objectDisposed = 'Object has been disposed';
    function checkDisposed() {
        if (this.isDisposed) {
            throw new Error(objectDisposed);
        }
    }

    observableProto.multicast = function (subjectOrSubjectSelector, selector) {
        /// <summary>
        /// Multicasts the source sequence notifications through an instantiated subject into all uses of the sequence within a selector function. Each
        /// subscription to the resulting sequence causes a separate multicast invocation, exposing the sequence resulting from the selector function's
        /// invocation. For specializations with fixed subject types, see Publish, PublishLast, and Replay.
        /// &#10;
        /// &#10;1 - res = source.multicast(observable);
        /// &#10;2 - res = source.multicast(function () { return new Subject(); }, function (x) { return x; });
        /// </summary>
        /// <param name="subjectOrSubjectSelector">
        /// Factory function to create an intermediate subject through which the source sequence's elements will be multicast to the selector function.
        /// Or:
        /// Subject to push source elements into.
        /// </param>
        /// <param name="selector">[Optional] Selector function which can use the multicasted source sequence subject to the policies enforced by the created subject. Specified only if <paramref name="subjectOrSubjectSelector" is a factory function.</param>
        /// <returns>An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.</returns>
        var source = this;
        return typeof subjectOrSubjectSelector === 'function' ?
            new AnonymousObservable(function (observer) {
                var connectable = source.multicast(subjectOrSubjectSelector());
                return new CompositeDisposable(selector(connectable).subscribe(observer), connectable.connect());
            }) :
            new ConnectableObservable(source, subjectOrSubjectSelector);
    };

    observableProto.publish = function (selector) {
        /// <summary>
        /// Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence.
        /// This operator is a specialization of Multicast using a regular Subject.
        /// &#10;
        /// &#10;1 - res = source.publish();
        /// &#10;2 - res = source.publish(function (x) { return x; });
        /// </summary>
        /// <param name="selector">[Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all notifications of the source from the time of the subscription on.</param>
        /// <returns>An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.</returns>
        return !selector ?
            this.multicast(new Subject()) :
            this.multicast(function () {
                return new Subject();
            }, selector);
    };

    observableProto.publishLast = function (selector) {
        /// <summary>
        /// Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence containing only the last notification.
        /// This operator is a specialization of Multicast using a AsyncSubject.
        /// &#10;
        /// &#10;1 - res = source.publishLast();
        /// &#10;2 - res = source.publishLast(function (x) { return x; });
        /// </summary>
        /// <param name="selector">[Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will only receive the last notification of the source.</param>
        /// <returns>An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.</returns>
        return !selector ?
            this.multicast(new AsyncSubject()) :
            this.multicast(function () {
                return new AsyncSubject();
            }, selector);
    };

    observableProto.publishValue = function (initialValueOrSelector, initialValue) {
        /// <summary>
        /// Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence and starts with initialValue.
        /// This operator is a specialization of Multicast using a BehaviorSubject.
        /// &#10;
        /// &#10;1 - res = source.publishValue(42);
        /// &#10;2 - res = source.publishLast(function (x) { return x.select(function (y) { return y * y; }) }, 42);
        /// </summary>
        /// <param name="selector">[Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive immediately receive the initial value, followed by all notifications of the source from the time of the subscription on.</param>
        /// <param name="initialValue">Initial value received by observers upon subscription.</param>
        /// <returns>An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.</returns>
        return arguments.length === 2 ?
            this.multicast(function () {
                return new BehaviorSubject(initialValue);
            }, initialValueOrSelector) :
            this.multicast(new BehaviorSubject(initialValueOrSelector));
    };

    observableProto.replay = function (selector, bufferSize, window, scheduler) {
        /// <summary>
        /// Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.
        /// This operator is a specialization of Multicast using a ReplaySubject.
        /// &#10;
        /// &#10;1 - res = source.replay(null, 3);
        /// &#10;2 - res = source.replay(null, 3, 500 /* ms */);
        /// &#10;3 - res = source.replay(null, 3, 500 /* ms */, /* scheduler */);
        /// &#10;3 - res = source.replay(function (x) { return x.take(6).repeat(); }, 3, 500 /* ms */, /* scheduler */);
        /// </summary>
        /// <param name="selector">[Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all the notifications of the source subject to the specified replay buffer trimming policy.</param>
        /// <param name="bufferSize">[Optional] Maximum element count of the replay buffer.</param>
        /// <param name="window">[Optional] Maximum time length of the replay buffer.</param>
        /// <param name="scheduler">[Optional] Scheduler where connected observers within the selector function will be invoked on.</param>
        /// <returns>An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.</returns>
        return !selector ?
            this.multicast(new ReplaySubject(bufferSize, window, scheduler)) :
            this.multicast(function () {
                return new ReplaySubject(bufferSize, window, scheduler);
            }, selector);
    };

    var InnerSubscription = function (subject, observer) {
        this.subject = subject;
        this.observer = observer;
    };
    InnerSubscription.prototype.dispose = function () {
        if (!this.subject.isDisposed && this.observer !== null) {
            var idx = this.subject.observers.indexOf(this.observer);
            this.subject.observers.splice(idx, 1);
            this.observer = null;
        }
    };

    var BehaviorSubject = root.BehaviorSubject = (function () {
        function subscribe(observer) {
            var ex;
            checkDisposed.call(this);
            if (!this.isStopped) {
                this.observers.push(observer);
                observer.onNext(this.value);
                return new InnerSubscription(this, observer);
            }
            ex = this.exception;
            if (ex) {
                observer.onError(ex);
            } else {
                observer.onCompleted();
            }
            return disposableEmpty;
        }

        inherits(BehaviorSubject, Observable);
        function BehaviorSubject(value) {
            /// <summary>
            /// Initializes a new instance of the BehaviorSubject class which creates a subject that caches its last value and starts with the specified value.
            /// </summary>
            /// <param name="value">Initial value sent to observers when no other value has been received by the subject yet.</param>
            BehaviorSubject.super_.constructor.call(this, subscribe);

            this.value = value,
            this.observers = [],
            this.isDisposed = false,
            this.isStopped = false,
            this.exception = null;
        }

        addProperties(BehaviorSubject.prototype, Observer, {
            onCompleted: function () {
                /// <summary>
                /// Notifies all subscribed observers about the end of the sequence.
                /// </summary>
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var os = this.observers.slice(0);
                    this.isStopped = true;
                    for (var i = 0, len = os.length; i < len; i++) {
                        os[i].onCompleted();
                    }

                    this.observers = [];
                }
            },
            onError: function (error) {
                /// <summary>
                /// Notifies all subscribed observers about the exception.
                /// </summary>
                /// <param name="error">The exception to send to all observers.</param>
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var os = this.observers.slice(0);
                    this.isStopped = true;
                    this.exception = error;

                    for (var i = 0, len = os.length; i < len; i++) {
                        os[i].onError(error);
                    }

                    this.observers = [];
                }
            },
            onNext: function (value) {
                /// <summary>
                /// Notifies all subscribed observers about the arrival of the specified element in the sequence.
                /// </summary>
                /// <param name="value">The value to send to all observers.</param>
                checkDisposed.call(this);
                if (!this.isStopped) {
                    this.value = value;
                    var os = this.observers.slice(0);
                    for (var i = 0, len = os.length; i < len; i++) {
                        os[i].onNext(value);
                    }
                }
            },
            dispose: function () {
                /// <summary>
                /// Unsubscribe all observers and release resources.
                /// </summary>
                this.isDisposed = true;
                this.observers = null;
                this.value = null;
                this.exception = null;
            }
        });

        return BehaviorSubject;
    }());

    // Replay Subject
    var ReplaySubject = root.ReplaySubject = (function (base) {
        var RemovableDisposable = function (subject, observer) {
            this.subject = subject;
            this.observer = observer;
        };

        RemovableDisposable.prototype.dispose = function () {
            this.observer.dispose();
            if (!this.subject.isDisposed) {
                var idx = this.subject.observers.indexOf(this.observer);
                this.subject.observers.splice(idx, 1);
            }
        };

        function subscribe(observer) {
            var so = new ScheduledObserver(this.scheduler, observer),
                subscription = new RemovableDisposable(this, so);
            checkDisposed.call(this);
            this._trim(this.scheduler.now());
            this.observers.push(so);

            var n = this.q.length;

            for (var i = 0, len = this.q.length; i < len; i++) {
                so.onNext(this.q[i].value);
            }

            if (this.hasError) {
                n++;
                so.onError(this.error);
            } else if (this.isStopped) {
                n++;
                so.onCompleted();
            }

            so.ensureActive(n);
            return subscription;
        }

        inherits(ReplaySubject, Observable);

        function ReplaySubject(bufferSize, window, scheduler) {
            /// <summary>
            /// Initializes a new instance of the ReplaySubject class with the specified buffer size, window and scheduler.
            /// </summary>
            /// <param name="bufferSize">[Optional] Maximum element count of the replay buffer. If not specified, defaults to Number.MAX_VALUE.</param>
            /// <param name="window">[Optional] Maximum time length of the replay buffer. If not specified, defaults to Number.MAX_VALUE.</param>
            /// <param name="scheduler">[Optional] Scheduler the observers are invoked on. If not specified, defaults to Scheduler.currentThread.</param>
            this.bufferSize = bufferSize == null ? Number.MAX_VALUE : bufferSize;
            this.window = window == null ? Number.MAX_VALUE : window;
            this.scheduler = scheduler || currentThreadScheduler;
            this.q = [];
            this.observers = [];
            this.isStopped = false;
            this.isDisposed = false;
            this.hasError = false;
            this.error = null;
            ReplaySubject.super_.constructor.call(this, subscribe);
        }

        addProperties(ReplaySubject.prototype, Observer, {
            _trim: function (now) {
                while (this.q.length > this.bufferSize) {
                    this.q.shift();
                }
                while (this.q.length > 0 && (now - this.q[0].interval) > this.window) {
                    this.q.shift();
                }
            },
            onNext: function (value) {
                /// <summary>
                /// Notifies all subscribed and future observers about the arrival of the specified element in the sequence.
                /// </summary>
                /// <param name="value">The value to send to all observers.</param>
                var observer;
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var now = this.scheduler.now();
                    this.q.push({ interval: now, value: value });
                    this._trim(now);

                    var o = this.observers.slice(0);
                    for (var i = 0, len = o.length; i < len; i++) {
                        observer = o[i];
                        observer.onNext(value);
                        observer.ensureActive();
                    }
                }
            },
            onError: function (error) {
                /// <summary>
                /// Notifies all subscribed and future observers about the specified exception.
                /// </summary>
                /// <param name="error">The exception to send to all observers.</param>
                var observer;
                checkDisposed.call(this);
                if (!this.isStopped) {
                    this.isStopped = true;
                    this.error = error;
                    this.hasError = true;
                    var now = this.scheduler.now();
                    this._trim(now);
                    var o = this.observers.slice(0);
                    for (var i = 0, len = o.length; i < len; i++) {
                        observer = o[i];
                        observer.onError(error);
                        observer.ensureActive();
                    }
                    this.observers = [];
                }
            },
            onCompleted: function () {
                /// <summary>
                /// Notifies all subscribed and future observers about the end of the sequence.
                /// </summary>
                var observer;
                checkDisposed.call(this);
                if (!this.isStopped) {
                    this.isStopped = true;
                    var now = this.scheduler.now();
                    this._trim(now);
                    var o = this.observers.slice(0);
                    for (var i = 0, len = o.length; i < len; i++) {
                        observer = o[i];
                        observer.onCompleted();
                        observer.ensureActive();
                    }
                    this.observers = [];
                }
            },
            dispose: function () {
                /// <summary>
                /// Releases all resources used by the current instance of the ReplaySubject class and unsubscribe all observers.
                /// </summary>
                this.isDisposed = true;
                this.observers = null;
            }
        });

        return ReplaySubject;
    }());

    var ConnectableObservable = (function () {
        inherits(ConnectableObservable, Observable);
        function ConnectableObservable(source, subject) {
            var state = {
                subject: subject,
                source: source.asObservable(),
                hasSubscription: false,
                subscription: null
            };

            this.connect = function () {
                if (!state.hasSubscription) {
                    state.hasSubscription = true;
                    state.subscription = new CompositeDisposable(state.source.subscribe(state.subject), disposableCreate(function () {
                        state.hasSubscription = false;
                    }));
                }
                return state.subscription;
            };

            var subscribe = function (observer) {
                return state.subject.subscribe(observer);
            };
            ConnectableObservable.super_.constructor.call(this, subscribe);
        }

        ConnectableObservable.prototype.connect = function () { return this.connect(); };
        ConnectableObservable.prototype.refCount = function () {
            var connectableSubscription = null,
            count = 0,
            source = this;
            return new AnonymousObservable(function (observer) {
                var shouldConnect, subscription;
                count++;
                shouldConnect = count === 1;
                subscription = source.subscribe(observer);
                if (shouldConnect) {
                    connectableSubscription = source.connect();
                }
                return disposableCreate(function () {
                    subscription.dispose();
                    count--;
                    if (count === 0) {
                        connectableSubscription.dispose();
                    }
                });
            });
        };

        return ConnectableObservable;
    }());

    return root;
}));