    observableProto.amb = function (rightSource) {
        /// <summary>
        /// Propagates the observable sequence that reacts first.
        /// </summary>
        /// <param name="rightSource">Second observable sequence.</param>
        /// <returns>An observable sequence that surfaces either of the given sequences, whichever reacted first.</returns>        
        var leftSource = this;
        return new AnonymousObservable(function (observer) {

            var choice,
                leftSubscription = new SingleAssignmentDisposable(),
                rightSubscription = new SingleAssignmentDisposable();

            function choiceL() {
                if (!choice) {
                    choice = 'L';
                    rightSubscription.dispose();
                }
            }

            function choiceR() {
                if (!choice) {
                    choice = 'R';
                    leftSubscription.dispose();
                }
            }

            leftSubscription.setDisposable(leftSource.subscribe(function (left) {
                choiceL();
                if (choice === 'L') {
                    observer.onNext(left);
                }
            }, function (err) {
                choiceL();
                if (choice === 'L') {
                    observer.onError(err);
                }
            }, function () {
                choiceL();
                if (choice === 'L') {
                    observer.onCompleted();
                }
            }));

            rightSubscription.setDisposable(rightSource.subscribe(function (right) {
                choiceR();
                if (choice === 'R') {
                    observer.onNext(right);
                }
            }, function (err) {
                choiceR();
                if (choice === 'R') {
                    observer.onError(err);
                }
            }, function () {
                choiceR();
                if (choice === 'R') {
                    observer.onCompleted();
                }
            }));

            return new CompositeDisposable(leftSubscription, rightSubscription);
        });
    };

    Observable.amb = function () {
        /// <summary>
        /// Propagates the observable sequence that reacts first.
        /// &#10;
        /// &#10;E.g. winner = Rx.Observable.amb(xs, ys, zs);
        /// </summary>
        /// <param name="arguments">Observable sources competing to react first.</param>
        /// <returns>An observable sequence that surfaces any of the given sequences, whichever reacted first.</returns>        
        var acc = observableNever(),
            items = argsOrArray(arguments, 0);
        function func(previous, current) {
            return previous.amb(current);
        }
        for (var i = 0, len = items.length; i < len; i++) {
            acc = func(acc, items[i]);
        }
        return acc;
    };

    function observableCatchHandler(source, handler) {
        return new AnonymousObservable(function (observer) {
            var d1 = new SingleAssignmentDisposable(), subscription = new SerialDisposable();
            subscription.setDisposable(d1);
            d1.setDisposable(source.subscribe(observer.onNext.bind(observer), function (exception) {
                var d, result;
                try {
                    result = handler(exception);
                } catch (ex) {
                    observer.onError(ex);
                    return;
                }
                d = new SingleAssignmentDisposable();
                subscription.setDisposable(d);
                d.setDisposable(result.subscribe(observer));
            }, observer.onCompleted.bind(observer)));
            return subscription;
        });
    }

    observableProto.catchException = function (handlerOrSecond) {
        /// <summary>
        /// Continues an observable sequence that is terminated by an exception with the next observable sequence.
        /// &#10;
        /// &#10;1 - xs.catchException(ys)
        /// &#10;2 - xs.catchException(function (ex) { return ys(ex); })
        /// </summary>
        /// <param name="handlerOrSecond">Exception handler function that returns an observable sequence given the error that occurred in the first sequence, or a second observable sequence used to produce results when an error occurred in the first sequence.</param>
        /// <returns>An observable sequence containing the first sequence's elements, followed by the elements of the handler sequence in case an exception occurred.</returns>        
        if (typeof handlerOrSecond === 'function') {
            return observableCatchHandler(this, handlerOrSecond);
        }
        return observableCatch([this, handlerOrSecond]);
    };

    var observableCatch = Observable.catchException = function () {
        /// <summary>
        /// Continues an observable sequence that is terminated by an exception with the next observable sequence.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.catchException(/* argument list */ xs, ys, zs);
        /// &#10;2 - res = Rx.Observable.catchException(/* array */ [xs, ys, zs]);
        /// </summary>
        /// <param name="arguments">Observable sequences to catch exceptions for.</param>
        /// <returns>An observable sequence containing elements from consecutive source sequences until a source sequence terminates successfully.</returns>        
        var items = argsOrArray(arguments, 0);
        return enumerableFor(items).catchException();
    };

    observableProto.combineLatest = function () {
        /// <summary>
        /// Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences produces an element.
        /// &#10;
        /// &#10;1 - obs = observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
        /// </summary>
        /// <param name="resultSelector">Function to invoke whenever any of the sources produces an element.</param>
        /// <returns>An observable sequence containing the result of combining elements of the sources using the specified result selector function.</returns>        
        var parent = this, args = slice.call(arguments), resultSelector = args.pop();
        args.unshift(this);
        return new AnonymousObservable(function (observer) {
            var falseFactory = function () { return false; },
                n = args.length,
                hasValue = arrayInitialize(n, falseFactory),
                hasValueAll = false,
                isDone = arrayInitialize(n, falseFactory),
                values = new Array(n);

            function next(i) {
                var res;
                hasValue[i] = true;
                if (hasValueAll || (hasValueAll = hasValue.every(function (x) { return x; }))) {
                    try {
                        res = resultSelector.apply(parent, values);
                    } catch (ex) {
                        observer.onError(ex);
                        return;
                    }
                    observer.onNext(res);
                } else if (isDone.filter(function (x, j) { return j !== i; }).every(function (x) { return x; })) {
                    observer.onCompleted();
                }
            }

            function done (i) {
                isDone[i] = true;
                if (isDone.every(function (x) { return x; })) {
                    observer.onCompleted();
                }
            }

            var subscriptions = new Array(n);
            for (var idx = 0; idx < n; idx++) {
                (function (i) {
                    subscriptions[i] = new SingleAssignmentDisposable();
                    subscriptions[i].setDisposable(args[i].subscribe(function (x) {
                        values[i] = x;
                        next(i);
                    }, observer.onError.bind(observer), function () {
                        done(i);
                    }));
                })(idx);
            }

            return new CompositeDisposable(subscriptions);
        });
    };

    observableProto.concat = function () {
        /// <summary>
        /// Concatenates all the observable sequences.  This takes in either an array or variable arguments to concatenate.
        /// &#10;
        /// &#10;1 - concatenated = xs.concat(/* argument list */ ys, zs);
        /// &#10;2 - concatenated = xs.concat(/* array */ [ys, zs]);
        /// </summary>
        /// <returns>An observable sequence that contains the elements of each given sequence, in sequential order.</returns>        
        var items = slice.call(arguments, 0);
        items.unshift(this);
        return observableConcat.apply(this, items);
    };

    var observableConcat = Observable.concat = function () {
        /// <summary>
        /// Concatenates all the observable sequences.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.concat(/* argument list */ xs, ys, zs);
        /// &#10;2 - res = Rx.Observable.concat(/* array */ [xs, ys, zs]);
        /// </summary>
        /// <param name="arguments">Observable sequences to concatenate.</param>
        /// <returns>An observable sequence that contains the elements of each given sequence, in sequential order.</returns>        
        var sources = argsOrArray(arguments, 0);
        return enumerableFor(sources).concat();
    };

    observableProto.concatObservable = function () {
        /// <summary>
        /// Concatenates an observable sequence of observable sequences.
        /// </summary>
        /// <returns>An observable sequence that contains the elements of each observed inner sequence, in sequential order.</returns>        
        return this.merge(1);
    };

    observableProto.merge = function (maxConcurrentOrOther) {
        /// <summary>
        /// Merges an observable sequence of observable sequences into an observable sequence, limiting the number of concurrent subscriptions to inner sequences.
        /// Or merges two observable sequences into a single observable sequence.
        /// &#10;
        /// &#10;1 - merged = sources.merge(1);
        /// &#10;2 - merged = source.merge(otherSource);  
        /// </summary>
        /// <param name="maxConcurrentOrOther">[Optional] Maximum number of inner observable sequences being subscribed to concurrently or the second observable sequence.</param>
        /// <returns>The observable sequence that merges the elements of the inner sequences.</returns>        
        if (typeof maxConcurrentOrOther !== 'number') {
            return observableMerge(this, maxConcurrentOrOther);
        }
        var sources = this;
        return new AnonymousObservable(function (observer) {
            var activeCount = 0,
                group = new CompositeDisposable(),
                isStopped = false,
                q = [],
                subscribe = function (xs) {
                    var subscription = new SingleAssignmentDisposable();
                    group.add(subscription);
                    subscription.setDisposable(xs.subscribe(observer.onNext.bind(observer), observer.onError.bind(observer), function () {
                        var s;
                        group.remove(subscription);
                        if (q.length > 0) {
                            s = q.shift();
                            subscribe(s);
                        } else {
                            activeCount--;
                            if (isStopped && activeCount === 0) {
                                observer.onCompleted();
                            }
                        }
                    }));
                };
            group.add(sources.subscribe(function (innerSource) {
                if (activeCount < maxConcurrentOrOther) {
                    activeCount++;
                    subscribe(innerSource);
                } else {
                    q.push(innerSource);
                }
            }, observer.onError.bind(observer), function () {
                isStopped = true;
                if (activeCount === 0) {
                    observer.onCompleted();
                }
            }));
            return group;
        });
    };

    var observableMerge = Observable.merge = function () {
        /// <summary>
        /// Merges all the observable sequences into a single observable sequence.
        /// &#10;
        /// &#10;1 - merged = Rx.Observable.merge(/* argument list */ xs, ys, zs);
        /// &#10;2 - merged = Rx.Observable.merge(/* array */ [xs, ys, zs]);
        /// &#10;3 - merged = Rx.Observable.merge(scheduler, /* argument list */ xs, ys, zs);
        /// &#10;4 - merged = Rx.Observable.merge(scheduler, /* array */ [xs, ys, zs]);    
        /// </summary>
        /// <param name="scheduler">[Optional] Scheduler to run the enumeration of the sequence of sources on. If not specified, the immediate scheduler is used.</param>
        /// <param name="arguments">Observable sequences to merge.</param>
        /// <returns>The observable sequence that merges the elements of the observable sequences.</returns>        
        var scheduler, sources;
        if (!arguments[0]) {
            scheduler = immediateScheduler;
            sources = slice.call(arguments, 1);
        } else if (arguments[0].now) {
            scheduler = arguments[0];
            sources = slice.call(arguments, 1);
        } else {
            scheduler = immediateScheduler;
            sources = slice.call(arguments, 0);
        }
        if (Array.isArray(sources[0])) {
            sources = sources[0];
        }
        return observableFromArray(sources, scheduler).mergeObservable();
    };    

    observableProto.mergeObservable = function () {
        /// <summary>
        /// Merges an observable sequence of observable sequences into an observable sequence.
        /// </summary>
        /// <returns>The observable sequence that merges the elements of the inner sequences.</returns>        
        var sources = this;
        return new AnonymousObservable(function (observer) {
            var group = new CompositeDisposable(),
                isStopped = false,
                m = new SingleAssignmentDisposable();
            group.add(m);
            m.setDisposable(sources.subscribe(function (innerSource) {
                var innerSubscription = new SingleAssignmentDisposable();
                group.add(innerSubscription);
                innerSubscription.setDisposable(innerSource.subscribe(function (x) {
                    observer.onNext(x);
                }, observer.onError.bind(observer), function () {
                    group.remove(innerSubscription);
                    if (isStopped && group.length === 1) {
                        observer.onCompleted();
                    }
                }));
            }, observer.onError.bind(observer), function () {
                isStopped = true;
                if (group.length === 1) {
                    observer.onCompleted();
                }
            }));
            return group;
        });
    };

    observableProto.onErrorResumeNext = function (second) {
        /// <summary>
        /// Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
        /// </summary>
        /// <param name="second">Second observable sequence used to produce results after the first sequence terminates.</param>
        /// <returns>An observable sequence that concatenates the first and second sequence, even if the first sequence terminates exceptionally.</returns>        
        if (!second) {
            throw new Error('Second observable is required');
        }
        return onErrorResumeNext([this, second]);
    };

    var onErrorResumeNext = Observable.onErrorResumeNext = function () {
        /// <summary>
        /// Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.onErrorResumeNext(/* argument list */ xs, ys, zs);
        /// &#10;1 - res = Rx.Observable.onErrorResumeNext(/* array */ [xs, ys, zs]);
        /// </summary>
        /// <param name="arguments">Observable sequences to concatenate.</param>
        /// <returns>An observable sequence that concatenates the source sequences, even if a sequence terminates exceptionally.</returns>        
        var sources = argsOrArray(arguments, 0);
        return new AnonymousObservable(function (observer) {
            var pos = 0, subscription = new SerialDisposable(),
            cancelable = immediateScheduler.scheduleRecursive(function (self) {
                var current, d;
                if (pos < sources.length) {
                    current = sources[pos++];
                    d = new SingleAssignmentDisposable();
                    subscription.setDisposable(d);
                    d.setDisposable(current.subscribe(observer.onNext.bind(observer), function () {
                        self();
                    }, function () {
                        self();
                    }));
                } else {
                    observer.onCompleted();
                }
            });
            return new CompositeDisposable(subscription, cancelable);
        });
    };

    observableProto.skipUntil = function (other) {
        /// <summary>
        /// Returns the values from the source observable sequence only after the other observable sequence produces a value.
        /// </summary>
        /// <param name="other">The observable sequence that triggers propagation of elements of the source sequence.</param>
        /// <returns>An observable sequence containing the elements of the source sequence starting from the point the other sequence triggered propagation.</returns>        
        var source = this;
        return new AnonymousObservable(function (observer) {
            var isOpen = false;
            var disposables = new CompositeDisposable(source.subscribe(function (left) {
                if (isOpen) {
                    observer.onNext(left);
                }
            }, observer.onError.bind(observer), function () {
                if (isOpen) {
                    observer.onCompleted();
                }
            }));

            var rightSubscription = new SingleAssignmentDisposable();
            disposables.add(rightSubscription);
            rightSubscription.setDisposable(other.subscribe(function () {
                isOpen = true;
                rightSubscription.dispose();
            }, observer.onError.bind(observer), function () {
                rightSubscription.dispose();
            }));

            return disposables;
        });
    };

    observableProto.switchLatest = function () {
        /// <summary>
        /// Transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.
        /// </summary>
        /// <returns>The observable sequence that at any point in time produces the elements of the most recent inner observable sequence that has been received.</returns>        
        var sources = this;
        return new AnonymousObservable(function (observer) {
            var hasLatest = false,
                innerSubscription = new SerialDisposable(),
                isStopped = false,
                latest = 0,
                subscription = sources.subscribe(function (innerSource) {
                    var d = new SingleAssignmentDisposable(), id = ++latest;
                    hasLatest = true;
                    innerSubscription.setDisposable(d);
                    d.setDisposable(innerSource.subscribe(function (x) {
                        if (latest === id) {
                            observer.onNext(x);
                        }
                    }, function (e) {
                        if (latest === id) {
                            observer.onError(e);
                        }
                    }, function () {
                        if (latest === id) {
                            hasLatest = false;
                            if (isStopped) {
                                observer.onCompleted();
                            }
                        }
                    }));
                }, observer.onError.bind(observer), function () {
                    isStopped = true;
                    if (!hasLatest) {
                        observer.onCompleted();
                    }
                });
            return new CompositeDisposable(subscription, innerSubscription);
        });
    };

    observableProto.takeUntil = function (other) {
        /// <summary>
        /// Returns the values from the source observable sequence until the other observable sequence produces a value.
        /// </summary>
        /// <param name="other">Observable sequence that terminates propagation of elements of the source sequence.</param>
        /// <returns>An observable sequence containing the elements of the source sequence up to the point the other sequence interrupted further propagation.</returns>        
        var source = this;
        return new AnonymousObservable(function (observer) {
            return new CompositeDisposable(
                source.subscribe(observer),
                other.subscribe(observer.onCompleted.bind(observer), observer.onError.bind(observer), noop)
            );
        });
    };

    function zipArray(second, resultSelector) {
        var first = this;
        return new AnonymousObservable(function (observer) {
            var index = 0, len = second.length;
            return first.subscribe(function (left) {
                if (index < len) {
                    var right = second[index++], result;
                    try {
                        result = resultSelector(left, right);
                    } catch (e) {
                        observer.onError(e);
                        return;
                    }
                    observer.onNext(result);
                } else {
                    observer.onCompleted();
                }
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    }    

    observableProto.zip = function () {
        /// <summary>
        /// Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
        /// &#10;
        /// &#10;1 - res = obs1.zip(obs2, fn);
        /// &#10;1 - res = x1.zip([1,2,3], fn);  
        /// </summary>
        /// <param name="resultSelector">Function to invoke for each series of elements at corresponding indexes in the sources.</param>
        /// <returns>An observable sequence containing the result of combining elements of the sources using the specified result selector function.</returns>        
        if (Array.isArray(arguments[0])) {
            return zipArray.apply(this, arguments);
        }
        var parent = this, sources = slice.call(arguments), resultSelector = sources.pop();
        sources.unshift(parent);
        return new AnonymousObservable(function (observer) {
            var n = sources.length,
              queues = arrayInitialize(n, function () { return []; }),
              isDone = arrayInitialize(n, function () { return false; });
            var next = function (i) {
                var res, queuedValues;
                if (queues.every(function (x) { return x.length > 0; })) {
                    try {
                        queuedValues = queues.map(function (x) { return x.shift(); });
                        res = resultSelector.apply(parent, queuedValues);
                    } catch (ex) {
                        observer.onError(ex);
                        return;
                    }
                    observer.onNext(res);
                } else if (isDone.filter(function (x, j) { return j !== i; }).every(function (x) { return x; })) {
                    observer.onCompleted();
                }
            };

            function done(i) {
                isDone[i] = true;
                if (isDone.every(function (x) { return x; })) {
                    observer.onCompleted();
                }
            }

            var subscriptions = new Array(n);
            for (var idx = 0; idx < n; idx++) {
                (function (i) {
                    subscriptions[i] = new SingleAssignmentDisposable();
                    subscriptions[i].setDisposable(sources[i].subscribe(function (x) {
                        queues[i].push(x);
                        next(i);
                    }, observer.onError.bind(observer), function () {
                        done(i);
                    }));
                })(idx);
            }

            return new CompositeDisposable(subscriptions);
        });
    };