    function extremaBy(source, keySelector, comparer) {
        return new AnonymousObservable(function (observer) {
            var hasValue = false, lastKey = null, list = [];
            return source.subscribe(function (x) {
                var comparison, key;
                try {
                    key = keySelector(x);
                } catch (ex) {
                    observer.onError(ex);
                    return;
                }
                comparison = 0;
                if (!hasValue) {
                    hasValue = true;
                    lastKey = key;
                } else {
                    try {
                        comparison = comparer(key, lastKey);
                    } catch (ex1) {
                        observer.onError(ex1);
                        return;
                    }
                }
                if (comparison > 0) {
                    lastKey = key;
                    list = [];
                }
                if (comparison >= 0) {
                    list.push(x);
                }
            }, observer.onError.bind(observer), function () {
                observer.onNext(list);
                observer.onCompleted();
            });
        });
    }

    function firstOnly(x) {
        if (x.length == 0) {
            throw new Error(sequenceContainsNoElements);
        }
        return x[0];
    }

    // Aggregation methods

    /**
     * Applies an accumulator function over an observable sequence, returning the result of the aggregation as a single element in the result sequence. The specified seed value is used as the initial accumulator value.
     * For aggregation behavior with incremental intermediate results, see Observable.scan.
     * 
     * 1 - res = source.aggregate(function (acc, x) { return acc + x; });
     * 2 - res = source.aggregate(0, function (acc, x) { return acc + x; });

     * @param [seed] The initial accumulator value.
     * @param accumulator An accumulator function to be invoked on each element.
     * @return An observable sequence containing a single element with the final accumulator value.
     */
    observableProto.aggregate = function () {
        var seed, hasSeed, accumulator;
        if (arguments.length === 2) {
            seed = arguments[0];
            hasSeed = true;
            accumulator = arguments[1];
        } else {
            accumulator = arguments[0];
        }
        return hasSeed ? this.scan(seed, accumulator).startWith(seed).finalValue() : this.scan(accumulator).finalValue();
    };

    observableProto.reduce = function () {
        var seed, hasSeed, accumulator = arguments[0];
        if (arguments.length === 2) {
            hasSeed = true;
            seed = arguments[1];
        } 
        return hasSeed ? this.scan(seed, accumulator).startWith(seed).finalValue() : this.scan(accumulator).finalValue();
    };    

    /**
     * Determines whether any element of an observable sequence satisfies a condition if present, else if any items are in the sequence.
     * 
     * 1 - source.any();
     * 2 - source.any(function (x) { return x > 3; });
     * 
     * @param {Function} [predicate] A function to test each element for a condition.
     * @return An observable sequence containing a single element determining whether any elements in the source sequence pass the test in the specified predicate if given, else if any items are in the sequence.
     */
    observableProto.any = observableProto.some = function (predicate) {
        var source = this;
        return predicate 
            ? source.where(predicate).any() 
            : new AnonymousObservable(function (observer) {
                return source.subscribe(function () {
                    observer.onNext(true);
                    observer.onCompleted();
                }, observer.onError.bind(observer), function () {
                    observer.onNext(false);
                    observer.onCompleted();
                });
            });
    };

    /**
     * Determines whether an observable sequence is empty.
     * 
     * @return An observable sequence containing a single element determining whether the source sequence is empty.
     */
    observableProto.isEmpty = function () {
        return this.any().select(function (b) { return !b; });
    };

    /**
     * Determines whether all elements of an observable sequence satisfy a condition.
     * 
     * 1 - res = source.all(function (value) { return value.length > 3; });
     * 
     * @param {Function} [predicate] A function to test each element for a condition.
     * @return An observable sequence containing a single element determining whether all elements in the source sequence pass the test in the specified predicate.
     */
    observableProto.all = observableProto.every = function (predicate) {
        return this.where(function (v) {
            return !predicate(v);
        }).any().select(function (b) {
            return !b;
        });
    };

    /**
     * Determines whether an observable sequence contains a specified element with an optional equality comparer.
     * 
     * 1 - res = source.contains(42);
     * 2 - res = source.contains({ value: 42 }, function (x, y) { return x.value === y.value; });
     * 
     * @param value The value to locate in the source sequence.</param>
     * @param {Function} [comparer] An equality comparer to compare elements.
     * @return An observable sequence containing a single element determining whether the source sequence contains an element that has the specified value.
     */
    observableProto.contains = function (value, comparer) {
        comparer || (comparer = defaultComparer);
        return this.where(function (v) {
            return comparer(v, value);
        }).any();
    };

    /**
     * Returns an observable sequence containing a value that represents how many elements in the specified observable sequence satisfy a condition if provided, else the count of items.
     * 
     * 1 - res = source.count();
     * 2 - res = source.count(function (x) { return x > 3; });
     * 
     * @param {Function} [predicate]A function to test each element for a condition.
     * @return An observable sequence containing a single element with a number that represents how many elements in the input sequence satisfy the condition in the predicate function if provided, else the count of items in the sequence.
     */
    observableProto.count = function (predicate) {
        return predicate ?
            this.where(predicate).count() :
            this.aggregate(0, function (count) {
                return count + 1;
            });
    };

    /**
     * Computes the sum of a sequence of values that are obtained by invoking an optional transform function on each element of the input sequence, else if not specified computes the sum on each item in the sequence.
     * 
     * 1 - res = source.sum();
     * 2 - res = source.sum(function (x) { return x.value; });
     * 
     * @param {Function} [selector]A transform function to apply to each element.
     * @return An observable sequence containing a single element with the sum of the values in the source sequence.
     */    
    observableProto.sum = function (keySelector) {
        return keySelector ? 
            this.select(keySelector).sum() :
            this.aggregate(0, function (prev, curr) {
                return prev + curr;
            });
    };

    /**
     * Returns the elements in an observable sequence with the minimum key value according to the specified comparer.
     * 
     * 1 - source.minBy(function (x) { return x.value; });
     * 2 - source.minBy(function (x) { return x.value; }, function (x, y) { return x - y; });
     * 
     * @param {Function} keySelector Key selector function.</param>
     * @param {Function} [comparer] Comparer used to compare key values.</param>
     * @return An observable sequence containing a list of zero or more elements that have a minimum key value.
     */  
    observableProto.minBy = function (keySelector, comparer) {
        comparer || (comparer = subComparer);
        return extremaBy(this, keySelector, function (x, y) {
            return comparer(x, y) * -1;
        });
    };

    /**
     * Returns the minimum element in an observable sequence according to the optional comparer else a default greater than less than check.
     * 
     * 1 - source.min();
     * 2 - source.min(function (x, y) { return x.value - y.value; });
     * 
     * @param {Function} [comparer] Comparer used to compare elements.
     * @return An observable sequence containing a single element with the minimum element in the source sequence.
     */
    observableProto.min = function (comparer) {
        return this.minBy(identity, comparer).select(function (x) {
            return firstOnly(x);
        });
    };

    /**
     * Returns the elements in an observable sequence with the maximum  key value according to the specified comparer.
     * 
     * 1 - source.maxBy(function (x) { return x.value; });
     * 2 - source.maxBy(function (x) { return x.value; }, function (x, y) { return x - y;; });
     * 
     * @param {Function} keySelector Key selector function.
     * @param {Function} [comparer]  Comparer used to compare key values.
     * @return An observable sequence containing a list of zero or more elements that have a maximum key value.
     */
    observableProto.maxBy = function (keySelector, comparer) {
        comparer || (comparer = subComparer);
        return extremaBy(this, keySelector, comparer);
    };

        /**
         * Returns the maximum value in an observable sequence according to the specified comparer.
         * 
         * 1 - source.max();
         * 2 - source.max(function (x, y) { return x.value - y.value; });
         * 
         * @param {Function} [comparer] Comparer used to compare elements.
         * @return An observable sequence containing a single element with the maximum element in the source sequence.
         */
    observableProto.max = function (comparer) {
        return this.maxBy(identity, comparer).select(function (x) {
            return firstOnly(x);
        });
    };

    /**
     * Computes the average of an observable sequence of values that are in the sequence or obtained by invoking a transform function on each element of the input sequence if present.
     * 
     * 1 - res = source.average();
     * 2 - res = source.average(function (x) { return x.value; });
     * 
     * @param {Function} [selector] A transform function to apply to each element.
     * @return An observable sequence containing a single element with the average of the sequence of values.
     */
    observableProto.average = function (keySelector) {
        return keySelector ?
            this.select(keySelector).average() :
            this.scan({
                sum: 0,
                count: 0
            }, function (prev, cur) {
                return {
                    sum: prev.sum + cur,
                    count: prev.count + 1
                };
            }).finalValue().select(function (s) {
                return s.sum / s.count;
            });
    };

    function sequenceEqualArray(first, second, comparer) {
        return new AnonymousObservable(function (observer) {
            var count = 0, len = second.length;
            return first.subscribe(function (value) {
                var equal = false;
                try {
                    if (count < len) {
                        equal = comparer(value, second[count++]);
                    }
                } catch (e) {
                    observer.onError(e);
                    return;
                }
                if (!equal) {
                    observer.onNext(false);
                    observer.onCompleted();
                }
            }, observer.onError.bind(observer), function () {
                observer.onNext(count === len);
                observer.onCompleted();
            });
        });
    }

    /**
     *  Determines whether two sequences are equal by comparing the elements pairwise using a specified equality comparer.
     * 
     * 1 - res = source.sequenceEqual([1,2,3]);
     * 2 - res = source.sequenceEqual([{ value: 42 }], function (x, y) { return x.value === y.value; });
     * 3 - res = source.sequenceEqual(Rx.Observable.returnValue(42));
     * 4 - res = source.sequenceEqual(Rx.Observable.returnValue({ value: 42 }), function (x, y) { return x.value === y.value; });
     * 
     * @param second Second observable sequence or array to compare.
     * @param {Function} [comparer] Comparer used to compare elements of both sequences.
     * @return An observable sequence that contains a single element which indicates whether both sequences are of equal length and their corresponding elements are equal according to the specified equality comparer.
     */
    observableProto.sequenceEqual = function (second, comparer) {
        var first = this;
        comparer || (comparer = defaultComparer);
        if (Array.isArray(second)) {
            return sequenceEqualArray(first, second, comparer);
        }
        return new AnonymousObservable(function (observer) {
            var donel = false, doner = false, ql = [], qr = [];
            var subscription1 = first.subscribe(function (x) {
                var equal, v;
                if (qr.length > 0) {
                    v = qr.shift();
                    try {
                        equal = comparer(v, x);
                    } catch (e) {
                        observer.onError(e);
                        return;
                    }
                    if (!equal) {
                        observer.onNext(false);
                        observer.onCompleted();
                    }
                } else if (doner) {
                    observer.onNext(false);
                    observer.onCompleted();
                } else {
                    ql.push(x);
                }
            }, observer.onError.bind(observer), function () {
                donel = true;
                if (ql.length === 0) {
                    if (qr.length > 0) {
                        observer.onNext(false);
                        observer.onCompleted();
                    } else if (doner) {
                        observer.onNext(true);
                        observer.onCompleted();
                    }
                }
            });
            var subscription2 = second.subscribe(function (x) {
                var equal, v;
                if (ql.length > 0) {
                    v = ql.shift();
                    try {
                        equal = comparer(v, x);
                    } catch (exception) {
                        observer.onError(exception);
                        return;
                    }
                    if (!equal) {
                        observer.onNext(false);
                        observer.onCompleted();
                    }
                } else if (donel) {
                    observer.onNext(false);
                    observer.onCompleted();
                } else {
                    qr.push(x);
                }
            }, observer.onError.bind(observer), function () {
                doner = true;
                if (qr.length === 0) {
                    if (ql.length > 0) {
                        observer.onNext(false);
                        observer.onCompleted();
                    } else if (donel) {
                        observer.onNext(true);
                        observer.onCompleted();
                    }
                }
            });
            return new CompositeDisposable(subscription1, subscription2);
        });
    };

    function elementAtOrDefault(source, index, hasDefault, defaultValue) {
        if (index < 0) {
            throw new Error(argumentOutOfRange);
        }
        return new AnonymousObservable(function (observer) {
            var i = index;
            return source.subscribe(function (x) {
                if (i === 0) {
                    observer.onNext(x);
                    observer.onCompleted();
                }
                i--;
            }, observer.onError.bind(observer), function () {
                if (!hasDefault) {
                    observer.onError(new Error(argumentOutOfRange));
                } else {
                    observer.onNext(defaultValue);
                    observer.onCompleted();
                }
            });
        });
    }

    observableProto.elementAt =  function (index) {
        return elementAtOrDefault(this, index, false);
    };

    observableProto.elementAtOrDefault = function (index, defaultValue) {
        return elementAtOrDefault(this, index, true, defaultValue);
    };

    function singleOrDefaultAsync(source, hasDefault, defaultValue) {
        return new AnonymousObservable(function (observer) {
            var value = defaultValue, seenValue = false;
            return source.subscribe(function (x) {
                if (seenValue) {
                    observer.onError(new Error('Sequence contains more than one element'));
                } else {
                    value = x;
                    seenValue = true;
                }
            }, observer.onError.bind(observer), function () {
                if (!seenValue && !hasDefault) {
                    observer.onError(new Error(sequenceContainsNoElements));
                } else {
                    observer.onNext(value);
                    observer.onCompleted();
                }
            });
        });
    }

    observableProto.single = function (predicate) {
        if (predicate) {
            return this.where(predicate).single();
        }
        return singleOrDefaultAsync(this, false);
    };

    observableProto.singleOrDefault = function (predicate, defaultValue) {
        if (predicate) {
            return this.where(predicate).singleOrDefault(null, defaultValue);
        }
        return singleOrDefaultAsync(this, true, defaultValue);
    };

    function firstOrDefaultAsync(source, hasDefault, defaultValue) {
        return new AnonymousObservable(function (observer) {
            return source.subscribe(function (x) {
                observer.onNext(x);
                observer.onCompleted();
            }, observer.onError.bind(observer), function () {
                if (!hasDefault) {
                    observer.onError(new Error(sequenceContainsNoElements));
                } else {
                    observer.onNext(defaultValue);
                    observer.onCompleted();
                }
            });
        });
    }

    observableProto.first = function (predicate) {
        if (predicate) {
            return this.where(predicate).first();
        }
        return firstOrDefaultAsync(this, false);
    };

    observableProto.firstOrDefault = function (predicate, defaultValue) {
        if (predicate) {
            return this.where(predicate).firstOrDefault(null, defaultValue);
        }
        return firstOrDefaultAsync(this, true, defaultValue);
    };

    function lastOrDefaultAsync(source, hasDefault, defaultValue) {
        return new AnonymousObservable(function (observer) {
            var value = defaultValue, seenValue = false;
            return source.subscribe(function (x) {
                value = x;
                seenValue = true;
            }, observer.onError.bind(observer), function () {
                if (!seenValue && !hasDefault) {
                    observer.onError(new Error(sequenceContainsNoElements));
                } else {
                    observer.onNext(value);
                    observer.onCompleted();
                }
            });
        });
    }

    observableProto.last = function (predicate) {
        if (predicate) {
            return this.where(predicate).last();
        }
        return lastOrDefaultAsync(this, false);
    };

    observableProto.lastOrDefault = function (predicate, defaultValue) {
        if (predicate) {
            return this.where(predicate).lastOrDefault(null, defaultValue);
        }
        return lastOrDefaultAsync(this, true, defaultValue);
    };
