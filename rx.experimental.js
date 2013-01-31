// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

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
        observableCreateWithDisposable = Observable.createWithDisposable,
        observableConcat = Observable.concat,
        observableDefer = Observable.defer,
        observableEmpty = Observable.empty,
        disposableEmpty = root.Disposable.empty,
        BinaryObserver = root.Internals.BinaryObserver,
        CompositeDisposable = root.CompositeDisposable,
        SerialDisposable = root.SerialDisposable,
        SingleAssignmentDisposable = root.SingleAssignmentDisposable,
        enumeratorCreate = root.Internals.Enumerator.create,
        Enumerable = root.Internals.Enumerable,
        enumerableForEach = Enumerable.forEach,
        immediateScheduler = root.Scheduler.immediate,
        slice = Array.prototype.slice;

    // Utilities
    function argsOrArray(args, idx) {
        return args.length === 1 && Array.isArray(args[idx]) ?
            args[idx] :
            slice.call(args);
    }

   function enumerableWhile(condition, source) {
        return new Enumerable(function () {
            var current;
            return enumeratorCreate(function () {
                if (condition()) {
                    current = source;
                    return true;
                }
                return false;
            }, function () { return current; });
        });
    }

     /**
     *  Returns an observable sequence that is the result of invoking the selector on the source sequence, without sharing subscriptions.
     *  This operator allows for a fluent style of writing queries that use the same sequence multiple times.
     *  
     *  @param source Source sequence that will be shared in the selector function.
     *  @param selector Selector function which can use the source sequence as many times as needed, without sharing subscriptions to the source sequence.
     *  @return An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
     */
    observableProto.letBind = function (func) {
        return func(this);
    };

     /**
     *  Determines whether an observable collection contains values.
     *  
     *  1 - res = Rx.Observable.ifThen(condition, obs1);
     *  2 - res = Rx.Observable.ifThen(condition, obs1, obs2);
     *  3 - res = Rx.Observable.ifThen(condition, obs1, scheduler);    
     *  
     *  @param condition The condition which determines if the thenSource or elseSource will be run.
     *  @param thenSource The observable sequence that will be run if the condition function returns true.
     *  @param elseSource 
     *      [Optional] The observable sequence that will be run if the condition function returns false. If this is not provided, it defaults to Rx.Observabe.Empty with the specified scheduler.
     *       
     *  @return An observable sequence which is either the thenSource or elseSource.
     */
    Observable.ifThen = function (condition, thenSource, elseSourceOrScheduler) {
        return observableDefer(function () {
            elseSourceOrScheduler || (elseSourceOrScheduler = observableEmpty());
            if (elseSourceOrScheduler.now) {
                var scheduler = elseSourceOrScheduler;
                elseSourceOrScheduler = observableEmpty(scheduler);
            }
            return condition() ? thenSource : elseSourceOrScheduler;
        });
    };

     /**
     *  Concatenates the observable sequences obtained by running the specified result selector for each element in source.
     *  
     *  @param sources An array of values to turn into an observable sequence.
     *  @param resultSelector A function to apply to each item in the sources array to turn it into an observable sequence.
     *  @return An observable sequence from the concatenated observable sequences.  
     */ 
    Observable.forIn = function (sources, resultSelector) {
        return enumerableForEach(sources, resultSelector).concat();
    };

     /**
     *  Repeats source as long as condition holds emulating a while loop.
     *  
     *  @param condition The condition which determines if the source will be repeated.
     *  @param source The observable sequence that will be run if the condition function returns true.
     *  @return An observable sequence which is repeated as long as the condition holds.  
     */
    var observableWhileDo = Observable.whileDo = function (condition, source) {
        return enumerableWhile(condition, source).concat();
    };

     /**
     *  Repeats source as long as condition holds emulating a do while loop.
     *  
     *  @param condition The condition which determines if the source will be repeated.
     *  @param source The observable sequence that will be run if the condition function returns true.
     *  @return An observable sequence which is repeated as long as the condition holds. 
     */ 
    observableProto.doWhile = function (condition) {
        return observableConcat([this, observableWhileDo(condition, this)]);
    };

     /**
     *  Uses selector to determine which source in sources to use.
     *  
     *  1 - res = Rx.Observable.switchCase(selector, { '1': obs1, '2': obs2 });
     *  1 - res = Rx.Observable.switchCase(selector, { '1': obs1, '2': obs2 }, obs0);
     *  1 - res = Rx.Observable.switchCase(selector, { '1': obs1, '2': obs2 }, scheduler);  
     *  
     *  @param selector The function which extracts the value for to test in a case statement.
     *  @param sources A object which has keys which correspond to the case statement labels.
     *  @param elseSource 
     *      [Optional] The observable sequence that will be run if the sources are not matched. If this is not provided, it defaults to Rx.Observabe.Empty with the specified scheduler.
     *       
     *  @return An observable sequence which is determined by a case statement.  
     */
    Observable.switchCase = function (selector, sources, defaultSourceOrScheduler) {
        return observableDefer(function () {
            defaultSourceOrScheduler || (defaultSourceOrScheduler = observableEmpty());
            if (defaultSourceOrScheduler.now) {
                var scheduler = defaultSourceOrScheduler;
                defaultSourceOrScheduler = observableEmpty(scheduler);
            }
            var result = sources[selector()];
            return result !== undefined ? result : defaultSourceOrScheduler;
        });
    };

     /**
     *  Expands an observable sequence by recursively invoking selector.
     *  
     *  @param selector Selector function to invoke for each produced element, resulting in another sequence to which the selector will be invoked recursively again.
     *  @param scheduler [Optional] Scheduler on which to perform the expansion. If not provided, this defaults to the current thread scheduler.
     *  @return An observable sequence containing all the elements produced by the recursive expansion.
     */
    observableProto.expand = function (selector, scheduler) {
        scheduler || (scheduler = immediateScheduler);
        var source = this;
        return observableCreateWithDisposable(function (observer) {
            var q = [],
                m = new SerialDisposable(),
                d = new CompositeDisposable(m),
                activeCount = 0,
                isAcquired = false;

            var ensureActive = function () {
                var isOwner = false;
                if (q.length > 0) {
                    isOwner = !isAcquired;
                    isAcquired = true;
                }
                if (isOwner) {
                    m.setDisposable(scheduler.scheduleRecursive(function (self) {
                        var work;
                        if (q.length > 0) {
                            work = q.shift();
                        } else {
                            isAcquired = false;
                            return;
                        }
                        var m1 = new SingleAssignmentDisposable();
                        d.add(m1);
                        m1.setDisposable(work.subscribe(function (x) {
                            observer.onNext(x);
                            var result = null;
                            try {
                                result = selector(x);
                            } catch (e) {
                                observer.onError(e);
                            }
                            q.push(result);
                            activeCount++;
                            ensureActive();
                        }, observer.onError.bind(observer), function () {
                            d.remove(m1);
                            activeCount--;
                            if (activeCount === 0) {
                                observer.onCompleted();
                            }
                        }));
                        self();
                    }));
                }
            };

            q.push(source);
            activeCount++;
            ensureActive();
            return d;
        });
    };

     /**
     *  Runs all observable sequences in parallel and collect their last elements.
     *  
     *  1 - res = Rx.Observable.forkJoin([obs1, obs2]);
     *  1 - res = Rx.Observable.forkJoin(obs1, obs2, ...);  
     *  
     *  @return An observable sequence with an array collecting the last elements of all the input sequences.
     */
    Observable.forkJoin = function () {
        var allSources = argsOrArray(arguments, 0);
        return observableCreateWithDisposable(function (subscriber) {
            var count = allSources.length;
            if (count === 0) {
                subscriber.onCompleted();
                return disposableEmpty;
            }
            var group = new CompositeDisposable(),
                finished = false,
                hasResults = new Array(count),
                hasCompleted = new Array(count),
                results = new Array(count);

            for (var idx = 0; idx < count; idx++) {
                (function (i) {
                    var source = allSources[i];
                    group.add(source.subscribe(function (value) {
                        if (!finished) {
                            hasResults[i] = true;
                            results[i] = value;
                        }
                    }, function (e) {
                        finished = true;
                        subscriber.onError(e);
                        group.dispose();
                    }, function () {
                        if (!finished) {
                            if (!hasResults[i]) {
                                subscriber.onCompleted();
                                return;
                            }
                            hasCompleted[i] = true;
                            for (var ix = 0; ix < count; ix++) {
                                if (!hasCompleted[ix]) {
                                    return;
                                }
                            }
                            finished = true;
                            subscriber.onNext(results);
                            subscriber.onCompleted();
                        }
                    }));
                })(idx);
            }

            return group;
        });
    };

     /**
     *  Runs two observable sequences in parallel and combines their last elemenets.
     *  
     *  @param second Second observable sequence.
     *  @param resultSelector Result selector function to invoke with the last elements of both sequences.
     *  @return An observable sequence with the result of calling the selector function with the last elements of both input sequences.
     */
    observableProto.forkJoin = function (second, resultSelector) {
        var first = this;

        return observableCreateWithDisposable(function (observer) {
            var leftStopped = false, rightStopped = false,
                hasLeft = false, hasRight = false,
                lastLeft, lastRight,
                leftSubscription = new SingleAssignmentDisposable(), rightSubscription = new SingleAssignmentDisposable();
      
            leftSubscription.setDisposable(
                first.subscribe(function (left) {
                    hasLeft = true;
                    lastLeft = left;
                }, function (err) {
                    rightSubscription.dispose();
                    observer.onError(err);
                }, function () {
                    leftStopped = true;
                    if (rightStopped) {
                        if (!hasLeft) {
                            observer.onCompleted();
                        } else if (!hasRight) {
                            observer.onCompleted();
                        } else {
                            var result;
                            try {
                                result = resultSelector(lastLeft, lastRight);
                            } catch (e) {
                                observer.onError(e);
                                return;
                            }
                            observer.onNext(result);
                            observer.onCompleted();
                        }
                    }
                })
            );

            rightSubscription.setDisposable(
                second.subscribe(function (right) {
                    hasRight = true;
                    lastRight = right;
                }, function (err) {
                    leftSubscription.dispose();
                    observer.onError(err);
                }, function () {
                    rightStopped = true;
                    if (leftStopped) {
                        if (!hasLeft) {
                            observer.onCompleted();
                        } else if (!hasRight) {
                            observer.onCompleted();
                        } else {
                            var result;
                            try {
                                result = resultSelector(lastLeft, lastRight);
                            } catch (e) {
                                observer.onError(e);
                                return;
                            }
                            observer.onNext(result);
                            observer.onCompleted();
                        }
                    }
                })
            );

            return new CompositeDisposable(leftSubscription, rightSubscription);
        });
    };

    return root;
}));