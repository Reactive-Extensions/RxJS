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
    
    // References
    var Observable = root.Observable,
        observableProto = Observable.prototype,
        CompositeDisposable = root.CompositeDisposable,
        AnonymousObservable = root.Internals.AnonymousObservable;

    // Defaults
    var argumentOutOfRange = 'Argument out of range';
    var sequenceContainsNoElements = "Sequence contains no elements.";
    function defaultComparer(x, y) { return x === y; }
    function identity(x) { return x; }
    function subComparer(x, y) {
        if (x > y) {
            return 1;
        }
        if (x === y) {
            return 0;
        }
        return -1;
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
        if (x.length == 0) {
            throw new Error(sequenceContainsNoElements);
        }
        return x[0];
    }

    // Aggregation methods
    observableProto.aggregate = function () {
        /// <summary>
        /// Applies an accumulator function over an observable sequence, returning the result of the aggregation as a single element in the result sequence. The specified seed value is used as the initial accumulator value.
        /// For aggregation behavior with incremental intermediate results, see Observable.scan.
        /// &#10;
        /// &#10;1 - res = source.aggregate(function (acc, x) { return acc + x; });
        /// &#10;2 - res = source.aggregate(0, function (acc, x) { return acc + x; });
        /// </summary>
        /// <param name="seed">[Optional] The initial accumulator value.</param>
        /// <param name="accumulator">An accumulator function to be invoked on each element.</param>
        /// <returns>An observable sequence containing a single element with the final accumulator value.</returns>
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

    observableProto.any = function (predicate) {
        /// <summary>
        /// Determines whether any element of an observable sequence satisfies a condition if present, else if any items are in the sequence.
        /// &#10;
        /// &#10;1 - res = source.any();
        /// &#10;2 - res = source.any(function (x) { return x > 3; });
        /// </summary>
        /// <param name="predicate">[Optional] A function to test each element for a condition.</param>
        /// <returns>An observable sequence containing a single element determining whether any elements in the source sequence pass the test in the specified predicate if given, else if any items are in the sequence.</returns>
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

    observableProto.isEmpty = function () {
        /// <summary>
        /// Determines whether an observable sequence is empty.
        /// </summary>
        /// <returns>An observable sequence containing a single element determining whether the source sequence is empty.</returns>
        return this.any().select(function (b) { return !b; });
    };

    observableProto.all = function (predicate) {
        /// <summary>
        /// Determines whether all elements of an observable sequence satisfy a condition.
        /// &#10;
        /// &#10;1 - res = source.all(function (value) { return value.length > 3; });
        /// </summary>
        /// <param name="predicate">A function to test each element for a condition.</param>
        /// <returns>An observable sequence containing a single element determining whether all elements in the source sequence pass the test in the specified predicate.</returns>
        return this.where(function (v) {
            return !predicate(v);
        }).any().select(function (b) {
            return !b;
        });
    };

    observableProto.contains = function (value, comparer) {
        /// <summary>
        /// Determines whether an observable sequence contains a specified element with an optional equality comparer.
        /// &#10;
        /// &#10;1 - res = source.contains(42);
        /// &#10;2 - res = source.contains({ value: 42 }, function (x, y) { return x.value === y.value; });
        /// </summary>
        /// <param name="value">The value to locate in the source sequence.</param>
        /// <param name="comparer">[Optional] An equality comparer to compare elements.</param>
        /// <returns>An observable sequence containing a single element determining whether the source sequence contains an element that has the specified value.</returns>
        comparer || (comparer = defaultComparer);
        return this.where(function (v) {
            return comparer(v, value);
        }).any();
    };

    observableProto.count = function (predicate) {
        /// <summary>
        /// Returns an observable sequence containing a value that represents how many elements in the specified observable sequence satisfy a condition if provided, else the count of items.
        /// &#10;
        /// &#10;1 - res = source.count();
        /// &#10;2 - res = source.count(function (x) { return x > 3; });
        /// </summary>
        /// <param name="predicate">[Optional] A function to test each element for a condition.</param>
        /// <returns>An observable sequence containing a single element with a number that represents how many elements in the input sequence satisfy the condition in the predicate function if provided, else the count of items in the sequence.</returns>
        return predicate ?
            this.where(predicate).count() :
            this.aggregate(0, function (count) {
                return count + 1;
            });
    };

    observableProto.sum = function (keySelector) {
        /// <summary>
        /// Computes the sum of a sequence of values that are obtained by invoking an optional transform function on each element of the input sequence, else if not specified computes the sum on each item in the sequence.
        /// &#10;
        /// &#10;1 - res = source.sum();
        /// &#10;2 - res = source.sum(function (x) { return x.value; });
        /// </summary>
        /// <param name="selector">[Optional] A transform function to apply to each element.</param>
        /// <returns>An observable sequence containing a single element with the sum of the values in the source sequence.</returns>
        return keySelector ?
            this.select(keySelector).sum() :
            this.aggregate(0, function (prev, curr) {
                return prev + curr;
            });
    };

    observableProto.minBy = function (keySelector, comparer) {
        /// <summary>
        /// Returns the elements in an observable sequence with the minimum key value according to the specified comparer.
        /// &#10;
        /// &#10;1 - res = source.minBy(function (x) { return x.value; });
        /// &#10;2 - res = source.minBy(function (x) { return x.value; }, function (x, y) { return x - y; });
        /// </summary>
        /// <param name="keySelector">Key selector function.</param>
        /// <param name="comparer">[Optional] Comparer used to compare key values.</param>
        /// <returns>An observable sequence containing a list of zero or more elements that have a minimum key value.</returns>
        comparer || (comparer = subComparer);
        return extremaBy(this, keySelector, function (x, y) {
            return comparer(x, y) * -1;
        });
    };

    observableProto.min = function (comparer) {
        /// <summary>
        /// Returns the minimum element in an observable sequence according to the optional comparer else a default greater than less than check.
        /// &#10;
        /// &#10;1 - res = source.min();
        /// &#10;2 - res = source.min(function (x, y) { return x.value - y.value; });
        /// </summary>
        /// <param name="comparer">Comparer used to compare elements.</param>
        /// <returns>An observable sequence containing a single element with the minimum element in the source sequence.</returns>
        return this.minBy(identity, comparer).select(function (x) {
            return firstOnly(x);
        });
    };

    observableProto.maxBy = function (keySelector, comparer) {
        /// <summary>
        /// Returns the elements in an observable sequence with the maximum  key value according to the specified comparer.
        /// &#10;
        /// &#10;1 - res = source.maxBy(function (x) { return x.value; });
        /// &#10;2 - res = source.maxBy(function (x) { return x.value; }, function (x, y) { return x - y;; });
        /// </summary>
        /// <param name="keySelector">Key selector function.</param>
        /// <param name="comparer">[Optional] Comparer used to compare key values.</param>
        /// <returns>An observable sequence containing a list of zero or more elements that have a maximum key value.</returns>
        comparer || (comparer = subComparer);
        return extremaBy(this, keySelector, comparer);
    };

    observableProto.max = function (comparer) {
        /// <summary>
        /// Returns the maximum value in an observable sequence according to the specified comparer.
        /// &#10;
        /// &#10;1 - res = source.max();
        /// &#10;2 - res = source.max(function (x, y) { return x.value - y.value; });
        /// </summary>
        /// <param name="comparer">[Optional] Comparer used to compare elements.</param>
        /// <returns>An observable sequence containing a single element with the maximum element in the source sequence.</returns>
        return this.maxBy(identity, comparer).select(function (x) {
            return firstOnly(x);
        });
    };

    observableProto.average = function (keySelector) {
        /// <summary>
        /// Computes the average of an observable sequence of values that are in the sequence or obtained by invoking a transform function on each element of the input sequence if present.
        /// &#10;
        /// &#10;1 - res = source.average();
        /// &#10;2 - res = source.average(function (x) { return x.value; });
        /// </summary>
        /// <param name="selector">[Optional] A transform function to apply to each element.</param>
        /// <returns>An observable sequence containing a single element with the average of the sequence of values.</returns>
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

    observableProto.sequenceEqual = function (second, comparer) {
        /// <summary>
        /// Determines whether two sequences are equal by comparing the elements pairwise using a specified equality comparer.
        /// &#10;
        /// &#10;1 - res = source.sequenceEqual([1,2,3]);
        /// &#10;2 - res = source.sequenceEqual([{ value: 42 }], function (x, y) { return x.value === y.value; });
        /// &#10;3 - res = source.sequenceEqual(Rx.Observable.returnValue(42));
        /// &#10;4 - res = source.sequenceEqual(Rx.Observable.returnValue({ value: 42 }), function (x, y) { return x.value === y.value; });
        /// </summary>
        /// <param name="second">Second observable sequence or array to compare.</param>
        /// <param name="comparer">[Optional] Comparer used to compare elements of both sequences.</param>
        /// <returns>An observable sequence that contains a single element which indicates whether both sequences are of equal length and their corresponding elements are equal according to the specified equality comparer.</returns>
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

    observableProto.elementAt = function (index) {
        /// <summary>
        /// Returns the element at a specified index in a sequence.
        /// &#10;
        /// &#10;1 - res = source.elementAt(5);
        /// </summary>
        /// <param name="index">The zero-based index of the element to retrieve.</param>
        /// <returns>An observable sequence that produces the element at the specified position in the source sequence.</returns>
        return elementAtOrDefault(this, index, false);
    };

    observableProto.elementAtOrDefault = function (index, defaultValue) {
        /// <summary>
        /// Returns the element at a specified index in a sequence or a default value if the index is out of range.
        /// &#10;
        /// &#10;1 - res = source.elementAtOrDefault(5);
        /// &#10;2 - res = source.elementAtOrDefault(5, 0);
        /// </summary>
        /// <param name="index">The zero-based index of the element to retrieve.</param>
        /// <param name="defaultValue">[Optional] The default value if the index is outside the bounds of the source sequence.</param>
        /// <returns>An observable sequence that produces the element at the specified position in the source sequence, or a default value if the index is outside the bounds of the source sequence.</returns>
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
        /// <summary>
        /// Returns the only element of an observable sequence that satisfies the condition in the optional predicate, and reports an exception if there is not exactly one element in the observable sequence.
        /// &#10;
        /// &#10;1 - res = source.single();
        /// &#10;2 - res = source.single(function (x) { return x === 42; });
        /// </summary>
        /// <param name="predicate">[Optional] A predicate function to evaluate for elements in the source sequence.</param>
        /// <returns>Sequence containing the single element in the observable sequence that satisfies the condition in the predicate.</returns>
        if (predicate) {
            return this.where(predicate).single();
        }
        return singleOrDefaultAsync(this, false);
    };

    observableProto.singleOrDefault = function (predicate, defaultValue) {
        /// <summary>
        /// Returns the only element of an observable sequence that matches the predicate, or a default value if no such element exists; this method reports an exception if there is more than one element in the observable sequence.
        /// &#10;
        /// &#10;1 - res = source.singleOrDefault();
        /// &#10;2 - res = source.singleOrDefault(function (x) { return x === 42; });
        /// &#10;3 - res = source.singleOrDefault(function (x) { return x === 42; }, 0);
        /// &#10;4 - res = source.singleOrDefault(null, 0);
        /// </summary>
        /// <param name="predicate">A predicate function to evaluate for elements in the source sequence.</param>
        /// <returns>Sequence containing the single element in the observable sequence that satisfies the condition in the predicate, or a default value if no such element exists.</returns>
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
        /// <summary>
        /// Returns the first element of an observable sequence that satisfies the condition in the predicate if present else the first item in the sequence.
        /// &#10;
        /// &#10;1 - res = source.first();
        /// &#10;2 - res = source.first(function (x) { return x > 3; });
        /// </summary>
        /// <param name="predicate">[Optional] A predicate function to evaluate for elements in the source sequence.</param>
        /// <returns>Sequence containing the first element in the observable sequence that satisfies the condition in the predicate if provided, else the first item in the sequence.</returns>
        if (predicate) {
            return this.where(predicate).first();
        }
        return firstOrDefaultAsync(this, false);
    };

    observableProto.firstOrDefault = function (predicate, defaultValue) {
        /// <summary>
        /// Returns the first element of an observable sequence that satisfies the condition in the predicate, or a default value if no such element exists.
        /// &#10;1 - res = source.firstOrDefault();
        /// &#10;2 - res = source.firstOrDefault(function (x) { return x > 3; });
        /// &#10;3 - res = source.firstOrDefault(function (x) { return x > 3; }, 0);
        /// &#10;4 - res = source.firstOrDefault(null, 0);
        /// </summary>
        /// <param name="predicate">[Optional] A predicate function to evaluate for elements in the source sequence. </param>
        /// <param name="defaultValue">[Optional] The default value if no such element exists.  If not specified, defaults to null.</param>
        /// <returns>Sequence containing the first element in the observable sequence that satisfies the condition in the predicate, or a default value if no such element exists.</returns>
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
        /// <summary>
        /// Returns the last element of an observable sequence that satisfies the condition in the predicate if specified, else the last element.
        /// &#10;
        /// &#10;1 - res = source.last();
        /// &#10;2 - res = source.last(function (x) { return x > 3; });
        /// </summary>
        /// <param name="predicate">[Optional] A predicate function to evaluate for elements in the source sequence.</param>
        /// <returns>Sequence containing the last element in the observable sequence that satisfies the condition in the predicate.</returns>
        if (predicate) {
            return this.where(predicate).last();
        }
        return lastOrDefaultAsync(this, false);
    };

    observableProto.lastOrDefault = function (predicate, defaultValue) {
        /// <summary>
        /// Returns the last element of an observable sequence that satisfies the condition in the predicate, or a default value if no such element exists.
        /// &#10;
        /// &#10;1 - res = source.lastOrDefault();
        /// &#10;2 - res = source.lastOrDefault(function (x) { return x > 3; });
        /// &#10;3 - res = source.lastOrDefault(function (x) { return x > 3; }, 0);
        /// &#10;4 - res = source.lastOrDefault(null, 0);
        /// </summary>
        /// <param name="predicate">A predicate function to evaluate for elements in the source sequence.</param>
        /// <returns>Sequence containing the last element in the observable sequence that satisfies the condition in the predicate, or a default value if no such element exists.</returns>
        if (predicate) {
            return this.where(predicate).lastOrDefault(null, defaultValue);
        }
        return lastOrDefaultAsync(this, true, defaultValue);
    };

    return root;
}));