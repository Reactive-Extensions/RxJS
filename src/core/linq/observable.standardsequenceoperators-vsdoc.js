    observableProto.defaultIfEmpty = function (defaultValue) {
        /// <summary>
        /// Returns the elements of the specified sequence or the specified value in a singleton sequence if the sequence is empty.
        /// &#10;
        /// &#10;1 - obs = xs.defaultIfEmpty();
        /// &#10;2 - obs = xs.defaultIfEmpty(false);
        /// </summary>
        /// <param name="defaultValue">The value to return if the sequence is empty. If not provided, this defaults to null.</param>
        /// <returns>An observable sequence that contains the specified default value if the source is empty; otherwise, the elements of the source itself.</returns>        
        var source = this;
        if (defaultValue === undefined) {
            defaultValue = null;
        }
        return new AnonymousObservable(function (observer) {
            var found = false;
            return source.subscribe(function (x) {
                found = true;
                observer.onNext(x);
            }, observer.onError.bind(observer), function () {
                if (!found) {
                    observer.onNext(defaultValue);
                }
                observer.onCompleted();
            });
        });
    };

   observableProto.distinct = function (keySelector, keySerializer) {
        /// <summary>
        /// Returns an observable sequence that contains only distinct elements according to the keySelector and the comparer.
        /// &#10;
        /// &#10;1 - obs = xs.distinct();
        /// &#10;2 - obs = xs.distinct(function (x) { return x.id; });
        /// &#10;2 - obs = xs.distinct(function (x) { return x.id; }, function (x) { return x.toString(); });
        /// </summary>
        /// <param name="keySelector">[Optional] A function to compute the comparison key for each element.</param>
        /// <param name="keySerializer">[Optional] Used to serialize the given object into a string for object comparison.</param>
        /// <returns>An observable sequence only containing the distinct elements, based on a computed key value, from the source sequence.</returns>
        /// <remarks>Usage of this operator should be considered carefully due to the maintenance of an internal lookup structure which can grow large.</remarks>    
        var source = this;
        keySelector || (keySelector = identity);
        keySerializer || (keySerializer = defaultKeySerializer);
        return new AnonymousObservable(function (observer) {
            var hashSet = {};
            return source.subscribe(function (x) {
                var key, serializedKey, otherKey, hasMatch = false;
                try {
                    key = keySelector(x);
                    serializedKey = keySerializer(key);
                } catch (exception) {
                    observer.onError(exception);
                    return;
                }
                for (otherKey in hashSet) {
                    if (serializedKey === otherKey) {
                        hasMatch = true;
                        break;
                    }
                }
                if (!hasMatch) {
                    hashSet[serializedKey] = null;
                    observer.onNext(x);
                }
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    observableProto.groupBy = function (keySelector, elementSelector, keySerializer) {
        /// <summary>
        /// Groups the elements of an observable sequence according to a specified key selector function and comparer and selects the resulting elements by using a specified function.
        /// &#10;
        /// &#10;1 - observable.groupBy(function (x) { return x.id; });
        /// &#10;2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; });
        /// &#10;3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; }, function (x) { return x.toString(); });
        /// </summary>
        /// <param name="keySelector">A function to extract the key for each element.</param>
        /// <param name="elementSelector">[Optional] A function to map each source element to an element in an observable group.</param>
        /// <param name="keySerializer">[Optional] Used to serialize the given object into a string for object comparison.</param>
        /// <returns>A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.</returns>        
        return this.groupByUntil(keySelector, elementSelector, function () {
            return observableNever();
        }, keySerializer);
    };

    observableProto.groupByUntil = function (keySelector, elementSelector, durationSelector, keySerializer) {
        /// <summary>
        /// Groups the elements of an observable sequence according to a specified key selector function.
        /// A duration selector function is used to control the lifetime of groups. When a group expires, it receives an OnCompleted notification. When a new element with the same
        /// key value as a reclaimed group occurs, the group will be reborn with a new lifetime request.
        /// &#10;
        /// &#10;1 - observable.groupByUntil(function (x) { return x.id; }, null,  function () { return Rx.Observable.never(); });
        /// &#10;2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); });
        /// &#10;3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); }, function (x) { return x.toString(); });
        /// </summary>
        /// <param name="keySelector">A function to extract the key for each element.</param>
        /// <param name="durationSelector">A function to signal the expiration of a group.</param>
        /// <param name="keySerializer">[Optional] Used to serialize the given object into a string for object comparison.</param>
        /// <returns>
        /// A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.
        /// If a group's lifetime expires, a new group with the same key value can be created once an element with such a key value is encoutered.
        /// </returns>        
        var source = this;
        elementSelector || (elementSelector = identity);
        keySerializer || (keySerializer = defaultKeySerializer);
        return new AnonymousObservable(function (observer) {
            var map = {},
                groupDisposable = new CompositeDisposable(),
                refCountDisposable = new RefCountDisposable(groupDisposable);
            groupDisposable.add(source.subscribe(function (x) {
                var duration, durationGroup, element, expire, fireNewMapEntry, group, key, serializedKey, md, writer, w;
                try {
                    key = keySelector(x);
                    serializedKey = keySerializer(key);
                } catch (e) {
                    for (w in map) {
                        map[w].onError(e);
                    }
                    observer.onError(e);
                    return;
                }
                fireNewMapEntry = false;
                try {
                    writer = map[serializedKey];
                    if (!writer) {
                        writer = new Subject();
                        map[serializedKey] = writer;
                        fireNewMapEntry = true;
                    }
                } catch (e) {
                    for (w in map) {
                        map[w].onError(e);
                    }
                    observer.onError(e);
                    return;
                }
                if (fireNewMapEntry) {
                    group = new GroupedObservable(key, writer, refCountDisposable);
                    durationGroup = new GroupedObservable(key, writer);
                    try {
                        duration = durationSelector(durationGroup);
                    } catch (e) {
                        for (w in map) {
                            map[w].onError(e);
                        }
                        observer.onError(e);
                        return;
                    }
                    observer.onNext(group);
                    md = new SingleAssignmentDisposable();
                    groupDisposable.add(md);
                    expire = function () {
                        if (map[serializedKey] !== undefined) {
                            delete map[serializedKey];
                            writer.onCompleted();
                        }
                        groupDisposable.remove(md);
                    };
                    md.setDisposable(duration.take(1).subscribe(function () { }, function (exn) {
                        for (w in map) {
                            map[w].onError(exn);
                        }
                        observer.onError(exn);
                    }, function () {
                        expire();
                    }));
                }
                try {
                    element = elementSelector(x);
                } catch (e) {
                    for (w in map) {
                        map[w].onError(e);
                    }
                    observer.onError(e);
                    return;
                }
                writer.onNext(element);
            }, function (ex) {
                for (var w in map) {
                    map[w].onError(ex);
                }
                observer.onError(ex);
            }, function () {
                for (var w in map) {
                    map[w].onCompleted();
                }
                observer.onCompleted();
            }));
            return refCountDisposable;
        });
    };

    observableProto.select = function (selector) {
        /// <summary>
        /// Projects each element of an observable sequence into a new form by incorporating the element's index.
        /// &#10;
        /// &#10;1 - source.select(function (value) { return value * value; });
        /// &#10;2 - source.select(function (value, index) { return value * value + index; });
        /// </summary>
        /// <param name="selector">A transform function to apply to each source element; the second parameter of the function represents the index of the source element.</param>
        /// <returns>An observable sequence whose elements are the result of invoking the transform function on each element of source.</returns>        
        var parent = this;
        return new AnonymousObservable(function (observer) {
            var count = 0;
            return parent.subscribe(function (value) {
                var result;
                try {
                    result = selector(value, count++);
                } catch (exception) {
                    observer.onError(exception);
                    return;
                }
                observer.onNext(result);
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    function selectMany(selector) {
        return this.select(selector).mergeObservable();
    }

    observableProto.selectMany = function (selector, resultSelector) {
        /// <summary>
        /// One of the Following:
        /// Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
        /// &#10;
        /// &#10;1 - source.selectMany(function (x) { return Rx.Observable.range(0, x); });
        /// Or:
        /// Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.
        /// &#10;
        /// &#10;1 - source.selectMany(function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
        /// Or:
        /// Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
        /// &#10;
        /// &#10;1 - source.selectMany(Rx.Observable.fromArray([1,2,3]));
        /// </summary>
        /// <param name="selector">A transform function to apply to each element or an observable sequence to project each element from the source sequence onto.</param>
        /// <param name="resultSelector">[Optional] A transform function to apply to each element of the intermediate sequence.</param>
        /// <returns>An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.</returns>        
        if (resultSelector) {
            return this.selectMany(function (x) {
                return selector(x).select(function (y) {
                    return resultSelector(x, y);
                });
            });
        }
        if (typeof selector === 'function') {
            return selectMany.call(this, selector);
        }
        return selectMany.call(this, function () {
            return selector;
        });
    };

    observableProto.skip = function (count) {
        /// <summary>
        /// Bypasses a specified number of elements in an observable sequence and then returns the remaining elements.
        /// </summary>
        /// <param name="count">The number of elements to skip before returning the remaining elements.</param>
        /// <returns>An observable sequence that contains the elements that occur after the specified index in the input sequence.</returns>        
        if (count < 0) {
            throw new Error(argumentOutOfRange);
        }
        var observable = this;
        return new AnonymousObservable(function (observer) {
            var remaining = count;
            return observable.subscribe(function (x) {
                if (remaining <= 0) {
                    observer.onNext(x);
                } else {
                    remaining--;
                }
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    observableProto.skipWhile = function (predicate) {
        /// <summary>
        /// Bypasses elements in an observable sequence as long as a specified condition is true and then returns the remaining elements.
        /// The element's index is used in the logic of the predicate function.
        /// &#10;
        /// &#10;1 - source.skipWhile(function (value) { return value < 10; });
        /// &#10;1 - source.skipWhile(function (value, index) { return value < 10 || index < 10; });
        /// </summary>
        /// <param name="predicate">A function to test each element for a condition; the second parameter of the function represents the index of the source element.</param>
        /// <returns>An observable sequence that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.</returns>        
        var source = this;
        return new AnonymousObservable(function (observer) {
            var i = 0, running = false;
            return source.subscribe(function (x) {
                if (!running) {
                    try {
                        running = !predicate(x, i++);
                    } catch (e) {
                        observer.onError(e);
                        return;
                    }
                }
                if (running) {
                    observer.onNext(x);
                }
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    observableProto.take = function (count, scheduler) {
        /// <summary>
        /// Returns a specified number of contiguous elements from the start of an observable sequence, using the specified scheduler for the edge case of take(0).
        /// &#10;
        /// &#10;1 - source.take(5);
        /// &#10;2 - source.take(0, Rx.Scheduler.timeout);
        /// </summary>
        /// <param name="count">The number of elements to return.</param>
        /// <param name="scheduler">[Optional] Scheduler used to produce an OnCompleted message in case <paramref name="count">count</paramref> is set to 0.</param>
        /// <returns>An observable sequence that contains the specified number of elements from the start of the input sequence.</returns>        
        if (count < 0) {
            throw new Error(argumentOutOfRange);
        }
        if (count === 0) {
            return observableEmpty(scheduler);
        }
        var observable = this;
        return new AnonymousObservable(function (observer) {
            var remaining = count;
            return observable.subscribe(function (x) {
                if (remaining > 0) {
                    remaining--;
                    observer.onNext(x);
                    if (remaining === 0) {
                        observer.onCompleted();
                    }
                }
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    observableProto.takeWhile = function (predicate) {
        /// <summary>
        /// Returns elements from an observable sequence as long as a specified condition is true.
        /// The element's index is used in the logic of the predicate function.
        /// &#10;
        /// &#10;1 - source.takeWhile(function (value) { return value < 10; });
        /// &#10;1 - source.takeWhile(function (value, index) { return value < 10 || index < 10; });
        /// </summary>
        /// <param name="predicate">A function to test each element for a condition; the second parameter of the function represents the index of the source element.</param>
        /// <returns>An observable sequence that contains the elements from the input sequence that occur before the element at which the test no longer passes.</returns>        
        var observable = this;
        return new AnonymousObservable(function (observer) {
            var i = 0, running = true;
            return observable.subscribe(function (x) {
                if (running) {
                    try {
                        running = predicate(x, i++);
                    } catch (e) {
                        observer.onError(e);
                        return;
                    }
                    if (running) {
                        observer.onNext(x);
                    } else {
                        observer.onCompleted();
                    }
                }
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    observableProto.where = function (predicate) {
        /// <summary>
        /// Filters the elements of an observable sequence based on a predicate by incorporating the element's index.
        /// &#10;
        /// &#10;1 - source.where(function (value) { return value < 10; });
        /// &#10;1 - source.where(function (value, index) { return value < 10 || index < 10; });
        /// </summary>
        /// <param name="predicate">A function to test each source element for a conditio; the second parameter of the function represents the index of the source element.</param>
        /// <returns>An observable sequence that contains elements from the input sequence that satisfy the condition.</returns>        
        var parent = this;
        return new AnonymousObservable(function (observer) {
            var count = 0;
            return parent.subscribe(function (value) {
                var shouldRun;
                try {
                    shouldRun = predicate(value, count++);
                } catch (exception) {
                    observer.onError(exception);
                    return;
                }
                if (shouldRun) {
                    observer.onNext(value);
                }
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };