    observableProto.asObservable = function () {
        /// <summary>
        /// Hides the identity of an observable sequence.
        /// </summary>
        /// <returns>An observable sequence that hides the identity of the source sequence.</returns>        
        var source = this;
        return new AnonymousObservable(function (observer) {
            return source.subscribe(observer);
        });
    };

    observableProto.bufferWithCount = function (count, skip) {
        /// <summary>
        /// Projects each element of an observable sequence into zero or more buffers which are produced based on element count information.
        /// &#10;
        /// &#10;1 - xs.bufferWithCount(10);
        /// &#10;2 - xs.bufferWithCount(10, 1);
        /// </summary>
        /// <param name="count">Length of each buffer.</param>
        /// <param name="skip">[Optional] Number of elements to skip between creation of consecutive buffers. If not provided, defaults to the count.</param>
        /// <returns>An observable sequence of buffers.</returns>        
        if (skip === undefined) {
            skip = count;
        }
        return this.windowWithCount(count, skip).selectMany(function (x) {
            return x.toArray();
        }).where(function (x) {
            return x.length > 0;
        });
    };

    observableProto.dematerialize = function () {
        /// <summary>
        /// Dematerializes the explicit notification values of an observable sequence as implicit notifications.
        /// </summary>
        /// <returns>An observable sequence exhibiting the behavior corresponding to the source sequence's notification values.</returns>        
        var source = this;
        return new AnonymousObservable(function (observer) {
            return source.subscribe(function (x) {
                return x.accept(observer);
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    observableProto.distinctUntilChanged = function (keySelector, comparer) {
        /// <summary>
        /// Returns an observable sequence that contains only distinct contiguous elements according to the keySelector and the comparer.
        /// &#10;
        /// &#10;1 - var obs = observable.distinctUntilChanged();
        /// &#10;2 - var obs = observable.distinctUntilChanged(function (x) { return x.id; });
        /// &#10;3 - var obs = observable.distinctUntilChanged(function (x) { return x.id; }, function (x, y) { return x === y; });
        /// </summary>
        /// <param name="keySelector">[Optional] A function to compute the comparison key for each element. If not provided, it projects the value.</param>
        /// <param name="comparer">[Optional] Equality comparer for computed key values. If not provided, defaults to an equality comparer function.</param>
        /// <returns>An observable sequence only containing the distinct contiguous elements, based on a computed key value, from the source sequence.</returns>        
        var source = this;
        keySelector || (keySelector = identity);
        comparer || (comparer = defaultComparer);
        return new AnonymousObservable(function (observer) {
            var hasCurrentKey = false, currentKey;
            return source.subscribe(function (value) {
                var comparerEquals = false, key;
                try {
                    key = keySelector(value);
                } catch (exception) {
                    observer.onError(exception);
                    return;
                }
                if (hasCurrentKey) {
                    try {
                        comparerEquals = comparer(currentKey, key);
                    } catch (exception) {
                        observer.onError(exception);
                        return;
                    }
                }
                if (!hasCurrentKey || !comparerEquals) {
                    hasCurrentKey = true;
                    currentKey = key;
                    observer.onNext(value);
                }
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    observableProto.doAction = function (observerOrOnNext, onError, onCompleted) {
        /// <summary>
        /// Invokes an action for each element in the observable sequence and invokes an action upon graceful or exceptional termination of the observable sequence.
        /// This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
        /// &#10;
        /// &#10;1 - observable.doAction(observer);
        /// &#10;2 - observable.doAction(onNext);
        /// &#10;3 - observable.doAction(onNext, onError);
        /// &#10;4 - observable.doAction(onNext, onError, onCompleted);
        /// </summary>
        /// <param name="observerOrOnNext">Action to invoke for each element in the observable sequence or an observer.</param>
        /// <param name="onError">[Optional] Action to invoke upon exceptional termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.</param>
        /// <param name="onCompleted">[Optional] Action to invoke upon graceful termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.</param>
        /// <returns>The source sequence with the side-effecting behavior applied.</returns>        
        var source = this, onNextFunc;
        if (typeof observerOrOnNext === 'function') {
            onNextFunc = observerOrOnNext;
        } else {
            onNextFunc = observerOrOnNext.onNext.bind(observerOrOnNext);
            onError = observerOrOnNext.onError.bind(observerOrOnNext);
            onCompleted = observerOrOnNext.onCompleted.bind(observerOrOnNext);
        }
        return new AnonymousObservable(function (observer) {
            return source.subscribe(function (x) {
                try {
                    onNextFunc(x);
                } catch (e) {
                    observer.onError(e);
                }
                observer.onNext(x);
            }, function (exception) {
                if (!onError) {
                    observer.onError(exception);
                } else {
                    try {
                        onError(exception);
                    } catch (e) {
                        observer.onError(e);
                    }
                    observer.onError(exception);
                }
            }, function () {
                if (!onCompleted) {
                    observer.onCompleted();
                } else {
                    try {
                        onCompleted();
                    } catch (e) {
                        observer.onError(e);
                    }
                    observer.onCompleted();
                }
            });
        });
    };

    observableProto.finallyAction = function (action) {
        /// <summary>
        /// Invokes a specified action after the source observable sequence terminates gracefully or exceptionally.
        /// &#10;
        /// &#10;1 - obs = observable.finallyAction(function () { console.log('sequence ended'; });
        /// </summary>
        /// <param name="finallyAction">Action to invoke after the source observable sequence terminates.</param>
        /// <returns>Source sequence with the action-invoking termination behavior applied.</returns>        
        var source = this;
        return new AnonymousObservable(function (observer) {
            var subscription = source.subscribe(observer);
            return disposableCreate(function () {
                try {
                    subscription.dispose();
                } finally {
                    action();
                }
            });
        });
    };

    observableProto.ignoreElements = function () {
        /// <summary>
        /// Ignores all elements in an observable sequence leaving only the termination messages.
        /// </summary>
        /// <returns>An empty observable sequence that signals termination, successful or exceptional, of the source sequence.</returns>        
        var source = this;
        return new AnonymousObservable(function (observer) {
            return source.subscribe(noop, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    observableProto.materialize = function () {
        /// <summary>
        /// Materializes the implicit notifications of an observable sequence as explicit notification values.
        /// </summary>
        /// <returns>An observable sequence containing the materialized notification values from the source sequence.</returns>        
        var source = this;
        return new AnonymousObservable(function (observer) {
            return source.subscribe(function (value) {
                observer.onNext(notificationCreateOnNext(value));
            }, function (exception) {
                observer.onNext(notificationCreateOnError(exception));
                observer.onCompleted();
            }, function () {
                observer.onNext(notificationCreateOnCompleted());
                observer.onCompleted();
            });
        });
    };

    observableProto.repeat = function (repeatCount) {
        /// <summary>
        /// Repeats the observable sequence a specified number of times. If the repeat count is not specified, the sequence repeats indefinitely.
        /// &#10;
        /// &#10;1 - repeated = source.repeat();
        /// &#10;2 - repeated = source.repeat(42);
        /// </summary>
        /// <param name="repeatCount">[Optional] Number of times to repeat the sequence. If not provided, repeats the sequence indefinitely.</param>
        /// <returns>The observable sequence producing the elements of the given sequence repeatedly.</returns>        
        return enumerableRepeat(this, repeatCount).concat();
    };

    observableProto.retry = function (retryCount) {
        /// <summary>
        /// Repeats the source observable sequence the specified number of times or until it successfully terminates. If the retry count is not specified, it retries indefinitely.
        /// &#10;
        /// &#10;1 - retried = retry.repeat();
        /// &#10;2 - retried = retry.repeat(42);
        /// </summary>
        /// <param name="retryCount">[Optional] Number of times to retry the sequence. If not provided, retry the sequence indefinitely.</param>
        /// <returns>An observable sequence producing the elements of the given sequence repeatedly until it terminates successfully.</returns>        
        return enumerableRepeat(this, retryCount).catchException();
    };

    observableProto.scan = function () {
        /// <summary>
        /// Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.
        /// For aggregation behavior with no intermediate results, see Observable.aggregate.
        /// &#10;
        /// &#10;1 - scanned = source.scan(function (acc, x) { return acc + x; });
        /// &#10;2 - scanned = source.scan(0, function (acc, x) { return acc + x; });
        /// </summary>
        /// <param name="seed">[Optional] The initial accumulator value.</param>
        /// <param name="accumulator">An accumulator function to be invoked on each element.</param>
        /// <returns>An observable sequence containing the accumulated values.</returns>        
        var seed, hasSeed = false, accumulator;
        if (arguments.length === 2) {
            seed = arguments[0];
            accumulator = arguments[1];
            hasSeed = true;
        } else {
            accumulator = arguments[0];
        }
        var source = this;
        return observableDefer(function () {
            var hasAccumulation = false, accumulation;
            return source.select(function (x) {
                if (hasAccumulation) {
                    accumulation = accumulator(accumulation, x);
                } else {
                    accumulation = hasSeed ? accumulator(seed, x) : x;
                    hasAccumulation = true;
                }
                return accumulation;
            });
        });
    };

    observableProto.skipLast = function (count) {
        /// <summary>
        /// Bypasses a specified number of elements at the end of an observable sequence.
        /// </summary>
        /// <param name="count">Number of elements to bypass at the end of the source sequence.</param>
        /// <returns>An observable sequence containing the source sequence elements except for the bypassed ones at the end.</returns>
        /// <remarks>
        /// This operator accumulates a queue with a length enough to store the first <paramref name="count"/> elements. As more elements are
        /// received, elements are taken from the front of the queue and produced on the result sequence. This causes elements to be delayed.
        /// </remarks>        
        var source = this;
        return new AnonymousObservable(function (observer) {
            var q = [];
            return source.subscribe(function (x) {
                q.push(x);
                if (q.length > count) {
                    observer.onNext(q.shift());
                }
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    observableProto.startWith = function () {
        /// <summary>
        /// Prepends a sequence of values to an observable sequence with an optional scheduler and an argument list of values to prepend.
        /// &#10;
        /// &#10;1 - source.startWith(1, 2, 3);
        /// &#10;2 - source.startWith(Rx.Scheduler.timeout, 1, 2, 3);
        /// </summary>
        /// <returns>The source sequence prepended with the specified values.</returns>        
        var values, scheduler, start = 0;
        if (arguments.length > 0 && arguments[0] != null && arguments[0].now !== undefined) {
            scheduler = arguments[0];
            start = 1;
        } else {
            scheduler = immediateScheduler;
        }
        values = slice.call(arguments, start);
        return enumerableFor([observableFromArray(values, scheduler), this]).concat();
    };

    observableProto.takeLast = function (count, scheduler) {
        /// <summary>
        /// Returns a specified number of contiguous elements from the end of an observable sequence, using an optional scheduler to drain the queue.
        /// &#10;
        /// &#10;1 - obs = source.takeLast(5);
        /// &#10;2 - obs = source.takeLast(5, Rx.Scheduler.timeout);
        /// </summary>
        /// <param name="count">Number of elements to take from the end of the source sequence.</param>
        /// <param name="scheduler">[Optional] Scheduler used to drain the queue upon completion of the source sequence.</param>
        /// <returns>An observable sequence containing the specified number of elements from the end of the source sequence.</returns>
        /// <remarks>
        /// This operator accumulates a buffer with a length enough to store elements <paramref name="count"/> elements. Upon completion of
        /// the source sequence, this buffer is drained on the result sequence. This causes the elements to be delayed.
        /// </remarks>        
        return this.takeLastBuffer(count).selectMany(function (xs) { return observableFromArray(xs, scheduler); });
    };

    observableProto.takeLastBuffer = function (count) {
        /// <summary>
        /// Returns an array with the specified number of contiguous elements from the end of an observable sequence.
        /// </summary>
        /// <param name="count">Number of elements to take from the end of the source sequence.</param>
        /// <returns>An observable sequence containing a single array with the specified number of elements from the end of the source sequence.</returns>
        /// <remarks>
        /// This operator accumulates a buffer with a length enough to store <paramref name="count"/> elements. Upon completion of the
        /// source sequence, this buffer is produced on the result sequence.
        /// </remarks>        
        var source = this;
        return new AnonymousObservable(function (observer) {
            var q = [];
            return source.subscribe(function (x) {
                q.push(x);
                if (q.length > count) {
                    q.shift();
                }
            }, observer.onError.bind(observer), function () {
                observer.onNext(q);
                observer.onCompleted();
            });
        });
    };

    observableProto.windowWithCount = function (count, skip) {
        /// <summary>
        /// Projects each element of an observable sequence into zero or more windows which are produced based on element count information.
        /// &#10;
        /// &#10;1 - xs.windowWithCount(10);
        /// &#10;2 - xs.windowWithCount(10, 1);
        /// </summary>
        /// <param name="count">Length of each window.</param>
        /// <param name="skip">[Optional] Number of elements to skip between creation of consecutive windows. If not specified, defaults to the count.</param>
        /// <returns>An observable sequence of windows.</returns>        
        var source = this;
        if (count <= 0) {
            throw new Error(argumentOutOfRange);
        }
        if (skip === undefined) {
            skip = count;
        }
        if (skip <= 0) {
            throw new Error(argumentOutOfRange);
        }
        return new AnonymousObservable(function (observer) {
            var m = new SingleAssignmentDisposable(),
                refCountDisposable = new RefCountDisposable(m),
                n = 0,
                q = [],
                createWindow = function () {
                    var s = new Subject();
                    q.push(s);
                    observer.onNext(addRef(s, refCountDisposable));
                };
            createWindow();
            m.setDisposable(source.subscribe(function (x) {
                var s;
                for (var i = 0, len = q.length; i < len; i++) {
                    q[i].onNext(x);
                }
                var c = n - count + 1;
                if (c >= 0 && c % skip === 0) {
                    s = q.shift();
                    s.onCompleted();
                }
                n++;
                if (n % skip === 0) {
                    createWindow();
                }
            }, function (exception) {
                while (q.length > 0) {
                    q.shift().onError(exception);
                }
                observer.onError(exception);
            }, function () {
                while (q.length > 0) {
                    q.shift().onCompleted();
                }
                observer.onCompleted();
            }));
            return refCountDisposable;
        });
    };
