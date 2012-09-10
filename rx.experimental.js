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

    observableProto.letBind = function (func) {
        return func(this);
    };

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

    Observable.forIn = function (sources, resultSelector) {
        return enumerableForEach(sources, resultSelector).concat();
    };

    var observableWhileDo = Observable.whileDo = function (condition, source) {
        return enumerableWhile(condition, source).concat();
    };

    observableProto.doWhile = function (condition) {
        return observableConcat([this, observableWhileDo(condition, this)]);
    };

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