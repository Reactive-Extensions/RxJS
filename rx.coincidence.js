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
    
    var Observable = root.Observable,
        CompositeDisposable = root.CompositeDisposable,
        RefCountDisposable = root.RefCountDisposable,
        SingleAssignmentDisposable = root.SingleAssignmentDisposable,
        SerialDisposable = root.SerialDisposable,
        Subject = root.Subject,
        observableProto = Observable.prototype,
        observableEmpty = Observable.empty,
        AnonymousObservable = root.Internals.AnonymousObservable,
        observerCreate = root.Observer.create,
        addRef = root.Internals.addRef;

    // defaults
    function noop() { }
    function defaultComparer(x, y) { return x === y; }
    
    // Real Dictionary
    var primes = [1, 3, 7, 13, 31, 61, 127, 251, 509, 1021, 2039, 4093, 8191, 16381, 32749, 65521, 131071, 262139, 524287, 1048573, 2097143, 4194301, 8388593, 16777213, 33554393, 67108859, 134217689, 268435399, 536870909, 1073741789, 2147483647];
    var noSuchkey = "no such key";
    var duplicatekey = "duplicate key";

    function isPrime(candidate) {
        var num1, num2;
        if (candidate & 1 === 0) {
            return candidate === 2;
        }
        num1 = Math.sqrt(candidate);
        num2 = 3;
        while (num2 <= num1) {
            if (candidate % num2 === 0) {
                return false;
            }
            num2 += 2;
        }
        return true;
    }

    function getPrime(min) {
        var index, num, candidate;
        for (index = 0; index < primes.length; ++index) {
            num = primes[index];
            if (num >= min) {
                return num;
            }
        }
        candidate = min | 1;
        while (candidate < primes[primes.length - 1]) {
            if (isPrime(candidate)) {
                return candidate;
            }
            candidate += 2;
        }
        return min;
    }

    var getHashCode = (function () {
        var uniqueIdCounter = 0;

        return function (obj) {
            var id;
            if (obj === undefined)
                throw new Error(noSuchkey);
            if (obj.getHashCode !== undefined) {
                return obj.getHashCode();
            }
            id = 17 * uniqueIdCounter++;
            obj.getHashCode = function () { return id; };
            return id;
        };
    } ());

    function newEntry() {
        return { key: null, value: null, next: 0, hashCode: 0 };
    }

    // Dictionary implementation

    var Dictionary = function (capacity, comparer) {
        this._initialize(capacity);
        this.comparer = comparer || defaultComparer;
        this.freeCount = 0;
        this.size = 0;
        this.freeList = -1;
    };

    Dictionary.prototype._initialize = function (capacity) {
        var prime = getPrime(capacity), i;
        this.buckets = new Array(prime);
        this.entries = new Array(prime);
        for (i = 0; i < prime; i++) {
            this.buckets[i] = -1;
            this.entries[i] = newEntry();
        }
        this.freeList = -1;
    };
    Dictionary.prototype.count = function () {
        return this.size;
    };
    Dictionary.prototype.add = function (key, value) {
        return this._insert(key, value, true);
    };
    Dictionary.prototype._insert = function (key, value, add) {
        if (this.buckets === undefined) {
            this._initialize(0);
        }
        var num = getHashCode(key) & 2147483647;
        var index1 = num % this.buckets.length;
        for (var index2 = this.buckets[index1]; index2 >= 0; index2 = this.entries[index2].next) {
            if (this.entries[index2].hashCode === num && this.comparer(this.entries[index2].key, key)) {
                if (add) {
                    throw duplicatekey;
                }
                this.entries[index2].value = value;
                return;
            }
        }
        if (this.freeCount > 0) {
            var index3 = this.freeList;
            this.freeList = this.entries[index3].next;
            --this.freeCount;
        } else {
            if (this.size === this.entries.length) {
                this._resize();
                index1 = num % this.buckets.length;
            }
            index3 = this.size;
            ++this.size;
        }
        this.entries[index3].hashCode = num;
        this.entries[index3].next = this.buckets[index1];
        this.entries[index3].key = key;
        this.entries[index3].value = value;
        this.buckets[index1] = index3;
    };
    Dictionary.prototype._resize = function () {
        var prime = getPrime(this.size * 2);
        var numArray = new Array(prime);
        for (index = 0; index < numArray.length; ++index) {
            numArray[index] = -1;
        }
        var entryArray = new Array(prime);
        for (index = 0; index < this.size; ++index) {
            entryArray[index] = this.entries[index];
        }
        for (var index = this.size; index < prime; ++index) {
            entryArray[index] = newEntry();
        }
        for (var index1 = 0; index1 < this.size; ++index1) {
            var index2 = entryArray[index1].hashCode % prime;
            entryArray[index1].next = numArray[index2];
            numArray[index2] = index1;
        }
        this.buckets = numArray;
        this.entries = entryArray;
    };
    Dictionary.prototype.remove = function (key) {
        if (this.buckets !== undefined) {
            var num = getHashCode(key) & 2147483647;
            var index1 = num % this.buckets.length;
            var index2 = -1;
            for (var index3 = this.buckets[index1]; index3 >= 0; index3 = this.entries[index3].next) {
                if (this.entries[index3].hashCode === num && this.comparer(this.entries[index3].key, key)) {
                    if (index2 < 0) {
                        this.buckets[index1] = this.entries[index3].next;
                    } else {
                        this.entries[index2].next = this.entries[index3].next;
                    }
                    this.entries[index3].hashCode = -1;
                    this.entries[index3].next = this.freeList;
                    this.entries[index3].key = null;
                    this.entries[index3].value = null;
                    this.freeList = index3;
                    ++this.freeCount;
                    return true;
                } else {
                    index2 = index3;
                }
            }
        }
        return false;
    };
    Dictionary.prototype.clear = function () {
        var index, len;
        if (this.size <= 0) {
            return;
        }
        for (index = 0, len = this.buckets.length; index < len; ++index) {
            this.buckets[index] = -1;
        }
        for (index = 0; index < this.size; ++index) {
            this.entries[index] = newEntry();
        }
        this.freeList = -1;
        this.size = 0;
    };
    Dictionary.prototype._findEntry = function (key) {
        if (this.buckets !== undefined) {
            var num = getHashCode(key) & 2147483647;
            for (var index = this.buckets[num % this.buckets.length]; index >= 0; index = this.entries[index].next) {
                if (this.entries[index].hashCode === num && this.comparer(this.entries[index].key, key)) {
                    return index;
                }
            }
        }
        return -1;
    };
    Dictionary.prototype.count = function () {
        return this.size - this.freeCount;
    };
    Dictionary.prototype.tryGetEntry = function (key) {
        var entry = this._findEntry(key);
        if (entry >= 0) {
            return {
                key: this.entries[entry].key,
                value: this.entries[entry].value
            };
        }
        return undefined;
    };
    Dictionary.prototype.getValues = function () {
        var index = 0, results = [];
        if (this.entries !== undefined) {
            for (var index1 = 0; index1 < this.size; index1++) {
                if (this.entries[index1].hashCode >= 0) {
                    results[index++] = this.entries[index1].value;
                }
            }
        }
        return results;
    };
    Dictionary.prototype.get = function (key) {
        var entry = this._findEntry(key);
        if (entry >= 0) {
            return this.entries[entry].value;
        }
        throw new Error(noSuchkey);
    };
    Dictionary.prototype.set = function (key, value) {
        this._insert(key, value, false);
    };
    Dictionary.prototype.containskey = function (key) {
        return this._findEntry(key) >= 0;
    };

    // Joins
    /**
     *  Correlates the elements of two sequences based on overlapping durations.
     *  
     *  @param right The right observable sequence to join elements for.
     *  @param leftDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
     *  @param rightDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
     *  @param resultSelector A function invoked to compute a result element for any two overlapping elements of the left and right observable sequences. The parameters passed to the function correspond with the elements from the left and right source sequences for which overlap occurs.
     *  @return An observable sequence that contains result elements computed from source elements that have an overlapping duration.
     */    
    observableProto.join = function (right, leftDurationSelector, rightDurationSelector, resultSelector) {
        var left = this;
        return new AnonymousObservable(function (observer) {
            var group = new CompositeDisposable(),
            leftDone = false,
            leftId = 0,
            leftMap = new Dictionary(),
            rightDone = false,
            rightId = 0,
            rightMap = new Dictionary();
            group.add(left.subscribe(function (value) {
                var duration,
                expire,
                id = leftId++,
                md = new SingleAssignmentDisposable(),
                result,
                values;
                leftMap.add(id, value);
                group.add(md);
                expire = function () {
                    if (leftMap.remove(id) && leftMap.count() === 0 && leftDone) {
                        observer.onCompleted();
                    }
                    return group.remove(md);
                };
                try {
                    duration = leftDurationSelector(value);
                } catch (e) {
                    observer.onError(e);
                    return;
                }
                md.disposable(duration.take(1).subscribe(noop, observer.onError.bind(observer), function () { expire(); }));
                values = rightMap.getValues();
                for (var i = 0; i < values.length; i++) {
                    try {
                        result = resultSelector(value, values[i]);
                    } catch (exception) {
                        observer.onError(exception);
                        return;
                    }
                    observer.onNext(result);
                }
            }, observer.onError.bind(observer), function () {
                leftDone = true;
                if (rightDone || leftMap.count() === 0) {
                    observer.onCompleted();
                }
            }));
            group.add(right.subscribe(function (value) {
                var duration,
                expire,
                id = rightId++,
                md = new SingleAssignmentDisposable(),
                result,
                values;
                rightMap.add(id, value);
                group.add(md);
                expire = function () {
                    if (rightMap.remove(id) && rightMap.count() === 0 && rightDone) {
                        observer.onCompleted();
                    }
                    return group.remove(md);
                };
                try {
                    duration = rightDurationSelector(value);
                } catch (exception) {
                    observer.onError(exception);
                    return;
                }
                md.disposable(duration.take(1).subscribe(noop, observer.onError.bind(observer), function () { expire(); }));
                values = leftMap.getValues();
                for (var i = 0; i < values.length; i++) {
                    try {
                        result = resultSelector(values[i], value);
                    } catch (exception) {
                        observer.onError(exception);
                        return;
                    }
                    observer.onNext(result);
                }
            }, observer.onError.bind(observer), function () {
                rightDone = true;
                if (leftDone || rightMap.count() === 0) {
                    observer.onCompleted();
                }
            }));
            return group;
        });
    };

    // Group Join
    /**
     *  Correlates the elements of two sequences based on overlapping durations, and groups the results.
     *  
     *  @param right The right observable sequence to join elements for.
     *  @param leftDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
     *  @param rightDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
     *  @param resultSelector A function invoked to compute a result element for any element of the left sequence with overlapping elements from the right observable sequence. The first parameter passed to the function is an element of the left sequence. The second parameter passed to the function is an observable sequence with elements from the right sequence that overlap with the left sequence's element.
     *  @return An observable sequence that contains result elements computed from source elements that have an overlapping duration.
     */    
    observableProto.groupJoin = function (right, leftDurationSelector, rightDurationSelector, resultSelector) {
        var left = this;
        return new AnonymousObservable(function (observer) {
            var group = new CompositeDisposable(),
            r = new RefCountDisposable(group),
            leftId = 0,
            leftMap = new Dictionary(),
            rightId = 0,
            rightMap = new Dictionary();
            group.add(left.subscribe(function (value) {
                var duration,
                    expire,
                    i,
                    id = leftId++,
                    leftValues,
                    result,
                    rightValues;
                var s = new Subject();
                leftMap.add(id, s);
                try {
                    result = resultSelector(value, addRef(s, r));
                } catch (exception) {
                    leftValues = leftMap.getValues();
                    for (i = 0; i < leftValues.length; i++) {
                        leftValues[i].onError(exception);
                    }
                    observer.onError(exception);
                    return;
                }
                observer.onNext(result);
                rightValues = rightMap.getValues();
                for (i = 0; i < rightValues.length; i++) {
                    s.onNext(rightValues[i]);
                }
                var md = new SingleAssignmentDisposable();
                group.add(md);
                expire = function () {
                    if (leftMap.remove(id)) {
                        s.onCompleted();
                    }
                    group.remove(md);
                };
                try {
                    duration = leftDurationSelector(value);
                } catch (exception) {
                    leftValues = leftMap.getValues();
                    for (i = 0; i < leftValues.length; i++) {
                        leftValues[i].onError(exception);
                    }
                    observer.onError(exception);
                    return;
                }
                md.disposable(duration.take(1).subscribe(noop, function (exn) {
                    leftValues = leftMap.getValues();
                    for (var idx = 0, len = leftValues.length; idx < len; idx++) {
                        leftValues[idx].onError(exn);
                    }
                    observer.onError(exn);
                }, function () {
                    expire();
                }));
            }, function (exception) {
                var i, leftValues;
                leftValues = leftMap.getValues();
                for (i = 0; i < leftValues.length; i++) {
                    leftValues[i].onError(exception);
                }
                observer.onError(exception);
            }, observer.onCompleted.bind(observer)));
            group.add(right.subscribe(function (value) {
                var duration, i, leftValues;
                var id = rightId++;
                rightMap.add(id, value);
                var md = new SingleAssignmentDisposable();
                group.add(md);
                var expire = function () {
                    rightMap.remove(id);
                    group.remove(md);
                };
                try {
                    duration = rightDurationSelector(value);
                } catch (exception) {
                    leftValues = leftMap.getValues();
                    for (i = 0; i < leftValues.length; i++) {
                        leftValues[i].onError(exception);
                    }
                    observer.onError(exception);
                    return;
                }
                md.disposable(duration.take(1).subscribe(noop, function (exn) {
                    leftValues = leftMap.getValues();
                    for (var idx = 0; idx < leftValues.length; idx++) {
                        leftValues[idx].onError(exn);
                    }
                    observer.onError(exn);
                }, function () {
                    expire();
                }));
                leftValues = leftMap.getValues();
                for (i = 0; i < leftValues.length; i++) {
                    leftValues[i].onNext(value);
                }
            }, function (exception) {
                var i, leftValues;
                leftValues = leftMap.getValues();
                for (i = 0; i < leftValues.length; i++) {
                    leftValues[i].onError(exception);
                }
                observer.onError(exception);
            }));
            return r;
        });
    };
    
    /**
     *  Projects each element of an observable sequence into zero or more buffers.
     *  
     *  @param bufferOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
     *  @param [bufferClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
     *  @return An observable sequence of windows.    
     */
    observableProto.buffer = function (bufferOpeningsOrClosingSelector, bufferClosingSelector) {
        if (arguments.length === 1 && typeof arguments[0] !== 'function') {
            return observableWindowWithBounaries.call(this, bufferOpeningsOrClosingSelector).selectMany(function (item) {
                return item.toArray();
            });
        }
        return typeof bufferOpeningsOrClosingSelector === 'function' ?
            observableWindowWithClosingSelector(bufferOpeningsOrClosingSelector).selectMany(function (item) {
                return item.toArray();
            }) :
            observableWindowWithOpenings(this, bufferOpeningsOrClosingSelector, bufferClosingSelector).selectMany(function (item) {
                return item.toArray();
            });
    };
    
    /**
     *  Projects each element of an observable sequence into zero or more windows.
     *  
     *  @param windowOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
     *  @param [windowClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
     *  @return An observable sequence of windows.
     */    
    observableProto.window = function (windowOpeningsOrClosingSelector, windowClosingSelector) {
        if (arguments.length === 1 && typeof arguments[0] !== 'function') {
            return observableWindowWithBounaries.call(this, windowOpeningsOrClosingSelector);
        }
        return typeof windowOpeningsOrClosingSelector === 'function' ?
            observableWindowWithClosingSelector.call(this, windowOpeningsOrClosingSelector) :
            observableWindowWithOpenings.call(this, windowOpeningsOrClosingSelector, windowClosingSelector);
    };
    
    function observableWindowWithOpenings(windowOpenings, windowClosingSelector) {
        return windowOpenings.groupJoin(this, windowClosingSelector, function () {
            return observableEmpty();
        }, function (_, window) {
            return window;
        });
    };

    function observableWindowWithBounaries(windowBoundaries) {
        var source = this;
        return new AnonymousObservable(function (observer) {
            var window = new Subject(), 
                d = new CompositeDisposable(), 
                r = new RefCountDisposable(d);

            observer.onNext(addRef(window, r));

            d.add(source.subscribe(function (x) {
                window.onNext(x);
            }, function (err) {
                window.onError(err);
                observer.onError(err);
            }, function () {
                window.onCompleted();
                observer.onCompleted();
            }));

            d.add(windowBoundaries.subscribe(function (w) {
                window.onCompleted();
                window = new Subject();
                observer.onNext(addRef(window, r));
            }, function (err) {
                window.onError(err);
                observer.onError(err);
            }, function () {
                window.onCompleted();
                observer.onCompleted();
            }));

            return r;
        });
    }

    function observableWindowWithClosingSelector(windowClosingSelector) {
        var source = this;
        return new AnonymousObservable(function (observer) {
            var createWindowClose,
                m = new SerialDisposable(),
                d = new CompositeDisposable(m),
                r = new RefCountDisposable(d),
                window = new Subject();
            observer.onNext(addRef(window, r));
            d.add(source.subscribe(function (x) {
                window.onNext(x);
            }, function (ex) {
                window.onError(ex);
                observer.onError(ex);
            }, function () {
                window.onCompleted();
                observer.onCompleted();
            }));
            createWindowClose = function () {
                var m1, windowClose;
                try {
                    windowClose = windowClosingSelector();
                } catch (exception) {
                    observer.onError(exception);
                    return;
                }
                m1 = new SingleAssignmentDisposable();
                m.disposable(m1);
                m1.disposable(windowClose.take(1).subscribe(noop, function (ex) {
                    window.onError(ex);
                    observer.onError(ex);
                }, function () {
                    window.onCompleted();
                    window = new Subject();
                    observer.onNext(addRef(window, r));
                    createWindowClose();
                }));
            };
            createWindowClose();
            return r;
        });
    };

    return root;
}));