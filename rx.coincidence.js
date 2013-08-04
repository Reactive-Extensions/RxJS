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
    
    var Observable = Rx.Observable,
        CompositeDisposable = Rx.CompositeDisposable,
        RefCountDisposable = Rx.RefCountDisposable,
        SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
        SerialDisposable = Rx.SerialDisposable,
        Subject = Rx.Subject,
        observableProto = Observable.prototype,
        observableEmpty = Observable.empty,
        AnonymousObservable = Rx.Internals.AnonymousObservable,
        observerCreate = Rx.Observer.create,
        addRef = Rx.Internals.addRef;

    // defaults
    function noop() { }
    function defaultComparer(x, y) { return x === y; }
    
    // Real Dictionary
    var primes = [1, 3, 7, 13, 31, 61, 127, 251, 509, 1021, 2039, 4093, 8191, 16381, 32749, 65521, 131071, 262139, 524287, 1048573, 2097143, 4194301, 8388593, 16777213, 33554393, 67108859, 134217689, 268435399, 536870909, 1073741789, 2147483647];
    var noSuchkey = "no such key";
    var duplicatekey = "duplicate key";

    function isPrime(candidate) {
        if (candidate & 1 === 0) {
            return candidate === 2;
        }
        var num1 = Math.sqrt(candidate),
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

    function stringHashFn(str) {
        var hash = 757602046;
        if (!str.length) {
            return hash;
        }
        for (var i = 0, len = str.length; i < len; i++) {
            var character = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+character;
            hash = hash & hash;
        }
        return hash;
    }

    function numberHashFn(key) {
        var c2 = 0x27d4eb2d; 
        key = (key ^ 61) ^ (key >>> 16);
        key = key + (key << 3);
        key = key ^ (key >>> 4);
        key = key * c2;
        key = key ^ (key >>> 15);
        return key;
    }

    var getHashCode = (function () {
        var uniqueIdCounter = 0;

        return function (obj) {
            if (obj == null) { 
                throw new Error(noSuchkey);
            }

            // Check for built-ins before tacking on our own for any object
            if (typeof obj === 'string') {
                return stringHashFn(obj);
            }

            if (typeof obj === 'number') {
                return numberHashFn(obj);
            }

            if (typeof obj === 'boolean') {
                return obj === true ? 1 : 0;
            }

            if (obj instanceof Date) {
                return obj.getTime();
            }

            if (obj.getHashCode) {
                return obj.getHashCode();
            }

            var id = 17 * uniqueIdCounter++;
            obj.getHashCode = function () { return id; };
            return id;
        };
    } ());

    function newEntry() {
        return { key: null, value: null, next: 0, hashCode: 0 };
    }

    // Dictionary implementation

    var Dictionary = function (capacity, comparer) {
        if (capacity < 0) {
            throw new Error('out of range')
        }
        if (capacity > 0) {
            this._initialize(capacity);
        }
        
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
        if (!this.buckets) {
            this._initialize(0);
        }
        var index3;
        var num = getHashCode(key) & 2147483647;
        var index1 = num % this.buckets.length;
        for (var index2 = this.buckets[index1]; index2 >= 0; index2 = this.entries[index2].next) {
            if (this.entries[index2].hashCode === num && this.comparer(this.entries[index2].key, key)) {
                if (add) {
                    throw new Error(duplicatekey);
                }
                this.entries[index2].value = value;
                return;
            }
        }
        if (this.freeCount > 0) {
            index3 = this.freeList;
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
        var prime = getPrime(this.size * 2),
            numArray = new Array(prime);
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
        if (this.buckets) {
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
        if (this.buckets) {
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

    Dictionary.prototype.tryGetValue = function (key) {
        var entry = this._findEntry(key);
        if (entry >= 0) {
            return this.entries[entry].value;
        }
        return undefined;
    };

    Dictionary.prototype.getValues = function () {
        var index = 0, results = [];
        if (this.entries) {
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

    /**
     *  Correlates the elements of two sequences based on overlapping durations.
     *  
     *  @param {Observable} right The right observable sequence to join elements for.
     *  @param {Function} leftDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
     *  @param {Function} rightDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
     *  @param {Function} resultSelector A function invoked to compute a result element for any two overlapping elements of the left and right observable sequences. The parameters passed to the function correspond with the elements from the left and right source sequences for which overlap occurs.
     *  @returns {Observable} An observable sequence that contains result elements computed from source elements that have an overlapping duration.
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

    /**
     *  Correlates the elements of two sequences based on overlapping durations, and groups the results.
     *  
     *  @param {Observable} right The right observable sequence to join elements for.
     *  @param {Function} leftDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
     *  @param {Function} rightDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
     *  @param {Function} resultSelector A function invoked to compute a result element for any element of the left sequence with overlapping elements from the right observable sequence. The first parameter passed to the function is an element of the left sequence. The second parameter passed to the function is an observable sequence with elements from the right sequence that overlap with the left sequence's element.
     *  @returns {Observable} An observable sequence that contains result elements computed from source elements that have an overlapping duration.
     */    
    observableProto.groupJoin = function (right, leftDurationSelector, rightDurationSelector, resultSelector) {
        var left = this;
        return new AnonymousObservable(function (observer) {
            var nothing = function () {};
            var group = new CompositeDisposable();
            var r = new RefCountDisposable(group);
            var leftMap = new Dictionary();
            var rightMap = new Dictionary();
            var leftID = 0;
            var rightID = 0;

            group.add(left.subscribe(
                function (value) {
                    var s = new Subject();
                    var id = leftID++;
                    leftMap.add(id, s);
                    var i, len, leftValues, rightValues;

                    var result;
                    try {
                        result = resultSelector(value, addRef(s, r));
                    } catch (e) {
                        leftValues = leftMap.getValues();
                        for (i = 0, len = leftValues.length; i < len; i++) {
                            leftValues[i].onError(e);
                        }
                        observer.onError(e);
                        return;
                    }
                    observer.onNext(result);

                    rightValues = rightMap.getValues();
                    for (i = 0, len = rightValues.length; i < len; i++) {
                        s.onNext(rightValues[i]);
                    }

                    var md = new SingleAssignmentDisposable();
                    group.add(md);

                    var expire = function () {
                        if (leftMap.remove(id)) {
                            s.onCompleted();
                        }
                            
                        group.remove(md);
                    };

                    var duration;
                    try {
                        duration = leftDurationSelector(value);
                    } catch (e) {
                        leftValues = leftMap.getValues();
                        for (i = 0, len = leftMap.length; i < len; i++) {
                            leftValues[i].onError(e);
                        }
                        observer.onError(e);
                        return;
                    }

                    md.setDisposable(duration.take(1).subscribe(
                        nothing,
                        function (e) {
                            leftValues = leftMap.getValues();
                            for (i = 0, len = leftValues.length; i < len; i++) {
                                leftValues[i].onError(e);
                            }
                            observer.onError(e);
                        },
                        expire)
                    );
                },
                function (e) {
                    var leftValues = leftMap.getValues();
                    for (var i = 0, len = leftValues.length; i < len; i++) {
                        leftValues[i].onError(e);
                    }
                    observer.onError(e);
                },
                observer.onCompleted.bind(observer)));

            group.add(right.subscribe(
                function (value) {
                    var leftValues, i, len;
                    var id = rightID++;
                    rightMap.add(id, value);

                    var md = new SingleAssignmentDisposable();
                    group.add(md);

                    var expire = function () {
                        rightMap.remove(id);
                        group.remove(md);
                    };

                    var duration;
                    try {
                        duration = rightDurationSelector(value);
                    } catch (e) {
                        leftValues = leftMap.getValues();
                        for (i = 0, len = leftMap.length; i < len; i++) {
                            leftValues[i].onError(e);
                        }
                        observer.onError(e);
                        return;
                    }
                    md.setDisposable(duration.take(1).subscribe(
                        nothing,
                        function (e) {
                            leftValues = leftMap.getValues();
                            for (i = 0, len = leftMap.length; i < len; i++) {
                                leftValues[i].onError(e);
                            }
                            observer.onError(e);
                        },
                        expire)
                    );

                    leftValues = leftMap.getValues();
                    for (i = 0, len = leftValues.length; i < len; i++) {
                        leftValues[i].onNext(value);
                    }
                },
                function (e) {
                    var leftValues = leftMap.getValues();
                    for (var i = 0, len = leftValues.length; i < len; i++) {
                        leftValues[i].onError(e);
                    }
                    observer.onError(e);
                }));

            return r;
        });
    }
    
    /**
     *  Projects each element of an observable sequence into zero or more buffers.
     *  
     *  @param {Mixed} bufferOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
     *  @param {Function} [bufferClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
     *  @returns {Observable} An observable sequence of windows.    
     */
    observableProto.buffer = function (bufferOpeningsOrClosingSelector, bufferClosingSelector) {
        if (arguments.length === 1 && typeof arguments[0] !== 'function') {
            return observableWindowWithBounaries.call(this, bufferOpeningsOrClosingSelector).selectMany(function (item) {
                return item.toArray();
            });
        }
        return typeof bufferOpeningsOrClosingSelector === 'function' ?
            observableWindowWithClosingSelector.call(this, bufferOpeningsOrClosingSelector).selectMany(function (item) {
                return item.toArray();
            }) :
            observableWindowWithOpenings.call(this, bufferOpeningsOrClosingSelector, bufferClosingSelector).selectMany(function (item) {
                return item.toArray();
            });
    };
    
    /**
     *  Projects each element of an observable sequence into zero or more windows.
     *  
     *  @param {Mixed} windowOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
     *  @param {Function} [windowClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
     *  @returns {Observable} An observable sequence of windows.
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
    }

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
    }

    return Rx;
}));