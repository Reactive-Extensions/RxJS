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
        return this.any().select(function (b) { return !b; });
    };

    observableProto.all = function (predicate) {
        return this.where(function (v) {
            return !predicate(v);
        }).any().select(function (b) {
            return !b;
        });
    };

    observableProto.contains = function (value, comparer) {
        comparer || (comparer = defaultComparer);
        return this.where(function (v) {
            return comparer(v, value);
        }).any();
    };

    observableProto.count = function (predicate) {
        return predicate ?
            this.where(predicate).count() :
            this.aggregate(0, function (count) {
                return count + 1;
            });
    };

    observableProto.sum = function (keySelector) {
        return keySelector ? 
            this.select(keySelector).sum() :
            this.aggregate(0, function (prev, curr) {
                return prev + curr;
            });
    };

    observableProto.minBy = function (keySelector, comparer) {
        comparer || (comparer = subComparer);
        return extremaBy(this, keySelector, function (x, y) {
            return comparer(x, y) * -1;
        });
    };

    observableProto.min = function (comparer) {
        return this.minBy(identity, comparer).select(function (x) {
            return firstOnly(x);
        });
    };

    observableProto.maxBy = function (keySelector, comparer) {
        comparer || (comparer = subComparer);
        return extremaBy(this, keySelector, comparer);
    };

    observableProto.max = function (comparer) {
        return this.maxBy(identity, comparer).select(function (x) {
            return firstOnly(x);
        });
    };

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

    return root;
}));