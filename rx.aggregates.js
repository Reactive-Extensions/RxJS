// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

(function (root, factory) {
    var freeExports = typeof exports == 'object' && exports,
        freeModule = typeof module == 'object' && module && module.exports == freeExports && module,
        freeGlobal = typeof global == 'object' && global;
    if (freeGlobal.global === freeGlobal) {
        window = freeGlobal;
    }

    // Because of build optimizers
    if (typeof define === 'function' && define.amd) {
        define(['rx', 'exports'], function (Rx, exports) {
            root.Rx = factory(root, exports, Rx);
            return root.Rx;
        });
    } else if (typeof module === 'object' && module && module.exports === freeExports) {
        module.exports = factory(root, module.exports, require('./rx'));
    } else {
        root.Rx = factory(root, {}, root.Rx);
    }
}(this, function (global, exp, Rx, undefined) {
    
    // References
    var Observable = Rx.Observable,
        observableProto = Observable.prototype,
        CompositeDisposable = Rx.CompositeDisposable,
        AnonymousObservable = Rx.Internals.AnonymousObservable,
        isEqual = Rx.Internals.isEqual;

    // Defaults
    var argumentOutOfRange = 'Argument out of range';
    var sequenceContainsNoElements = "Sequence contains no elements.";
    function defaultComparer(x, y) { return isEqual(x, y); }
    function identity(x) { return x; }
    function subComparer(x, y) {
        if (x > y) {
            return 1;
        }
        if (x < y) {
            return -1
        }
        return 0;
    }
    
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
        if (x.length === 0) {
            throw new Error(sequenceContainsNoElements);
        }
        return x[0];
    }

    /**
     * Applies an accumulator function over an observable sequence, returning the result of the aggregation as a single element in the result sequence. The specified seed value is used as the initial accumulator value.
     * For aggregation behavior with incremental intermediate results, see Observable.scan.
     * 
     * @example
     * 1 - res = source.aggregate(function (acc, x) { return acc + x; });
     * 2 - res = source.aggregate(0, function (acc, x) { return acc + x; });
     * @memberOf Observable#
     * @param {Mixed} [seed] The initial accumulator value.
     * @param {Function} accumulator An accumulator function to be invoked on each element.
     * @returns {Observable} An observable sequence containing a single element with the final accumulator value.
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

    /**
     * Applies an accumulator function over an observable sequence, returning the result of the aggregation as a single element in the result sequence. The specified seed value is used as the initial accumulator value.
     * For aggregation behavior with incremental intermediate results, see Observable.scan.
     * 
     * @example
     * 1 - res = source.reduce(function (acc, x) { return acc + x; });
     * 2 - res = source.reduce(function (acc, x) { return acc + x; }, 0);
     * @memberOf Observable#
     * @param {Mixed} [seed] The initial accumulator value.
     * @param {Function} accumulator An accumulator function to be invoked on each element.
     * @returns {Observable} An observable sequence containing a single element with the final accumulator value.
     */
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
     * @memberOf Observable#
     * @param {Function} [predicate] A function to test each element for a condition.
     * @returns {Observable} An observable sequence containing a single element determining whether any elements in the source sequence pass the test in the specified predicate if given, else if any items are in the sequence.
     */
    observableProto.any = function (predicate, thisArg) {
        var source = this;
        return predicate ? 
            source.where(predicate, thisArg).any() : 
            new AnonymousObservable(function (observer) {
                return source.subscribe(function () {
                    observer.onNext(true);
                    observer.onCompleted();
                }, observer.onError.bind(observer), function () {
                    observer.onNext(false);
                    observer.onCompleted();
                });
            });
    };
    observableProto.some = observableProto.any;

    /**
     * Determines whether an observable sequence is empty.
     *
     * @memberOf Observable#
     * @returns {Observable} An observable sequence containing a single element determining whether the source sequence is empty.
     */
    observableProto.isEmpty = function () {
        return this.any().select(function (b) { return !b; });
    };

    /**
     * Determines whether all elements of an observable sequence satisfy a condition.
     * 
     * 1 - res = source.all(function (value) { return value.length > 3; });
     * @memberOf Observable#
     * @param {Function} [predicate] A function to test each element for a condition.
     * @param {Any} [thisArg] Object to use as this when executing callback.
     * @returns {Observable} An observable sequence containing a single element determining whether all elements in the source sequence pass the test in the specified predicate.
     */
    observableProto.all = function (predicate, thisArg) {
        return this.where(function (v) {
            return !predicate(v);
        }, thisArg).any().select(function (b) {
            return !b;
        });
    };
    observableProto.every = observableProto.all;

    /**
     * Determines whether an observable sequence contains a specified element with an optional equality comparer.
     * 
     * 1 - res = source.contains(42);
     * 2 - res = source.contains({ value: 42 }, function (x, y) { return x.value === y.value; });
     * @memberOf Observable#
     * @param value The value to locate in the source sequence.</param>
     * @param {Function} [comparer] An equality comparer to compare elements.
     * @returns {Observable} An observable sequence containing a single element determining whether the source sequence contains an element that has the specified value.
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
     * @memberOf Observable#
     * @param {Function} [predicate]A function to test each element for a condition.
     * @returns {Observable} An observable sequence containing a single element with a number that represents how many elements in the input sequence satisfy the condition in the predicate function if provided, else the count of items in the sequence.
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
     * @memberOf Observable#
     * @param {Function} [selector]A transform function to apply to each element.
     * @returns {Observable} An observable sequence containing a single element with the sum of the values in the source sequence.
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
     * @memberOf Observable#
     * @param {Function} keySelector Key selector function.</param>
     * @param {Function} [comparer] Comparer used to compare key values.</param>
     * @returns {Observable} An observable sequence containing a list of zero or more elements that have a minimum key value.
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
     * @memberOf Observable#
     * @param {Function} [comparer] Comparer used to compare elements.
     * @returns {Observable} An observable sequence containing a single element with the minimum element in the source sequence.
     */
    observableProto.min = function (comparer) {
        return this.minBy(identity, comparer).select(function (x) {
            return firstOnly(x);
        });
    };

    /**
     * Returns the elements in an observable sequence with the maximum  key value according to the specified comparer.
     * 
     * @example
     * 1 - source.maxBy(function (x) { return x.value; });
     * 2 - source.maxBy(function (x) { return x.value; }, function (x, y) { return x - y;; });
     * @memberOf Observable#
     * @param {Function} keySelector Key selector function.
     * @param {Function} [comparer]  Comparer used to compare key values.
     * @returns {Observable} An observable sequence containing a list of zero or more elements that have a maximum key value.
     */
    observableProto.maxBy = function (keySelector, comparer) {
        comparer || (comparer = subComparer);
        return extremaBy(this, keySelector, comparer);
    };

    /**
     * Returns the maximum value in an observable sequence according to the specified comparer.
     * 
     * @example
     * 1 - source.max();
     * 2 - source.max(function (x, y) { return x.value - y.value; });
     * @memberOf Observable#
     * @param {Function} [comparer] Comparer used to compare elements.
     * @returns {Observable} An observable sequence containing a single element with the maximum element in the source sequence.
     */
    observableProto.max = function (comparer) {
        return this.maxBy(identity, comparer).select(function (x) {
            return firstOnly(x);
        });
    };

    /**
     * Computes the average of an observable sequence of values that are in the sequence or obtained by invoking a transform function on each element of the input sequence if present.
     * 
     * @example
     * 1 - res = source.average();
     * 2 - res = source.average(function (x) { return x.value; });
     * @memberOf Observable#
     * @param {Function} [selector] A transform function to apply to each element.
     * @returns {Observable} An observable sequence containing a single element with the average of the sequence of values.
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
     * @example
     * 1 - res = source.sequenceEqual([1,2,3]);
     * 2 - res = source.sequenceEqual([{ value: 42 }], function (x, y) { return x.value === y.value; });
     * 3 - res = source.sequenceEqual(Rx.Observable.returnValue(42));
     * 4 - res = source.sequenceEqual(Rx.Observable.returnValue({ value: 42 }), function (x, y) { return x.value === y.value; });
     * @memberOf Observable#
     * @param {Observable} second Second observable sequence or array to compare.
     * @param {Function} [comparer] Comparer used to compare elements of both sequences.
     * @returns {Observable} An observable sequence that contains a single element which indicates whether both sequences are of equal length and their corresponding elements are equal according to the specified equality comparer.
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

    /**
     * Returns the element at a specified index in a sequence.
     * 
     * @example
     * source.elementAt(5);
     * @memberOf Observable#
     * @param {Number} index The zero-based index of the element to retrieve.
     * @returns {Observable} An observable sequence that produces the element at the specified position in the source sequence.
     */
    observableProto.elementAt =  function (index) {
        return elementAtOrDefault(this, index, false);
    };

    /**
     * Returns the element at a specified index in a sequence or a default value if the index is out of range.
     * 
     * @example
     * source.elementAtOrDefault(5);
     * source.elementAtOrDefault(5, 0);
     * @memberOf Observable#
     * @param {Number} index The zero-based index of the element to retrieve.
     * @param [defaultValue] The default value if the index is outside the bounds of the source sequence.
     * @returns {Observable} An observable sequence that produces the element at the specified position in the source sequence, or a default value if the index is outside the bounds of the source sequence.
     */    
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

    /**
     * Returns the only element of an observable sequence that satisfies the condition in the optional predicate, and reports an exception if there is not exactly one element in the observable sequence.
     * 
     * @example
     * 1 - res = source.single();
     * 2 - res = source.single(function (x) { return x === 42; });
     * @memberOf Observable#
     * @param {Function} [predicate] A predicate function to evaluate for elements in the source sequence.
     * @returns {Observable} Sequence containing the single element in the observable sequence that satisfies the condition in the predicate.
     */
    observableProto.single = function (predicate) {
        if (predicate) {
            return this.where(predicate).single();
        }
        return singleOrDefaultAsync(this, false);
    };

    /**
     * Returns the only element of an observable sequence that matches the predicate, or a default value if no such element exists; this method reports an exception if there is more than one element in the observable sequence.
     * 
     * @example
     * 1 - res = source.singleOrDefault();
     * 2 - res = source.singleOrDefault(function (x) { return x === 42; });
     * 3 - res = source.singleOrDefault(function (x) { return x === 42; }, 0);
     * 4 - res = source.singleOrDefault(null, 0);
     * @memberOf Observable#
     * @param {Function} predicate A predicate function to evaluate for elements in the source sequence.
     * @param [defaultValue] The default value if the index is outside the bounds of the source sequence.
     * @returns {Observable} Sequence containing the single element in the observable sequence that satisfies the condition in the predicate, or a default value if no such element exists.
     */
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

    /**
     * Returns the first element of an observable sequence that satisfies the condition in the predicate if present else the first item in the sequence.
     * 
     * @example
     * 1 - res = source.first();
     * 2 - res = source.first(function (x) { return x > 3; });
     * @memberOf Observable#
     * @param {Function} [predicate] A predicate function to evaluate for elements in the source sequence.
     * @returns {Observable} Sequence containing the first element in the observable sequence that satisfies the condition in the predicate if provided, else the first item in the sequence.
     */    
    observableProto.first = function (predicate) {
        if (predicate) {
            return this.where(predicate).first();
        }
        return firstOrDefaultAsync(this, false);
    };

    /**
     * Returns the first element of an observable sequence that satisfies the condition in the predicate, or a default value if no such element exists.
     * 
     * @example     
     * 1 - res = source.firstOrDefault();
     * 2 - res = source.firstOrDefault(function (x) { return x > 3; });
     * 3 - res = source.firstOrDefault(function (x) { return x > 3; }, 0);
     * 4 - res = source.firstOrDefault(null, 0);
     * @memberOf Observable#
     * @param {Function} [predicate] A predicate function to evaluate for elements in the source sequence. 
     * @param [defaultValue] The default value if no such element exists.  If not specified, defaults to null.
     * @returns {Observable} Sequence containing the first element in the observable sequence that satisfies the condition in the predicate, or a default value if no such element exists.
     */
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

    /**
     * Returns the last element of an observable sequence that satisfies the condition in the predicate if specified, else the last element.
     * 
     * @example
     * 1 - res = source.last();
     * 2 - res = source.last(function (x) { return x > 3; });
     * @memberOf Observable#
     * @param {Function} [predicate] A predicate function to evaluate for elements in the source sequence.
     * @returns {Observable} Sequence containing the last element in the observable sequence that satisfies the condition in the predicate.
     */
    observableProto.last = function (predicate) {
        if (predicate) {
            return this.where(predicate).last();
        }
        return lastOrDefaultAsync(this, false);
    };

    /**
     * Returns the last element of an observable sequence that satisfies the condition in the predicate, or a default value if no such element exists.
     * 
     * @example
     * 1 - res = source.lastOrDefault();
     * 2 - res = source.lastOrDefault(function (x) { return x > 3; });
     * 3 - res = source.lastOrDefault(function (x) { return x > 3; }, 0);
     * 4 - res = source.lastOrDefault(null, 0);
     * @memberOf Observable#
     * @param {Function} [predicate] A predicate function to evaluate for elements in the source sequence.
     * @param [defaultValue] The default value if no such element exists.  If not specified, defaults to null.
     * @returns {Observable} Sequence containing the last element in the observable sequence that satisfies the condition in the predicate, or a default value if no such element exists.
     */
    observableProto.lastOrDefault = function (predicate, defaultValue) {
        if (predicate) {
            return this.where(predicate).lastOrDefault(null, defaultValue);
        }
        return lastOrDefaultAsync(this, true, defaultValue);
    };

    function findValue (source, predicate, thisArg, yieldIndex) {
        return new AnonymousObservable(function (observer) {
            var i = 0;
            return source.subscribe(function (x) {
                var shouldRun;
                try {
                    shouldRun = predicate.call(thisArg, x, i, source);
                } catch(e) {
                    observer.onError(e);
                    return;
                }
                if (shouldRun) {
                    observer.onNext(yieldIndex ? i : x);
                    observer.onCompleted();
                } else {
                    i++;
                }
            }, observer.onError.bind(observer), function () {
                observer.onNext(yieldIndex ? -1 : undefined);
                observer.onCompleted();
            });
        });        
    }

    /**
     * Searches for an element that matches the conditions defined by the specified predicate, and returns the first occurrence within the entire Observable sequence.
     * 
     * @memberOf Observable#
     * @param {Function} predicate The predicate that defines the conditions of the element to search for.
     * @returns {Observable} An Observable sequence with the first element that matches the conditions defined by the specified predicate, if found; otherwise, undefined.
     */
    observableProto.find = function (predicate) {
        return findValue(this, predicate, arguments[1], false);
    };
     
    /**
     * Searches for an element that matches the conditions defined by the specified predicate, and returns 
     * an Observable sequence with the zero-based index of the first occurrence within the entire Observable sequence.
     *
     * @memberOf Observable#     
     * @param {Function} predicate The predicate that defines the conditions of the element to search for.
     * @returns {Observable} An Observable sequence with the zero-based index of the first occurrence of an element that matches the conditions defined by match, if found; otherwise, –1.
    */
    observableProto.findIndex = function (predicate) {
        return findValue(this, predicate, arguments[1], true);
    };
    return Rx;
}));