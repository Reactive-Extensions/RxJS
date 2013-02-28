// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

(function (window, undefined) {
    var freeExports = typeof exports == 'object' && exports &&
        (typeof global == 'object' && global && global == global.global && (window = global), exports);

    var root = { Internals: {} };
    
    // Defaults
    function noop() { }
    function identity(x) { return x; }
    function defaultNow() { return new Date().getTime(); }
    function defaultComparer(x, y) { return x === y; }
    function defaultSubComparer(x, y) { return x - y; }
    function defaultKeySerializer(x) { return x.toString(); }
    function defaultError(err) { throw err; }

    // Errors
    var sequenceContainsNoElements = 'Sequence contains no elements.';
    var argumentOutOfRange = 'Argument out of range';
    var objectDisposed = 'Object has been disposed';
    function checkDisposed() {
        if (this.isDisposed) {
            throw new Error(objectDisposed);
        }
    }
    
    // Utilities
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (that) {
            var target = this,
                args = slice.call(arguments, 1);
            var bound = function () {
                if (this instanceof bound) {
                    function F() { }
                    F.prototype = target.prototype;
                    var self = new F();
                    var result = target.apply(self, args.concat(slice.call(arguments)));
                    if (Object(result) === result) {
                        return result;
                    }
                    return self;
                } else {
                    return target.apply(that, args.concat(slice.call(arguments)));
                }
            };

            return bound;
        };
    }
    var slice = Array.prototype.slice;
    function argsOrArray(args, idx) {
        return args.length === 1 && Array.isArray(args[idx]) ?
            args[idx] :
            slice.call(args);
    }
    var hasProp = {}.hasOwnProperty;
    var inherits = root.Internals.inherits = function (child, parent) {
        for (var key in parent) { // Enumerable bug in WebKit Mobile 4.0
            if (key !== 'prototype' && hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() { this.constructor = child; }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.super_ = parent.prototype;
        return child;
    };
    var addProperties = root.Internals.addProperties = function (obj) {
        var sources = slice.call(arguments, 1);
        for (var i = 0, len = sources.length; i < len; i++) {
            var source = sources[i];
            for (var prop in source) {
                obj[prop] = source[prop];
            }
        }
    };

    // Rx Utils
    var addRef = root.Internals.addRef = function (xs, r) {
        return new AnonymousObservable(function (observer) {
            return new CompositeDisposable(r.getDisposable(), xs.subscribe(observer));
        });
    };

    // Collection polyfills
    function arrayInitialize(count, factory) {
        var a = new Array(count);
        for (var i = 0; i < count; i++) {
            a[i] = factory();
        }
        return a;
    }

    var boxedString = Object("a"),
        splitString = boxedString[0] != "a" || !(0 in boxedString);
    if (!Array.prototype.every) {
        Array.prototype.every = function every(fun /*, thisp */) {
            var object = Object(this),
                self = splitString && {}.toString.call(this) == "[object String]" ?
                    this.split("") :
                    object,
                length = self.length >>> 0,
                thisp = arguments[1];

            // If no callback function or if callback is not a callable function
            if ({}.toString.call(fun) != "[object Function]") {
                throw new TypeError(fun + " is not a function");
            }

            for (var i = 0; i < length; i++) {
                if (i in self && !fun.call(thisp, self[i], i, object)) {
                    return false;
                }
            }
            return true;
        };
    }
    if (!Array.prototype.map) {
        Array.prototype.map = function map(fun /*, thisp*/) {
            var object = Object(this),
                self = splitString && {}.toString.call(this) == "[object String]" ?
                    this.split("") :
                    object,
                length = self.length >>> 0,
                result = Array(length),
                thisp = arguments[1];

            // If no callback function or if callback is not a callable function
            if ({}.toString.call(fun) != "[object Function]") {
                throw new TypeError(fun + " is not a function");
            }

            for (var i = 0; i < length; i++) {
                if (i in self)
                    result[i] = fun.call(thisp, self[i], i, object);
            }
            return result;
        };
    }
    if (!Array.prototype.filter) {
        Array.prototype.filter = function (predicate) {
            var results = [], item, t = new Object(this);
            for (var i = 0, len = t.length >>> 0; i < len; i++) {
                item = t[i];
                if (i in t && predicate.call(arguments[1], item, i, t)) {
                    results.push(item);
                }
            }
            return results;
        };
    }
    if (!Array.isArray) {
        Array.isArray = function (arg) {
            return Object.prototype.toString.call(arg) == '[object Array]';
        };
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function indexOf(searchElement) {
            var t = Object(this);
            var len = t.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = 0;
            if (arguments.length > 1) {
                n = Number(arguments[1]);
                if (n != n) {
                    n = 0;
                } else if (n != 0 && n != Infinity && n != -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            if (n >= len) {
                return -1;
            }
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        };
    }

    // Collections
    var IndexedItem = function (id, value) {
        this.id = id;
        this.value = value;
    };

    IndexedItem.prototype.compareTo = function (other) {
        var c = this.value.compareTo(other.value);
        if (c === 0) {
            c = this.id - other.id;
        }
        return c;
    };

    // Priority Queue for Scheduling
    var PriorityQueue = function (capacity) {
        this.items = new Array(capacity);
        this.length = 0;
    };
    var priorityProto = PriorityQueue.prototype;
    priorityProto.isHigherPriority = function (left, right) {
        return this.items[left].compareTo(this.items[right]) < 0;
    };
    priorityProto.percolate = function (index) {
        if (index >= this.length || index < 0) {
            return;
        }
        var parent = index - 1 >> 1;
        if (parent < 0 || parent === index) {
            return;
        }
        if (this.isHigherPriority(index, parent)) {
            var temp = this.items[index];
            this.items[index] = this.items[parent];
            this.items[parent] = temp;
            this.percolate(parent);
        }
    };
    priorityProto.heapify = function (index) {
        if (index === undefined) {
            index = 0;
        }
        if (index >= this.length || index < 0) {
            return;
        }
        var left = 2 * index + 1,
            right = 2 * index + 2,
            first = index;
        if (left < this.length && this.isHigherPriority(left, first)) {
            first = left;
        }
        if (right < this.length && this.isHigherPriority(right, first)) {
            first = right;
        }
        if (first !== index) {
            var temp = this.items[index];
            this.items[index] = this.items[first];
            this.items[first] = temp;
            this.heapify(first);
        }
    };
    priorityProto.peek = function () {
        return this.items[0].value;
    };
    priorityProto.removeAt = function (index) {
        this.items[index] = this.items[--this.length];
        delete this.items[this.length];
        this.heapify();
    };
    priorityProto.dequeue = function () {
        var result = this.peek();
        this.removeAt(0);
        return result;
    };
    priorityProto.enqueue = function (item) {
        var index = this.length++;
        this.items[index] = new IndexedItem(PriorityQueue.count++, item);
        this.percolate(index);
    };
    priorityProto.remove = function (item) {
        for (var i = 0; i < this.length; i++) {
            if (this.items[i].value === item) {
                this.removeAt(i);
                return true;
            }
        }
        return false;
    };
    PriorityQueue.count = 0;
    /**
     * @constructor
     * Represents a group of disposable resources that are disposed together.
     */
    var CompositeDisposable = root.CompositeDisposable = function () {
        this.disposables = argsOrArray(arguments, 0);
        this.isDisposed = false;
        this.length = this.disposables.length;
    };

    /**
     *  Adds a disposable to the CompositeDisposable or disposes the disposable if the CompositeDisposable is disposed.
     *  
     *  @param item Disposable to add.
     */    
    CompositeDisposable.prototype.add = function (item) {
        if (this.isDisposed) {
            item.dispose();
        } else {
            this.disposables.push(item);
            this.length++;
        }
    };

    /**
     *  Removes and disposes the first occurrence of a disposable from the CompositeDisposable.
     *  
     *  @param item Disposable to remove.
     *  @return true if found; false otherwise.
     */
    CompositeDisposable.prototype.remove = function (item) {
        var shouldDispose = false;
        if (!this.isDisposed) {
            var idx = this.disposables.indexOf(item);
            if (idx !== -1) {
                shouldDispose = true;
                this.disposables.splice(idx, 1);
                this.length--;
                item.dispose();
            }

        }
        return shouldDispose;
    };

    /**
     *  Disposes all disposables in the group and removes them from the group.
     */
    CompositeDisposable.prototype.dispose = function () {
        if (!this.isDisposed) {
            this.isDisposed = true;
            var currentDisposables = this.disposables.slice(0);
            this.disposables = [];
            this.length = 0;

            for (var i = 0, len = currentDisposables.length; i < len; i++) {
                currentDisposables[i].dispose();
            }
        }
    };

    /**
     *  Removes and disposes all disposables from the CompositeDisposable, but does not dispose the CompositeDisposable.
     */   
    CompositeDisposable.prototype.clear = function () {
        var currentDisposables = this.disposables.slice(0);
        this.disposables = [];
        this.length = 0;
        for (var i = 0, len = currentDisposables.length; i < len; i++) {
            currentDisposables[i].dispose();
        }
    };

    /**
     *  Determines whether the CompositeDisposable contains a specific disposable.
     *  
     *  @param item Disposable to search for.
     *  @return true if the disposable was found; otherwise, false.
     */    
    CompositeDisposable.prototype.contains = function (item) {
        return this.disposables.indexOf(item) !== -1;
    };

    /**
     *  Converts the existing CompositeDisposable to an array of disposables
     *  
     *  @return An array of disposable objects.
     */  
    CompositeDisposable.prototype.toArray = function () {
        return this.disposables.slice(0);
    };
    
    /**
     * @constructor
     * Provides a set of static methods for creating Disposables.
     * @param dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
     */
    var Disposable = root.Disposable = function (action) {
        this.isDisposed = false;
        this.action = action;
    };

    /** Performs the task of cleaning up resources. */     
    Disposable.prototype.dispose = function () {
        if (!this.isDisposed) {
            this.action();
            this.isDisposed = true;
        }
    };

    /**
     *  Creates a disposable object that invokes the specified action when disposed.
     *  
     *  @param dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
     *  @return The disposable object that runs the given action upon disposal.
     */
    var disposableCreate = Disposable.create = function (action) { return new Disposable(action); };

    /** Gets the disposable that does nothing when disposed. */
    var disposableEmpty = Disposable.empty = { dispose: noop };

    /**
     * @constructor
     *  Represents a disposable resource which only allows a single assignment of its underlying disposable resource.
     *  If an underlying disposable resource has already been set, future attempts to set the underlying disposable resource will throw an Error.
     */
    var SingleAssignmentDisposable = root.SingleAssignmentDisposable = function () {
        this.isDisposed = false;
        this.current = null;
    };

    /**
     *  Gets or sets the underlying disposable. After disposal, the result of getting this method is undefined.
     *  
     *  @param [value] The new underlying disposable.
     *  @return The underlying disposable.
     */
    SingleAssignmentDisposable.prototype.disposable = function (value) {
        return !value ? this.getDisposable() : this.setDisposable(value);
    };

    /**
     *  Gets the underlying disposable. After disposal, the result of getting this method is undefined.
     *  @return The underlying disposable.
     */  
    SingleAssignmentDisposable.prototype.getDisposable = function () {
        return this.current;
    };

    /**
     *  Sets the underlying disposable. 
     *  @param value The new underlying disposable.
     */
    SingleAssignmentDisposable.prototype.setDisposable = function (value) {
        if (this.current) {
            throw new Error('Disposable has already been assigned');
        }
        var shouldDispose = this.isDisposed;
        if (!shouldDispose) {
            this.current = value;
        }
        if (shouldDispose && value) {
            value.dispose();
        }
    };

    /** Disposes the underlying disposable. */   
    SingleAssignmentDisposable.prototype.dispose = function () {
        var old;
        if (!this.isDisposed) {
            this.isDisposed = true;
            old = this.current;
            this.current = null;
        }
        if (old) {
            old.dispose();
        }
    };

    /**
     * @constructor
     * Represents a disposable resource whose underlying disposable resource can be replaced by another disposable resource, causing automatic disposal of the previous underlying disposable resource.
     */
    var SerialDisposable = root.SerialDisposable = function () {
        this.isDisposed = false;
        this.current = null;
    };

    /**
     * Gets the underlying disposable.
     * @return The underlying disposable</returns>
     */
    SerialDisposable.prototype.getDisposable = function () {
        return this.current;
    };

    /**
     * Sets the underlying disposable.
     * @param value The new underlying disposable.
     */  
    SerialDisposable.prototype.setDisposable = function (value) {
        var shouldDispose = this.isDisposed, old;
        if (!shouldDispose) {
            old = this.current;
            this.current = value;
        }
        if (old) {
            old.dispose();
        }
        if (shouldDispose && value) {
            value.dispose();
        }
    };

    /**
     * Gets or sets the underlying disposable.
     * If the SerialDisposable has already been disposed, assignment to this property causes immediate disposal of the given disposable object. Assigning this property disposes the previous disposable object.
     */    
    SerialDisposable.prototype.disposable = function (value) {
        if (!value) {
            return this.getDisposable();
        } else {
            this.setDisposable(value);
        }
    };

    /** Disposes the underlying disposable as well as all future replacements. */   
    SerialDisposable.prototype.dispose = function () {
        var old;
        if (!this.isDisposed) {
            this.isDisposed = true;
            old = this.current;
            this.current = null;
        }
        if (old) {
            old.dispose();
        }
    };

    /**
     * Represents a disposable resource that only disposes its underlying disposable resource when all <see cref="GetDisposable">dependent disposable objects</see> have been disposed.
     */  
    var RefCountDisposable = root.RefCountDisposable = (function () {

        function InnerDisposable(disposable) {
            this.disposable = disposable;
            this.disposable.count++;
            this.isInnerDisposed = false;
        }

        InnerDisposable.prototype.dispose = function () {
            if (!this.disposable.isDisposed) {
                if (!this.isInnerDisposed) {
                    this.isInnerDisposed = true;
                    this.disposable.count--;
                    if (this.disposable.count === 0 && this.disposable.isPrimaryDisposed) {
                        this.disposable.isDisposed = true;
                        this.disposable.underlyingDisposable.dispose();
                    }
                }
            }
        };

        /**
         * Initializes a new instance of the RefCountDisposable with the specified disposable.
         * @param disposable Underlying disposable.
          */
        function RefCountDisposable(disposable) {
            this.underlyingDisposable = disposable;
            this.isDisposed = false;
            this.isPrimaryDisposed = false;
            this.count = 0;
        }

        /** Disposes the underlying disposable only when all dependent disposables have been disposed */
        RefCountDisposable.prototype.dispose = function () {
            if (!this.isDisposed) {
                if (!this.isPrimaryDisposed) {
                    this.isPrimaryDisposed = true;
                    if (this.count === 0) {
                        this.isDisposed = true;
                        this.underlyingDisposable.dispose();
                    }
                }
            }
        };

        /**
         * Returns a dependent disposable that when disposed decreases the refcount on the underlying disposable.
         * @return A dependent disposable contributing to the reference count that manages the underlying disposable's lifetime.H
         */        
        RefCountDisposable.prototype.getDisposable = function () {
            return this.isDisposed ? disposableEmpty : new InnerDisposable(this);
        };

        return RefCountDisposable;
    })();

    function ScheduledDisposable(scheduler, disposable) {
        this.scheduler = scheduler, this.disposable = disposable, this.isDisposed = false;
    }
    ScheduledDisposable.prototype.dispose = function () {
        var parent = this;
        this.scheduler.schedule(function () {
            if (!parent.isDisposed) {
                parent.isDisposed = true;
                parent.disposable.dispose();
            }
        });
    };

    function ScheduledItem(scheduler, state, action, dueTime, comparer) {
        this.scheduler = scheduler;
        this.state = state;
        this.action = action;
        this.dueTime = dueTime;
        this.comparer = comparer || defaultSubComparer;
        this.disposable = new SingleAssignmentDisposable();
    }
    ScheduledItem.prototype.invoke = function () {
        this.disposable.disposable(this.invokeCore());
    };
    ScheduledItem.prototype.compareTo = function (other) {
        return this.comparer(this.dueTime, other.dueTime);
    };
    ScheduledItem.prototype.isCancelled = function () {
        return this.disposable.isDisposed;
    };
    ScheduledItem.prototype.invokeCore = function () {
        return this.action(this.scheduler, this.state);
    };

    /** Provides a set of static properties to access commonly used schedulers. */
    var Scheduler = root.Scheduler = (function () {

        /** @constructor */
        function Scheduler(now, schedule, scheduleRelative, scheduleAbsolute) {
            this.now = now;
            this._schedule = schedule;
            this._scheduleRelative = scheduleRelative;
            this._scheduleAbsolute = scheduleAbsolute;
        }

        function invokeRecImmediate(scheduler, pair) {
            var state = pair.first, action = pair.second, group = new CompositeDisposable(),
            recursiveAction = function (state1) {
                action(state1, function (state2) {
                    var isAdded = false, isDone = false,
                    d = scheduler.scheduleWithState(state2, function (scheduler1, state3) {
                        if (isAdded) {
                            group.remove(d);
                        } else {
                            isDone = true;
                        }
                        recursiveAction(state3);
                        return disposableEmpty;
                    });
                    if (!isDone) {
                        group.add(d);
                        isAdded = true;
                    }
                });
            };
            recursiveAction(state);
            return group;
        }

        function invokeRecDate(scheduler, pair, method) {
            var state = pair.first, action = pair.second, group = new CompositeDisposable(),
            recursiveAction = function (state1) {
                action(state1, function (state2, dueTime1) {
                    var isAdded = false, isDone = false,
                    d = scheduler[method].call(scheduler, state2, dueTime1, function (scheduler1, state3) {
                        if (isAdded) {
                            group.remove(d);
                        } else {
                            isDone = true;
                        }
                        recursiveAction(state3);
                        return disposableEmpty;
                    });
                    if (!isDone) {
                        group.add(d);
                        isAdded = true;
                    }
                });
            };
            recursiveAction(state);
            return group;
        }

        function invokeAction(scheduler, action) {
            action();
            return disposableEmpty;
        }

        var schedulerProto = Scheduler.prototype;

        /**
         * Returns a scheduler that wraps the original scheduler, adding exception handling for scheduled actions.
         * 
         * @param scheduler Scheduler to apply an exception filter for.
         * @param handler Handler that's run if an exception is caught. The exception will be rethrown if the handler returns false.
         * @return Wrapper around the original scheduler, enforcing exception handling.
         */        
        schedulerProto.catchException = function (handler) {
            return new CatchScheduler(this, handler);
        };
        
        /**
         * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using window.setInterval for the base implementation.
         * 
         * @param period Period for running the work periodically.
         * @param action Action to be executed.
         * @return The disposable object used to cancel the scheduled recurring action (best effort).
         */        
        schedulerProto.schedulePeriodic = function (period, action) {
            return this.schedulePeriodicWithState(null, period, function () {
                action();
            });
        };

        /**
         * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using window.setInterval for the base implementation.
         * 
         * @param state Initial state passed to the action upon the first iteration.
         * @param period Period for running the work periodically.
         * @param action Action to be executed, potentially updating the state.
         * @return The disposable object used to cancel the scheduled recurring action (best effort).
         */
        schedulerProto.schedulePeriodicWithState = function (state, period, action) {
            var s = state, id = window.setInterval(function () {
                s = action(s);
            }, period);
            return disposableCreate(function () {
                window.clearInterval(id);
            });
        };

        /**
         * Schedules an action to be executed.
         * 
         * @param action Action to execute.
         * @return The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.schedule = function (action) {
            return this._schedule(action, invokeAction);
        };

        /**
         * Schedules an action to be executed.
         * 
         * @param state State passed to the action to be executed.
         * @param action Action to be executed.
         * @return The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.scheduleWithState = function (state, action) {
            return this._schedule(state, action);
        };

        /**
         * Schedules an action to be executed after the specified relative due time.
         * 
         * @param action Action to execute.
         * @param dueTime Relative time after which to execute the action.
         * @return The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.scheduleWithRelative = function (dueTime, action) {
            return this._scheduleRelative(action, dueTime, invokeAction);
        };

        /**
         * Schedules an action to be executed after dueTime.
         * 
         * @param state State passed to the action to be executed.
         * @param action Action to be executed.
         * @param dueTime Relative time after which to execute the action.
         * @return The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.scheduleWithRelativeAndState = function (state, dueTime, action) {
            return this._scheduleRelative(state, dueTime, action);
        };

        /**
         * Schedules an action to be executed at the specified absolute due time.
         * 
         * @param action Action to execute.
         * @param dueTime Absolute time at which to execute the action.
         * @return The disposable object used to cancel the scheduled action (best effort).
          */
        schedulerProto.scheduleWithAbsolute = function (dueTime, action) {
            return this._scheduleAbsolute(action, dueTime, invokeAction);
        };

        /**
         * Schedules an action to be executed at dueTime.
         * 
         * @param state State passed to the action to be executed.
         * @param action Action to be executed.
         * @param dueTime Absolute time at which to execute the action.
         * @return The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.scheduleWithAbsoluteAndState = function (state, dueTime, action) {
            return this._scheduleAbsolute(state, dueTime, action);
        };

        /**
         * Schedules an action to be executed recursively.
         * 
         * @param action Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action.
         * @return The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.scheduleRecursive = function (action) {
            return this.scheduleRecursiveWithState(action, function (_action, self) {
                _action(function () {
                    self(_action);
                });
            });
        };

        /**
         * Schedules an action to be executed recursively.
         * 
         * @param state State passed to the action to be executed.
         * @param action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in recursive invocation state.
         * @return The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.scheduleRecursiveWithState = function (state, action) {
            return this.scheduleWithState({ first: state, second: action }, function (s, p) {
                return invokeRecImmediate(s, p);
            });
        };

        /**
         * Schedules an action to be executed recursively after a specified relative due time.
         * 
         * @param action Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action at the specified relative time.
         * @param dueTime Relative time after which to execute the action for the first time.
         * @return The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.scheduleRecursiveWithRelative = function (dueTime, action) {
            return this.scheduleRecursiveWithRelativeAndState(action, dueTime, function (_action, self) {
                _action(function (dt) {
                    self(_action, dt);
                });
            });
        };

        /**
         * Schedules an action to be executed recursively after a specified relative due time.
         * 
         * @param state State passed to the action to be executed.
         * @param action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.
         * @param dueTime Relative time after which to execute the action for the first time.
         * @return The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.scheduleRecursiveWithRelativeAndState = function (state, dueTime, action) {
            return this._scheduleRelative({ first: state, second: action }, dueTime, function (s, p) {
                return invokeRecDate(s, p, 'scheduleWithRelativeAndState');
            });
        };

        /**
         * Schedules an action to be executed recursively at a specified absolute due time.
         * 
         * @param action Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action at the specified absolute time.
         * @param dueTime Absolute time at which to execute the action for the first time.
         * @return The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.scheduleRecursiveWithAbsolute = function (dueTime, action) {
            return this.scheduleRecursiveWithAbsoluteAndState(action, dueTime, function (_action, self) {
                _action(function (dt) {
                    self(_action, dt);
                });
            });
        };

        /**
         * Schedules an action to be executed recursively at a specified absolute due time.
         * 
         * @param state State passed to the action to be executed.
         * @param action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.
         * @param dueTime Absolute time at which to execute the action for the first time.
         * @return The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.scheduleRecursiveWithAbsoluteAndState = function (state, dueTime, action) {
            return this._scheduleAbsolute({ first: state, second: action }, dueTime, function (s, p) {
                return invokeRecDate(s, p, 'scheduleWithAbsoluteAndState');
            });
        };

        /** Gets the current time according to the local machine's system clock. */
        Scheduler.now = defaultNow;

        /**
         * Normalizes the specified TimeSpan value to a positive value.
         * 
         * @param {Number} timeSpan The time span value to normalize.
         * @return The specified TimeSpan value if it is zero or positive; otherwise, 0
         */   
        Scheduler.normalize = function (timeSpan) {
            if (timeSpan < 0) {
                timeSpan = 0;
            }
            return timeSpan;
        };

        return Scheduler;
    }());
    
    // Immediate Scheduler
    var schedulerNoBlockError = 'Scheduler is not allowed to block the thread';
    var immediateScheduler = Scheduler.immediate = (function () {

        function scheduleNow(state, action) {
            return action(this, state);
        }

        function scheduleRelative(state, dueTime, action) {
            if (dueTime > 0) throw new Error(schedulerNoBlockError);
            return action(this, state);
        }

        function scheduleAbsolute(state, dueTime, action) {
            return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
        }

        return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);
    }());

    // Current Thread Scheduler
    var currentThreadScheduler = Scheduler.currentThread = (function () {
        var queue;

        function Trampoline() {
            queue = new PriorityQueue(4);
        }

        Trampoline.prototype.dispose = function () {
            queue = null;
        };

        Trampoline.prototype.run = function () {
            var item;
            while (queue.length > 0) {
                item = queue.dequeue();
                if (!item.isCancelled()) {
                    while (item.dueTime - Scheduler.now() > 0) {
                    }
                    if (!item.isCancelled()) {
                        item.invoke();
                    }
                }
            }
        };

        function scheduleNow(state, action) {
            return this.scheduleWithRelativeAndState(state, 0, action);
        }

        function scheduleRelative(state, dueTime, action) {
            var dt = this.now() + Scheduler.normalize(dueTime),
                    si = new ScheduledItem(this, state, action, dt),
                    t;
            if (!queue) {
                t = new Trampoline();
                try {
                    queue.enqueue(si);
                    t.run();
                } catch (e) { 
                    throw e;
                } finally {
                    t.dispose();
                }
            } else {
                queue.enqueue(si);
            }
            return si.disposable;
        }

        function scheduleAbsolute(state, dueTime, action) {
            return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
        }

        var currentScheduler = new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);
        currentScheduler.scheduleRequired = function () { return queue === null; };
        currentScheduler.ensureTrampoline = function (action) {
            if (queue === null) {
                return this.schedule(action);
            } else {
                return action();
            }
        };

        return currentScheduler;
    }());

    var SchedulePeriodicRecursive = (function () {
        function tick(command, recurse) {
            recurse(0, this._period);
            try {
                this._state = this._action(this._state);
            } catch (e) {
                this._cancel.dispose();
                throw e;
            }
        }

        function SchedulePeriodicRecursive(scheduler, state, period, action) {
            this._scheduler = scheduler;
            this._state = state;
            this._period = period;
            this._action = action;
        }

        SchedulePeriodicRecursive.prototype.start = function () {
            var d = new SingleAssignmentDisposable();
            this._cancel = d;
            d.setDisposable(this._scheduler.scheduleRecursiveWithRelativeAndState(0, this._period, tick.bind(this)));

            return d;
        };

        return SchedulePeriodicRecursive;
    }());

    /** Provides a set of extension methods for virtual time scheduling. */
    root.VirtualTimeScheduler = (function () {

        function localNow() {
            return this.toDateTimeOffset(this.clock);
        }

        function scheduleNow(state, action) {
            return this.scheduleAbsoluteWithState(state, this.clock, action);
        }

        function scheduleRelative(state, dueTime, action) {
            return this.scheduleRelativeWithState(state, this.toRelative(dueTime), action);
        }

        function scheduleAbsolute(state, dueTime, action) {
            return this.scheduleRelativeWithState(state, this.toRelative(dueTime - this.now()), action);
        }

        function invokeAction(scheduler, action) {
            action();
            return disposableEmpty;
        }

        inherits(VirtualTimeScheduler, Scheduler);

        /**
         * Creates a new virtual time scheduler with the specified initial clock value and absolute time comparer.
         * @param initialClock Initial value for the clock.
         * @param comparer Comparer to determine causality of events based on absolute time.
         */
        function VirtualTimeScheduler(initialClock, comparer) {
            this.clock = initialClock;
            this.comparer = comparer;
            this.isEnabled = false;
            this.queue = new PriorityQueue(1024);
            VirtualTimeScheduler.super_.constructor.call(this, localNow, scheduleNow, scheduleRelative, scheduleAbsolute);
        }

        addProperties(VirtualTimeScheduler.prototype, {
            /**
             * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be emulated using recursive scheduling.
             * 
             * @param state Initial state passed to the action upon the first iteration.
             * @param period Period for running the work periodically.
             * @param action Action to be executed, potentially updating the state.
             * @return The disposable object used to cancel the scheduled recurring action (best effort).
             */      
            schedulePeriodicWithState: function (state, period, action) {
                var s = new SchedulePeriodicRecursive(this, state, period, action);
                return s.start();
            },
            /**
             * Schedules an action to be executed after dueTime.
             * 
             * @param state State passed to the action to be executed.
             * @param dueTime Relative time after which to execute the action.
             * @param action Action to be executed.
             * @return The disposable object used to cancel the scheduled action (best effort).
             */            
            scheduleRelativeWithState: function (state, dueTime, action) {
                var runAt = this.add(this.clock, dueTime);
                return this.scheduleAbsoluteWithState(state, runAt, action);
            },
            /**
             * Schedules an action to be executed at dueTime.
             * 
             * @param dueTime Relative time after which to execute the action.
             * @param action Action to be executed.
             * @return The disposable object used to cancel the scheduled action (best effort).
             */          
            scheduleRelative: function (dueTime, action) {
                return this.scheduleRelativeWithState(action, dueTime, invokeAction);
            },
            /** Starts the virtual time scheduler. */
            start: function () {
                var next;
                if (!this.isEnabled) {
                    this.isEnabled = true;
                    do {
                        next = this.getNext();
                        if (next !== null) {
                            if (this.comparer(next.dueTime, this.clock) > 0) {
                                this.clock = next.dueTime;
                            }
                            next.invoke();
                        } else {
                            this.isEnabled = false;
                        }
                    } while (this.isEnabled);
                }
            },
            /** Stops the virtual time scheduler. */
            stop: function () {
                this.isEnabled = false;
            },
            /**
             * Advances the scheduler's clock to the specified time, running all work till that point.
             * @param time Absolute time to advance the scheduler's clock to.
             */
            advanceTo: function (time) {
                var next;
                var dueToClock = this.comparer(this.clock, time);
                if (this.comparer(this.clock, time) > 0) {
                    throw new Error(argumentOutOfRange);
                }
                if (dueToClock === 0) {
                    return;
                }
                if (!this.isEnabled) {
                    this.isEnabled = true;
                    do {
                        next = this.getNext();
                        if (next !== null && this.comparer(next.dueTime, time) <= 0) {
                            if (this.comparer(next.dueTime, this.clock) > 0) {
                                this.clock = next.dueTime;
                            }
                            next.invoke();
                        } else {
                            this.isEnabled = false;
                        }
                    } while (this.isEnabled)
                    this.clock = time;
                }
            },
            /**
             * Advances the scheduler's clock by the specified relative time, running all work scheduled for that timespan.
             * @param time Relative time to advance the scheduler's clock by.
             */
            advanceBy: function (time) {
                var dt = this.add(this.clock, time);
                var dueToClock = this.comparer(this.clock, dt);
                if (dueToClock > 0) {
                    throw new Error(argumentOutOfRange);
                }
                if (dueToClock === 0) {
                    return;
                }
                return this.advanceTo(dt);
            },
            /**
             * Advances the scheduler's clock by the specified relative time.
             * @param time Relative time to advance the scheduler's clock by.
             */
            sleep: function (time) {
                var dt = this.add(this.clock, time);

                if (this.comparer(this.clock, dt) >= 0) {
                    throw new Error(argumentOutOfRange);
                }

                this.clock = dt;
            },
            /**
             * Gets the next scheduled item to be executed.
             * @return The next scheduled item.
             */          
            getNext: function () {
                var next;
                while (this.queue.length > 0) {
                    next = this.queue.peek();
                    if (next.isCancelled()) {
                        this.queue.dequeue();
                    } else {
                        return next;
                    }
                }
                return null;
            },
            /**
             * Schedules an action to be executed at dueTime.
             * @param scheduler Scheduler to execute the action on.
             * @param dueTime Absolute time at which to execute the action.
             * @param action Action to be executed.
             * @return The disposable object used to cancel the scheduled action (best effort).
             */           
            scheduleAbsolute: function (dueTime, action) {
                return this.scheduleAbsoluteWithState(action, dueTime, invokeAction);
            },
            /**
             * Schedules an action to be executed at dueTime.
             * @param state State passed to the action to be executed.
             * @param dueTime Absolute time at which to execute the action.
             * @param action Action to be executed.
             * @return The disposable object used to cancel the scheduled action (best effort).
             */
            scheduleAbsoluteWithState: function (state, dueTime, action) {
                var self = this,
                    run = function (scheduler, state1) {
                        self.queue.remove(si);
                        return action(scheduler, state1);
                    },
                    si = new ScheduledItem(self, state, run, dueTime, self.comparer);
                self.queue.enqueue(si);
                return si.disposable;
            }
        });

        return VirtualTimeScheduler;
    }());

    /** Provides a virtual time scheduler that uses Date for absolute time and number for relative time. */
    root.HistoricalScheduler = (function () {
        inherits(HistoricalScheduler, root.VirtualTimeScheduler);

        /**
         * @constructor
         * Creates a new historical scheduler with the specified initial clock value.
         * 
         * @param initialClock Initial value for the clock.
         * @param comparer Comparer to determine causality of events based on absolute time.
         */
        function HistoricalScheduler(initialClock, comparer) {
            var clock = initialClock == null ? 0 : initialClock;
            var cmp = comparer || defaultSubComparer;
            HistoricalScheduler.super_.constructor.call(this, clock, cmp);
        }

        var HistoricalSchedulerProto = HistoricalScheduler.prototype;

        /**
         * Adds a relative time value to an absolute time value.
         * 
         * @param absolute Absolute virtual time value.
         * @param relative Relative virtual time value to add.
         * @return Resulting absolute virtual time sum value.
         */
        HistoricalSchedulerProto.add = function (absolute, relative) {
            return absolute + relative;
        };

        HistoricalSchedulerProto.toDateTimeOffset = function (absolute) {
            return new Date(absolute).getTime();
        };

        /**
         * Converts the TimeSpan value to a relative virtual time value.
         * 
         * @param timeSpan TimeSpan value to convert.
         * @return Corresponding relative virtual time value.
         */
        HistoricalSchedulerProto.toRelative = function (timeSpan) {
            return timeSpan;
        };

        return HistoricalScheduler;    
    }());
    // Timeout Scheduler
    var timeoutScheduler = Scheduler.timeout = (function () {

        // Optimize for speed
        var reqAnimFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame,
        clearAnimFrame = window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.msCancelAnimationFrame;

        var scheduleMethod, clearMethod;
        if (typeof window.process !== 'undefined' && typeof window.process.nextTick === 'function') {
            scheduleMethod = window.process.nextTick;
            clearMethod = noop;
        } else if (typeof window.setImmediate === 'function') {
            scheduleMethod = window.setImmediate;
            clearMethod = window.clearImmediate;
        } else if (typeof reqAnimFrame === 'function') {
            scheduleMethod = reqAnimFrame;
            clearMethod = clearAnimFrame;
        } else {
            scheduleMethod = function (action) { return window.setTimeout(action, 0); };
            clearMethod = window.clearTimeout;
        }

        function scheduleNow(state, action) {
            var scheduler = this;
            var disposable = new SingleAssignmentDisposable();
            var id = scheduleMethod(function () {
                disposable.setDisposable(action(scheduler, state));
            });
            return new CompositeDisposable(disposable, disposableCreate(function () {
                clearMethod(id);
            }));
        }

        function scheduleRelative(state, dueTime, action) {
            var scheduler = this;
            var dt = Scheduler.normalize(dueTime);
            if (dt === 0) {
                return scheduler.scheduleWithState(state, action);
            }
            var disposable = new SingleAssignmentDisposable();
            var id = window.setTimeout(function () {
                disposable.setDisposable(action(scheduler, state));
            }, dt);
            return new CompositeDisposable(disposable, disposableCreate(function () {
                window.clearTimeout(id);
            }));
        }

        function scheduleAbsolute(state, dueTime, action) {
            return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
        }

        return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);
    })();

    // CatchScheduler
    var CatchScheduler = (function () {

        function localNow() {
            return this._scheduler.now();
        }

        function scheduleNow(state, action) {
            return this._scheduler.scheduleWithState(state, this._wrap(action));
        }

        function scheduleRelative(state, dueTime, action) {
            return this._scheduler.scheduleWithRelativeAndState(state, dueTime, this._wrap(action));
        }

        function scheduleAbsolute(state, dueTime, action) {
            return this._scheduler.scheduleWithAbsoluteAndState(state, dueTime, this._wrap(action));
        }

        inherits(CatchScheduler, Scheduler);
        function CatchScheduler(scheduler, handler) {
            this._scheduler = scheduler;
            this._handler = handler;
            this._recursiveOriginal = null;
            this._recursiveWrapper = null;
            CatchScheduler.super_.constructor.call(this, localNow, scheduleNow, scheduleRelative, scheduleAbsolute);
        }

        CatchScheduler.prototype._clone = function (scheduler) {
            return new CatchScheduler(scheduler, this._handler);
        };

        CatchScheduler.prototype._wrap = function (action) {
            var parent = this;
            return function (self, state) {
                try {
                    return action(parent._getRecursiveWrapper(self), state);
                } catch (e) {
                    if (!parent._handler(e)) { throw e; }
                    return disposableEmpty;
                }
            };
        };

        CatchScheduler.prototype._getRecursiveWrapper = function (scheduler) {
            if (!this._recursiveOriginal !== scheduler) {
                this._recursiveOriginal = scheduler;
                var wrapper = this._clone(scheduler);
                wrapper._recursiveOriginal = scheduler;
                wrapper._recursiveWrapper = wrapper;
                this._recursiveWrapper = wrapper;
            }
            return this._recursiveWrapper;
        };

        CatchScheduler.prototype.schedulePeriodicWithState = function (state, period, action) {
            var self = this, failed = false, d = new SingleAssignmentDisposable();

            d.setDisposable(this._scheduler.schedulePeriodicWithState(state, period, function (state1) {
                if (failed) { return null; }
                try {
                    return action(state1);
                } catch (e) {
                    failed = true;
                    if (!self._handler(e)) { throw e; }
                    d.dispose();
                    return null;
                }
            }));

            return d;
        };

        return CatchScheduler;
    }());

    /**
     *  Represents a notification to an observer.
     */
    var Notification = root.Notification = (function () {
        function Notification(kind, hasValue) { 
            this.hasValue = hasValue == null ? false : hasValue;
            this.kind = kind;
        }

        var NotificationPrototype = Notification.prototype;

        NotificationPrototype.accept = function (observerOrOnNext, onError, onCompleted) {
            if (arguments.length > 1 || typeof observerOrOnNext === 'function') {
                return this._accept(observerOrOnNext, onError, onCompleted);
            } else {
                return this._acceptObservable(observerOrOnNext);
            }
        };

        NotificationPrototype.toObservable = function (scheduler) {
            var notification = this;
            scheduler = scheduler || immediateScheduler;
            return new AnonymousObservable(function (observer) {
                return scheduler.schedule(function () {
                    notification._acceptObservable(observer);
                    if (notification.kind === 'N') {
                        observer.onCompleted();
                    }
                });
            });
        };

        NotificationPrototype.equals = function (other) {
            var otherString = other == null ? '' : other.toString();
            return this.toString() === otherString;
        };

        return Notification;
    })();

    /**
     *  Creates an object that represents an OnNext notification to an observer.
     *  
     *  @param value The value contained in the notification.
     *  @return The OnNext notification containing the value.
     */
    var notificationCreateOnNext = Notification.createOnNext = (function () {

        function _accept (onNext) {
            return onNext(this.value);
        }

        function _acceptObservable(observer) {
            return observer.onNext(this.value);
        }

        function toString () {
            return 'OnNext(' + this.value + ')';
        }

        return function (value) {
            var notification = new Notification('N', true);
            notification.value = value;
            notification._accept = _accept.bind(notification);
            notification._acceptObservable = _acceptObservable.bind(notification);
            notification.toString = toString.bind(notification);
            return notification;
        };
    }());

    /**
     *  Creates an object that represents an OnError notification to an observer.
     *  
     *  @param error The exception contained in the notification.
     *  @return The OnError notification containing the exception.
     */
    var notificationCreateOnError = Notification.createOnError = (function () {

        function _accept (onNext, onError) {
            return onError(this.exception);
        }

        function _acceptObservable(observer) {
            return observer.onError(this.exception);
        }

        function toString () {
            return 'OnError(' + this.exception + ')';
        }

        return function (exception) {
            var notification = new Notification('E');
            notification.exception = exception;
            notification._accept = _accept.bind(notification);
            notification._acceptObservable = _acceptObservable.bind(notification);
            notification.toString = toString.bind(notification);
            return notification;
        };
    }());

    /**
     *  Creates an object that represents an OnCompleted notification to an observer.
     *  @return The OnCompleted notification.
     */
    var notificationCreateOnCompleted = Notification.createOnCompleted = (function () {

        function _accept (onNext, onError, onCompleted) {
            return onCompleted();
        }

        function _acceptObservable(observer) {
            return observer.onCompleted();
        }

        function toString () {
            return 'OnCompleted()';
        }

        return function () {
            var notification = new Notification('C');
            notification._accept = _accept.bind(notification);
            notification._acceptObservable = _acceptObservable.bind(notification);
            notification.toString = toString.bind(notification);
            return notification;
        };
    }());

    // Enumerator

    var Enumerator = root.Internals.Enumerator = function (moveNext, getCurrent, dispose) {
        this.moveNext = moveNext;
        this.getCurrent = getCurrent;
        this.dispose = dispose;
    };
    var enumeratorCreate = Enumerator.create = function (moveNext, getCurrent, dispose) {
        var done = false;
        dispose || (dispose = noop);
        return new Enumerator(function () {
            if (done) {
                return false;
            }
            var result = moveNext();
            if (!result) {
                done = true;
                dispose();
            }
            return result;
        }, function () { return getCurrent(); }, function () {
            if (!done) {
                dispose();
                done = true;
            }
        });
    };
    
    // Enumerable
    var Enumerable = root.Internals.Enumerable = (function () {
        function Enumerable(getEnumerator) {
            this.getEnumerator = getEnumerator;
        }

        Enumerable.prototype.concat = function () {
            var sources = this;
            return new AnonymousObservable(function (observer) {
                var e = sources.getEnumerator(), isDisposed = false, subscription = new SerialDisposable();
                var cancelable = immediateScheduler.scheduleRecursive(function (self) {
                    var current, ex, hasNext = false;
                    if (!isDisposed) {
                        try {
                            hasNext = e.moveNext();
                            if (hasNext) {
                                current = e.getCurrent();
                            } else {
                                e.dispose();
                            }
                        } catch (exception) {
                            ex = exception;
                            e.dispose();
                        }
                    } else {
                        return;
                    }
                    if (ex) {
                        observer.onError(ex);
                        return;
                    }
                    if (!hasNext) {
                        observer.onCompleted();
                        return;
                    }
                    var d = new SingleAssignmentDisposable();
                    subscription.setDisposable(d);
                    d.setDisposable(current.subscribe(
                        observer.onNext.bind(observer),
                        observer.onError.bind(observer),
                        function () { self(); })
                    );
                });
                return new CompositeDisposable(subscription, cancelable, disposableCreate(function () {
                    isDisposed = true;
                    e.dispose();
                }));
            });
        };

        Enumerable.prototype.catchException = function () {
            var sources = this;
            return new AnonymousObservable(function (observer) {
                var e = sources.getEnumerator(), isDisposed = false, lastException;
                var subscription = new SerialDisposable();
                var cancelable = immediateScheduler.scheduleRecursive(function (self) {
                    var current, ex, hasNext;
                    hasNext = false;
                    if (!isDisposed) {
                        try {
                            hasNext = e.moveNext();
                            if (hasNext) {
                                current = e.getCurrent();
                            }
                        } catch (exception) {
                            ex = exception;
                        }
                    } else {
                        return;
                    }
                    if (ex) {
                        observer.onError(ex);
                        return;
                    }
                    if (!hasNext) {
                        if (lastException) {
                            observer.onError(lastException);
                        } else {
                            observer.onCompleted();
                        }
                        return;
                    }
                    var d = new SingleAssignmentDisposable();
                    subscription.setDisposable(d);
                    d.setDisposable(current.subscribe(
                        observer.onNext.bind(observer),
                        function (exn) {
                            lastException = exn;
                            self();
                        },
                        observer.onCompleted.bind(observer)));
                });
                return new CompositeDisposable(subscription, cancelable, disposableCreate(function () {
                    isDisposed = true;
                }));
            });
        };

        return Enumerable;
    }());

    // Enumerable properties
    var enumerableRepeat = Enumerable.repeat = function (value, repeatCount) {
        if (repeatCount === undefined) {
            repeatCount = -1;
        }
        return new Enumerable(function () {
            var current, left = repeatCount;
            return enumeratorCreate(function () {
                if (left === 0) {
                    return false;
                }
                if (left > 0) {
                    left--;
                }
                current = value;
                return true;
            }, function () { return current; });
        });
    };
    var enumerableFor = Enumerable.forEach = function (source, selector) {
        selector || (selector = identity);
        return new Enumerable(function () {
            var current, index = -1;
            return enumeratorCreate(
                function () {
                    if (++index < source.length) {
                        current = selector(source[index], index);
                        return true;
                    }
                    return false;
                },
                function () { return current; }
            );
        });
    };

    /**
     * Supports push-style iteration over an observable sequence.
     */
    var Observer = root.Observer = function () { };

    /**
     *  Creates a notification callback from an observer.
     *  
     *  @param observer Observer object.
     *  @return The action that forwards its input notification to the underlying observer.
     */
    Observer.prototype.toNotifier = function () {
        var observer = this;
        return function (n) {
            return n.accept(observer);
        };
    };

    /**
     *  Hides the identity of an observer.
     *  
     *  @param observer An observer whose identity to hide.
     *  @return An observer that hides the identity of the specified observer. 
     */   
    Observer.prototype.asObserver = function () {
        return new AnonymousObserver(this.onNext.bind(this), this.onError.bind(this), this.onCompleted.bind(this));
    };

    /**
     *  Checks access to the observer for grammar violations. This includes checking for multiple OnError or OnCompleted calls, as well as reentrancy in any of the observer methods.
     *  If a violation is detected, an Error is thrown from the offending observer method call.
     *  
     *  @param observer The observer whose callback invocations should be checked for grammar violations.
     *  @return An observer that checks callbacks invocations against the observer grammar and, if the checks pass, forwards those to the specified observer.
     */    
    Observer.prototype.checked = function () { return new CheckedObserver(this); };

    /**
     *  Creates an observer from the specified OnNext, along with optional OnError, and OnCompleted actions.
     *  
     *  @param {Function} [onNext] Observer's OnNext action implementation.
     *  @param {Function} [onError] Observer's OnError action implementation.
     *  @param {Function} [onCompleted] Observer's OnCompleted action implementation.
     *  @return The observer object implemented using the given actions.
     */
    var observerCreate = Observer.create = function (onNext, onError, onCompleted) {
        onNext || (onNext = noop);
        onError || (onError = defaultError);
        onCompleted || (onCompleted = noop);
        return new AnonymousObserver(onNext, onError, onCompleted);
    };

    /**
     *  Creates an observer from a notification callback.
     *  
     *  @param handler Action that handles a notification.
     *  @return The observer object that invokes the specified handler using a notification corresponding to each message it receives.
     */
    Observer.fromNotifier = function (handler) {
        return new AnonymousObserver(function (x) {
            return handler(notificationCreateOnNext(x));
        }, function (exception) {
            return handler(notificationCreateOnError(exception));
        }, function () {
            return handler(notificationCreateOnCompleted());
        });
    };
    
    /**
     *  Abstract base class for implementations of the IObserver&lt;T&gt; interface.
     *  
     *   This base class enforces the grammar of observers where OnError and OnCompleted are terminal messages. 
     */
    var AbstractObserver = root.Internals.AbstractObserver = (function () {
        inherits(AbstractObserver, Observer);

        /**
         * @constructor
         * Creates a new observer in a non-stopped state.
         */
        function AbstractObserver() {
            this.isStopped = false;
        }

        /**
         *  Notifies the observer of a new element in the sequence.
         *  
         *  @param value Next element in the sequence. 
         */
        AbstractObserver.prototype.onNext = function (value) {
            if (!this.isStopped) {
                this.next(value);
            }
        };

        /**
         *  Notifies the observer that an exception has occurred.
         *  
         *  @param error The error that has occurred.     
         */    
        AbstractObserver.prototype.onError = function (error) {
            if (!this.isStopped) {
                this.isStopped = true;
                this.error(error);
            }
        };

        /**
         *  Notifies the observer of the end of the sequence.
         */    
        AbstractObserver.prototype.onCompleted = function () {
            if (!this.isStopped) {
                this.isStopped = true;
                this.completed();
            }
        };

        /**
         *  Disposes the observer, causing it to transition to the stopped state.
         */
        AbstractObserver.prototype.dispose = function () {
            this.isStopped = true;
        };

        AbstractObserver.prototype.fail = function () {
            if (!this.isStopped) {
                this.isStopped = true;
                this.error(true);
                return true;
            }

            return false;
        };

        return AbstractObserver;
    }());

    /**
     * Class to create an Observer instance from delegate-based implementations of the on* methods.
     */
    var AnonymousObserver = root.AnonymousObserver = (function () {
        inherits(AnonymousObserver, AbstractObserver);

        /**
         * @constructor
         *  Creates an observer from the specified OnNext, OnError, and OnCompleted actions.
         *  
         *  @param onNext Observer's OnNext action implementation.
         *  @param onError Observer's OnError action implementation.
         *  @param onCompleted Observer's OnCompleted action implementation.  
         */      
        function AnonymousObserver(onNext, onError, onCompleted) {
            AnonymousObserver.super_.constructor.call(this);
            this._onNext = onNext;
            this._onError = onError;
            this._onCompleted = onCompleted;
        }

        /**
         *  Calls the onNext action.
         *  
         *  @param value Next element in the sequence.   
         */     
        AnonymousObserver.prototype.next = function (value) {
            this._onNext(value);
        };

        /**
         *  Calls the onError action.
         *  
         *  @param error The error that has occurred.   
         */     
        AnonymousObserver.prototype.error = function (exception) {
            this._onError(exception);
        };

        /**
         *  Calls the onCompleted action.
         */        
        AnonymousObserver.prototype.completed = function () {
            this._onCompleted();
        };

        return AnonymousObserver;
    }());

    var CheckedObserver = (function () {
        inherits(CheckedObserver, Observer);
        function CheckedObserver(observer) {
            this._observer = observer;
            this._state = 0; // 0 - idle, 1 - busy, 2 - done
        }

        CheckedObserver.prototype.onNext = function (value) {
            this.checkAccess();
            try {
                this._observer.onNext(value);
            } catch (e) { 
                throw e;                
            } finally {
                this._state = 0;
            }
        };

        CheckedObserver.prototype.onError = function (err) {
            this.checkAccess();
            try {
                this._observer.onError(err);
            } catch (e) { 
                throw e;                
            } finally {
                this._state = 2;
            }
        };

        CheckedObserver.prototype.onCompleted = function () {
            this.checkAccess();
            try {
                this._observer.onCompleted();
            } catch (e) { 
                throw e;                
            } finally {
                this._state = 2;
            }
        };

        CheckedObserver.prototype.checkAccess = function () {
            if (this._state === 1) { throw new Error('Re-entrancy detected'); }
            if (this._state === 2) { throw new Error('Observer completed'); }
            if (this._state === 0) { this._state = 1; }
        };

        return CheckedObserver;
    }());

    var ScheduledObserver = root.Internals.ScheduledObserver = (function () {
        inherits(ScheduledObserver, AbstractObserver);
        function ScheduledObserver(scheduler, observer) {
            ScheduledObserver.super_.constructor.call(this);
            this.scheduler = scheduler;
            this.observer = observer;
            this.isAcquired = false;
            this.hasFaulted = false;
            this.queue = [];
            this.disposable = new SerialDisposable();
        }

        ScheduledObserver.prototype.next = function (value) {
            var self = this;
            this.queue.push(function () {
                self.observer.onNext(value);
            });
        };
        ScheduledObserver.prototype.error = function (exception) {
            var self = this;
            this.queue.push(function () {
                self.observer.onError(exception);
            });
        };
        ScheduledObserver.prototype.completed = function () {
            var self = this;
            this.queue.push(function () {
                self.observer.onCompleted();
            });
        };
        ScheduledObserver.prototype.ensureActive = function () {
            var isOwner = false, parent = this;
            if (!this.hasFaulted && this.queue.length > 0) {
                isOwner = !this.isAcquired;
                this.isAcquired = true;
            }
            if (isOwner) {
                this.disposable.setDisposable(this.scheduler.scheduleRecursive(function (self) {
                    var work;
                    if (parent.queue.length > 0) {
                        work = parent.queue.shift();
                    } else {
                        parent.isAcquired = false;
                        return;
                    }
                    try {
                        work();
                    } catch (ex) {
                        parent.queue = [];
                        parent.hasFaulted = true;
                        throw ex;
                    }
                    self();
                }));
            }
        };
        ScheduledObserver.prototype.dispose = function () {
            ScheduledObserver.super_.dispose.call(this);
            this.disposable.dispose();
        };

        return ScheduledObserver;
    }());

    var ObserveOnObserver = (function () {
        inherits(ObserveOnObserver, ScheduledObserver);
        function ObserveOnObserver() {
            ObserveOnObserver.super_.constructor.apply(this, arguments);
        }
        ObserveOnObserver.prototype.next = function (value) {
            ObserveOnObserver.super_.next.call(this, value);
            this.ensureActive();
        };
        ObserveOnObserver.prototype.error = function (e) {
            ObserveOnObserver.super_.error.call(this, e);
            this.ensureActive();
        };
        ObserveOnObserver.prototype.completed = function () {
            ObserveOnObserver.super_.completed.call(this);
            this.ensureActive();
        };

        return ObserveOnObserver;
    })();

    var observableProto;

    /**
     * Represents a push-style collection.
     */
    var Observable = root.Observable = (function () {

        /**
         * @constructor
         */
        function Observable(subscribe) {
            this._subscribe = subscribe;
        }

        observableProto = Observable.prototype;

        observableProto.finalValue = function () {
            var source = this;
            return new AnonymousObservable(function (observer) {
                var hasValue = false, value;
                return source.subscribe(function (x) {
                    hasValue = true;
                    value = x;
                }, observer.onError.bind(observer), function () {
                    if (!hasValue) {
                        observer.onError(new Error(sequenceContainsNoElements));
                    } else {
                        observer.onNext(value);
                        observer.onCompleted();
                    }
                });
            });
        };

        /**
         *  Subscribes an observer to the observable sequence.
         *  
         *  1 - source.subscribe();
         *  2 - source.subscribe(observer);
         *  3 - source.subscribe(function (x) { console.log(x); });
         *  4 - source.subscribe(function (x) { console.log(x); }, function (err) { console.log(err); });
         *  5 - source.subscribe(function (x) { console.log(x); }, function (err) { console.log(err); }, function () { console.log('done'); });
         *  
         *  @param {Mixed} [observerOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
         *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
         *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
         *  @return The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler. 
         */
        observableProto.subscribe = observableProto.forEach = function (observerOrOnNext, onError, onCompleted) {
            var subscriber;
            if (arguments.length === 0 || arguments.length > 1 || typeof observerOrOnNext === 'function') {
                subscriber = observerCreate(observerOrOnNext, onError, onCompleted);
            } else {
                subscriber = observerOrOnNext;
            }
            return this._subscribe(subscriber);
        };

        /**
         *  Creates a list from an observable sequence.
         *  
         *  @return An observable sequence containing a single element with a list containing all the elements of the source sequence.  
         */
        observableProto.toArray = function () {
            function accumulator(list, i) {
                list.push(i);
                return list.slice(0);
            }
            return this.scan([], accumulator).startWith([]).finalValue();
        }

        return Observable;
    })();

    /**
     * Invokes the specified function asynchronously on the specified scheduler, surfacing the result through an observable sequence.
     * 
     * 1 - res = Rx.Observable.start(function () { console.log('hello'); });
     * 2 - res = Rx.Observable.start(function () { console.log('hello'); }, Rx.Scheduler.timeout);
     * 2 - res = Rx.Observable.start(function () { this.log('hello'); }, Rx.Scheduler.timeout, console);
     * 
     * @param func Function to run asynchronously.
     * @param [scheduler]  Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
     * @param [context]  The context for the func parameter to be executed.  If not specified, defaults to undefined.
    * @return An observable sequence exposing the function's result value, or an exception.
     * 
     * Remarks
     * * The function is called immediately, not during the subscription of the resulting sequence.
     * * Multiple subscriptions to the resulting sequence can observe the function's result.  
     */
    Observable.start = function (func, scheduler, context) {
        return observableToAsync(func, scheduler)();
    };

    /**
     * Converts the function into an asynchronous function. Each invocation of the resulting asynchronous function causes an invocation of the original synchronous function on the specified scheduler.
     * 
     * 1 - res = Rx.Observable.toAsync(function (x, y) { return x + y; })(4, 3);
     * 2 - res = Rx.Observable.toAsync(function (x, y) { return x + y; }, Rx.Scheduler.timeout)(4, 3);
     * 2 - res = Rx.Observable.toAsync(function (x) { this.log(x); }, Rx.Scheduler.timeout, console)('hello');
     * 
     * @param function Function to convert to an asynchronous function.
     * @param [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
     * @param [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
     * @return Asynchronous function.
     */
    var observableToAsync = Observable.toAsync = function (func, scheduler, context) {
        scheduler || (scheduler = timeoutScheduler);
        return function () {
            var args = slice.call(arguments, 0), subject = new AsyncSubject();
            scheduler.schedule(function () {
                var result;
                try {
                    result = func.apply(context, args);
                } catch (e) {
                    subject.onError(e);
                    return;
                }
                subject.onNext(result);
                subject.onCompleted();
            });
            return subject.asObservable();
        };
    };    
     /**
     *  Wraps the source sequence in order to run its observer callbacks on the specified scheduler.
     *  
     *  @param scheduler Scheduler to notify observers on.</param>
     *  @return The source sequence whose observations happen on the specified scheduler.</returns>
     *  
     *  This only invokes observer callbacks on a scheduler. In case the subscription and/or unsubscription actions have side-effects
     *  that require to be run on a scheduler, use subscribeOn.
     *          
     */
    observableProto.observeOn = function (scheduler) {
        var source = this;
        return new AnonymousObservable(function (observer) {
            return source.subscribe(new ObserveOnObserver(scheduler, observer));
        });
    };

     /**
     *  Wraps the source sequence in order to run its subscription and unsubscription logic on the specified scheduler. This operation is not commonly used;
     *  see the remarks section for more information on the distinction between subscribeOn and observeOn.
     *  
     *  @param scheduler Scheduler to perform subscription and unsubscription actions on.</param>
     *  @return The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler.</returns>
     *  
     *  This only performs the side-effects of subscription and unsubscription on the specified scheduler. In order to invoke observer
     *  callbacks on a scheduler, use observeOn.
     *    
     */
    observableProto.subscribeOn = function (scheduler) {
        var source = this;
        return new AnonymousObservable(function (observer) {
            var m = new SingleAssignmentDisposable(), d = new SerialDisposable();
            d.setDisposable(m);
            m.setDisposable(scheduler.schedule(function () {
                d.setDisposable(new ScheduledDisposable(scheduler, source.subscribe(observer)));
            }));
            return d;
        });
    };
    
    /**
     *  Creates an observable sequence from a specified subscribe method implementation.
     *  
     *  1 - res = Rx.Observable.create(function (observer) { return function () { } );
     *  
     *  @param subscribe Implementation of the resulting observable sequence's subscribe method, returning a function that will be wrapped in a Disposable.
     *  @return The observable sequence with the specified implementation for the Subscribe method.
     */
    Observable.create = function (subscribe) {
        return new AnonymousObservable(function (o) {
            return disposableCreate(subscribe(o));
        });
    };

    /**
     *  Creates an observable sequence from a specified subscribe method implementation.
     *  
     *  1 - res = Rx.Observable.create(function (observer) { return Rx.Disposable.empty; } );        
     *  
     *  @param subscribe Implementation of the resulting observable sequence's subscribe method.
     *  @return The observable sequence with the specified implementation for the Subscribe method.
     */
    Observable.createWithDisposable = function (subscribe) {
        return new AnonymousObservable(subscribe);
    };

    /**
     *  Returns an observable sequence that invokes the specified factory function whenever a new observer subscribes.
     *  
     *  1 - res = Rx.Observable.defer(function () { return Rx.Observable.fromArray([1,2,3]); });    
     *  
     *  @param observableFactory Observable factory function to invoke for each observer that subscribes to the resulting sequence.
     *  @return An observable sequence whose observers trigger an invocation of the given observable factory function.
     */
    var observableDefer = Observable.defer = function (observableFactory) {
        return new AnonymousObservable(function (observer) {
            var result;
            try {
                result = observableFactory();
            } catch (e) {
                return observableThrow(e).subscribe(observer);
            }
            return result.subscribe(observer);
        });
    };

    /**
     *  Returns an empty observable sequence, using the specified scheduler to send out the single OnCompleted message.
     *  
     *  1 - res = Rx.Observable.empty();  
     *  2 - res = Rx.Observable.empty(Rx.Scheduler.timeout);  
     *  
     *  @param scheduler Scheduler to send the termination call on.
     *  @return An observable sequence with no elements.
     */
    var observableEmpty = Observable.empty = function (scheduler) {
        scheduler || (scheduler = immediateScheduler);
        return new AnonymousObservable(function (observer) {
            return scheduler.schedule(function () {
                observer.onCompleted();
            });
        });
    };

    /**
     *  Converts an array to an observable sequence, using an optional scheduler to enumerate the array.
     *  
     *  1 - res = Rx.Observable.fromArray([1,2,3]);
     *  2 - res = Rx.Observable.fromArray([1,2,3], Rx.Scheduler.timeout);
     *  
     *  @param scheduler [Optional] Scheduler to run the enumeration of the input sequence on.
     *  @return The observable sequence whose elements are pulled from the given enumerable sequence.
     */
    var observableFromArray = Observable.fromArray = function (array, scheduler) {
        scheduler || (scheduler = currentThreadScheduler);
        return new AnonymousObservable(function (observer) {
            var count = 0;
            return scheduler.scheduleRecursive(function (self) {
                if (count < array.length) {
                    observer.onNext(array[count++]);
                    self();
                } else {
                    observer.onCompleted();
                }
            });
        });
    };

    /**
     *  Generates an observable sequence by running a state-driven loop producing the sequence's elements, using the specified scheduler to send out observer messages.
     *  
     *  1 - res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; });
     *  2 - res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; }, Rx.Scheduler.timeout);
     *  
     *  @param initialState Initial state.
     *  @param condition Condition to terminate generation (upon returning false).
     *  @param iterate Iteration step function.
     *  @param resultSelector Selector function for results produced in the sequence.
     *  @param scheduler [Optional] Scheduler on which to run the generator loop. If not provided, defaults to Scheduler.currentThread.
     *  @return The generated sequence.
     */
    Observable.generate = function (initialState, condition, iterate, resultSelector, scheduler) {
        scheduler || (scheduler = currentThreadScheduler);
        return new AnonymousObservable(function (observer) {
            var first = true, state = initialState;
            return scheduler.scheduleRecursive(function (self) {
                var hasResult, result;
                try {
                    if (first) {
                        first = false;
                    } else {
                        state = iterate(state);
                    }
                    hasResult = condition(state);
                    if (hasResult) {
                        result = resultSelector(state);
                    }
                } catch (exception) {
                    observer.onError(exception);
                    return;
                }
                if (hasResult) {
                    observer.onNext(result);
                    self();
                } else {
                    observer.onCompleted();
                }
            });
        });
    };

    /**
     *  Returns a non-terminating observable sequence, which can be used to denote an infinite duration (e.g. when using reactive joins).
     *  
     *  @return An observable sequence whose observers will never get called.
     */
    var observableNever = Observable.never = function () {
        return new AnonymousObservable(function () {
            return disposableEmpty;
        });
    };

    /**
     *  Generates an observable sequence of integral numbers within a specified range, using the specified scheduler to send out observer messages.
     *  
     *  1 - res = Rx.Observable.range(0, 10);
     *  2 - res = Rx.Observable.range(0, 10, Rx.Scheduler.timeout);
     *  
     *  @param start The value of the first integer in the sequence.
     *  @param count The number of sequential integers to generate.
     *  @param scheduler [Optional] Scheduler to run the generator loop on. If not specified, defaults to Scheduler.currentThread.
     *  @return An observable sequence that contains a range of sequential integral numbers.
     */
    Observable.range = function (start, count, scheduler) {
        scheduler || (scheduler = currentThreadScheduler);
        return new AnonymousObservable(function (observer) {
            return scheduler.scheduleRecursiveWithState(0, function (i, self) {
                if (i < count) {
                    observer.onNext(start + i);
                    self(i + 1);
                } else {
                    observer.onCompleted();
                }
            });
        });
    };

    /**
     *  Generates an observable sequence that repeats the given element the specified number of times, using the specified scheduler to send out observer messages.
     *  
     *  1 - res = Rx.Observable.repeat(42);
     *  2 - res = Rx.Observable.repeat(42, 4);
     *  3 - res = Rx.Observable.repeat(42, 4, Rx.Scheduler.timeout);
     *  4 - res = Rx.Observable.repeat(42, null, Rx.Scheduler.timeout);
     *  
     *  @param value Element to repeat.
     *  @param repeatCount [Optiona] Number of times to repeat the element. If not specified, repeats indefinitely.
     *  @param scheduler Scheduler to run the producer loop on. If not specified, defaults to Scheduler.immediate.
     *  @return An observable sequence that repeats the given element the specified number of times.
     */
    Observable.repeat = function (value, repeatCount, scheduler) {
        scheduler || (scheduler = currentThreadScheduler);
        if (repeatCount == undefined) {
            repeatCount = -1;
        }
        return observableReturn(value, scheduler).repeat(repeatCount);
    };

    /**
     *  Returns an observable sequence that contains a single element, using the specified scheduler to send out observer messages.
     *  
     *  1 - res = Rx.Observable.returnValue(42);
     *  2 - res = Rx.Observable.returnValue(42, Rx.Scheduler.timeout);
     *  
     *  @param value Single element in the resulting observable sequence.
     *  @param scheduler Scheduler to send the single element on. If not specified, defaults to Scheduler.immediate.
     *  @return An observable sequence containing the single specified element.
     */
    var observableReturn = Observable.returnValue = function (value, scheduler) {
        scheduler || (scheduler = immediateScheduler);
        return new AnonymousObservable(function (observer) {
            return scheduler.schedule(function () {
                observer.onNext(value);
                observer.onCompleted();
            });
        });
    };

    /**
     *  Returns an observable sequence that terminates with an exception, using the specified scheduler to send out the single OnError message.
     *  
     *  1 - res = Rx.Observable.throwException(new Error('Error'));
     *  2 - res = Rx.Observable.throwException(new Error('Error'), Rx.Scheduler.timeout);
     *  
     *  @param exception An object used for the sequence's termination.
     *  @param scheduler Scheduler to send the exceptional termination call on. If not specified, defaults to Scheduler.immediate.
     *  @return The observable sequence that terminates exceptionally with the specified exception object.
     */
    var observableThrow = Observable.throwException = function (exception, scheduler) {
        scheduler || (scheduler = immediateScheduler);
        return new AnonymousObservable(function (observer) {
            return scheduler.schedule(function () {
                observer.onError(exception);
            });
        });
    };

    /**
     *  Constructs an observable sequence that depends on a resource object, whose lifetime is tied to the resulting observable sequence's lifetime.
     *  
     *  1 - res = Rx.Observable.using(function () { return new AsyncSubject(); }, function (s) { return s; });
     *  
     *  @param resourceFactory Factory function to obtain a resource object.
     *  @param observableFactory Factory function to obtain an observable sequence that depends on the obtained resource.
     *  @return An observable sequence whose lifetime controls the lifetime of the dependent resource object.
     */
    Observable.using = function (resourceFactory, observableFactory) {
        return new AnonymousObservable(function (observer) {
            var disposable = disposableEmpty, resource, source;
            try {
                resource = resourceFactory();
                if (resource) {
                    disposable = resource;
                }
                source = observableFactory(resource);
            } catch (exception) {
                return new CompositeDisposable(observableThrow(exception).subscribe(observer), disposable);
            }
            return new CompositeDisposable(source.subscribe(observer), disposable);
        });
    };                        
    
    /**
     * Propagates the observable sequence that reacts first.
     * 
     * @param rightSource Second observable sequence.
     * @return An observable sequence that surfaces either of the given sequences, whichever reacted first.
     */  
    observableProto.amb = function (rightSource) {
        var leftSource = this;
        return new AnonymousObservable(function (observer) {

            var choice,
                leftChoice = 'L', rightChoice = 'R',
                leftSubscription = new SingleAssignmentDisposable(),
                rightSubscription = new SingleAssignmentDisposable();

            function choiceL() {
                if (!choice) {
                    choice = leftChoice;
                    rightSubscription.dispose();
                }
            }

            function choiceR() {
                if (!choice) {
                    choice = rightChoice;
                    leftSubscription.dispose();
                }
            }

            leftSubscription.setDisposable(leftSource.subscribe(function (left) {
                choiceL();
                if (choice === leftChoice) {
                    observer.onNext(left);
                }
            }, function (err) {
                choiceL();
                if (choice === leftChoice) {
                    observer.onError(err);
                }
            }, function () {
                choiceL();
                if (choice === leftChoice) {
                    observer.onCompleted();
                }
            }));

            rightSubscription.setDisposable(rightSource.subscribe(function (right) {
                choiceR();
                if (choice === rightChoice) {
                    observer.onNext(right);
                }
            }, function (err) {
                choiceR();
                if (choice === rightChoice) {
                    observer.onError(err);
                }
            }, function () {
                choiceR();
                if (choice === rightChoice) {
                    observer.onCompleted();
                }
            }));

            return new CompositeDisposable(leftSubscription, rightSubscription);
        });
    };

    /**
     * Propagates the observable sequence that reacts first.
     * 
     * E.g. winner = Rx.Observable.amb(xs, ys, zs);
     * 
     * @return An observable sequence that surfaces any of the given sequences, whichever reacted first.
     */  
    Observable.amb = function () {
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

    /**
     * Continues an observable sequence that is terminated by an exception with the next observable sequence.
     * 
     * 1 - xs.catchException(ys)
     * 2 - xs.catchException(function (ex) { return ys(ex); })
     * 
     * @param {Mixed} handlerOrSecond Exception handler function that returns an observable sequence given the error that occurred in the first sequence, or a second observable sequence used to produce results when an error occurred in the first sequence.
     * @return An observable sequence containing the first sequence's elements, followed by the elements of the handler sequence in case an exception occurred.
     */      
    observableProto.catchException = function (handlerOrSecond) {
        if (typeof handlerOrSecond === 'function') {
            return observableCatchHandler(this, handlerOrSecond);
        }
        return observableCatch([this, handlerOrSecond]);
    };

    /**
     * Continues an observable sequence that is terminated by an exception with the next observable sequence.
     * 
     * 1 - res = Rx.Observable.catchException(xs, ys, zs);
     * 2 - res = Rx.Observable.catchException([xs, ys, zs]);
     * 
     * @return An observable sequence containing elements from consecutive source sequences until a source sequence terminates successfully.
     */
    var observableCatch = Observable.catchException = function () {
        var items = argsOrArray(arguments, 0);
        return enumerableFor(items).catchException();
    };

    /**
     * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences produces an element.
     * This can be in the form of an argument list of observables or an array.
     * 
     * 1 - obs = observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
     * 2 - obs = observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
     * 
     * @return An observable sequence containing the result of combining elements of the sources using the specified result selector function. 
     */
    observableProto.combineLatest = function () {
        var args = slice.call(arguments);
        if (Array.isArray(args[0])) {
            args[0].unshift(this);
        } else {
            args.unshift(this);
        }
        return combineLatest.apply(this, args);
    };

    /**
     * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences produces an element.
     * 
     * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
     * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });     
     * 
     * @return An observable sequence containing the result of combining elements of the sources using the specified result selector function.
     */
    var combineLatest = Observable.combineLatest = function () {
        var args = slice.call(arguments), resultSelector = args.pop();
        
        if (Array.isArray(args[0])) {
            args = args[0];
        }

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
                        res = resultSelector.apply(null, values);
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

    /**
     * Concatenates all the observable sequences.  This takes in either an array or variable arguments to concatenate.
     * 
     * 1 - concatenated = xs.concat(ys, zs);
     * 2 - concatenated = xs.concat([ys, zs]);
     * 
     * @return An observable sequence that contains the elements of each given sequence, in sequential order. 
     */ 
    observableProto.concat = function () {
        var items = slice.call(arguments, 0);
        items.unshift(this);
        return observableConcat.apply(this, items);
    };

    /**
     * Concatenates all the observable sequences.
     * 
     * 1 - res = Rx.Observable.concat(xs, ys, zs);
     * 2 - res = Rx.Observable.concat([xs, ys, zs]);
     * 
     * @return An observable sequence that contains the elements of each given sequence, in sequential order. 
     */
    var observableConcat = Observable.concat = function () {
        var sources = argsOrArray(arguments, 0);
        return enumerableFor(sources).concat();
    };    

    /**
     * Concatenates an observable sequence of observable sequences.
     * 
     * @return An observable sequence that contains the elements of each observed inner sequence, in sequential order. 
     */ 
    observableProto.concatObservable = observableProto.concatAll =function () {
        return this.merge(1);
    };

    /**
     * Merges an observable sequence of observable sequences into an observable sequence, limiting the number of concurrent subscriptions to inner sequences.
     * Or merges two observable sequences into a single observable sequence.
     * 
     * 1 - merged = sources.merge(1);
     * 2 - merged = source.merge(otherSource);  
     * 
     * @param [maxConcurrentOrOther] Maximum number of inner observable sequences being subscribed to concurrently or the second observable sequence.
     * @return The observable sequence that merges the elements of the inner sequences. 
     */ 
    observableProto.merge = function (maxConcurrentOrOther) {
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

    /**
     * Merges all the observable sequences into a single observable sequence.  
     * The scheduler is optional and if not specified, the immediate scheduler is used.
     * 
     * 1 - merged = Rx.Observable.merge(xs, ys, zs);
     * 2 - merged = Rx.Observable.merge([xs, ys, zs]);
     * 3 - merged = Rx.Observable.merge(scheduler, xs, ys, zs);
     * 4 - merged = Rx.Observable.merge(scheduler, [xs, ys, zs]);    
     * 
     * 
     * @return The observable sequence that merges the elements of the observable sequences. 
     */  
    var observableMerge = Observable.merge = function () {
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

    /**
     * Merges an observable sequence of observable sequences into an observable sequence.
     * 
     * @return The observable sequence that merges the elements of the inner sequences.   
     */  
    observableProto.mergeObservable = observableProto.mergeAll =function () {
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

    /**
     * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
     * 
     * @param second Second observable sequence used to produce results after the first sequence terminates.
     * @return An observable sequence that concatenates the first and second sequence, even if the first sequence terminates exceptionally.
     */
    observableProto.onErrorResumeNext = function (second) {
        if (!second) {
            throw new Error('Second observable is required');
        }
        return onErrorResumeNext([this, second]);
    };

    /**
     * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
     * 
     * 1 - res = Rx.Observable.onErrorResumeNext(xs, ys, zs);
     * 1 - res = Rx.Observable.onErrorResumeNext([xs, ys, zs]);
     * 
     * @return An observable sequence that concatenates the source sequences, even if a sequence terminates exceptionally.   
     */
    var onErrorResumeNext = Observable.onErrorResumeNext = function () {
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

    /**
     * Returns the values from the source observable sequence only after the other observable sequence produces a value.
     * 
     * @param other The observable sequence that triggers propagation of elements of the source sequence.
     * @return An observable sequence containing the elements of the source sequence starting from the point the other sequence triggered propagation.    
     */
    observableProto.skipUntil = function (other) {
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

    /**
     * Transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.
     * 
     * @return The observable sequence that at any point in time produces the elements of the most recent inner observable sequence that has been received.  
     */
    observableProto.switchLatest = function () {
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

    /**
     * Returns the values from the source observable sequence until the other observable sequence produces a value.
     * 
     * @param other Observable sequence that terminates propagation of elements of the source sequence.
     * @return An observable sequence containing the elements of the source sequence up to the point the other sequence interrupted further propagation.   
     */
    observableProto.takeUntil = function (other) {
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

    /**
     * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
     * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the sources.
     * 1 - res = obs1.zip(obs2, fn);
     * 1 - res = x1.zip([1,2,3], fn);  
     * 
     * @return An observable sequence containing the result of combining elements of the sources using the specified result selector function. 
     */   
    observableProto.zip = function () {
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
    /**
     *  Hides the identity of an observable sequence.
     *  
     *  @return An observable sequence that hides the identity of the source sequence.    
     */
    observableProto.asObservable = function () {
        var source = this;
        return new AnonymousObservable(function (observer) {
            return source.subscribe(observer);
        });
    };

    /**
     *  Projects each element of an observable sequence into zero or more buffers which are produced based on element count information.
     *  
     *  1 - xs.bufferWithCount(10);
     *  2 - xs.bufferWithCount(10, 1);
     *  
     *  @param count Length of each buffer.
     *  @param [skip] Number of elements to skip between creation of consecutive buffers. If not provided, defaults to the count.
     *  @return An observable sequence of buffers.    
     */
    observableProto.bufferWithCount = function (count, skip) {
        if (skip === undefined) {
            skip = count;
        }
        return this.windowWithCount(count, skip).selectMany(function (x) {
            return x.toArray();
        }).where(function (x) {
            return x.length > 0;
        });
    };

    /**
     *  Dematerializes the explicit notification values of an observable sequence as implicit notifications.
     *  
     *  @return An observable sequence exhibiting the behavior corresponding to the source sequence's notification values.
     */ 
    observableProto.dematerialize = function () {
        var source = this;
        return new AnonymousObservable(function (observer) {
            return source.subscribe(function (x) {
                return x.accept(observer);
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    /**
     *  Returns an observable sequence that contains only distinct contiguous elements according to the keySelector and the comparer.
     *  
     *  1 - var obs = observable.distinctUntilChanged();
     *  2 - var obs = observable.distinctUntilChanged(function (x) { return x.id; });
     *  3 - var obs = observable.distinctUntilChanged(function (x) { return x.id; }, function (x, y) { return x === y; });
     *  
     *  @param {Function} [keySelector] A function to compute the comparison key for each element. If not provided, it projects the value.
     *  @param {Function} [comparer] Equality comparer for computed key values. If not provided, defaults to an equality comparer function.
     *  @return An observable sequence only containing the distinct contiguous elements, based on a computed key value, from the source sequence.   
     */
    observableProto.distinctUntilChanged = function (keySelector, comparer) {
        var source = this;
        keySelector || (keySelector = identity);
        comparer || (comparer = defaultComparer);
        return new AnonymousObservable(function (observer) {
            var hasCurrentKey = false, currentKey;
            return source.subscribe(function (value) {
                var comparerEquals = false, key;
                try {
                    key = keySelector(value);
                } catch (exception) {
                    observer.onError(exception);
                    return;
                }
                if (hasCurrentKey) {
                    try {
                        comparerEquals = comparer(currentKey, key);
                    } catch (exception) {
                        observer.onError(exception);
                        return;
                    }
                }
                if (!hasCurrentKey || !comparerEquals) {
                    hasCurrentKey = true;
                    currentKey = key;
                    observer.onNext(value);
                }
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    /**
     *  Invokes an action for each element in the observable sequence and invokes an action upon graceful or exceptional termination of the observable sequence.
     *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
     *  
     *  1 - observable.doAction(observer);
     *  2 - observable.doAction(onNext);
     *  3 - observable.doAction(onNext, onError);
     *  4 - observable.doAction(onNext, onError, onCompleted);
     *  
     *  @param observerOrOnNext Action to invoke for each element in the observable sequence or an observer.
     *  @param {Function} [onError]  Action to invoke upon exceptional termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
     *  @param {Function} [onCompleted]  Action to invoke upon graceful termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
     *  @return The source sequence with the side-effecting behavior applied.   
     */
    observableProto.doAction = function (observerOrOnNext, onError, onCompleted) {
        var source = this, onNextFunc;
        if (typeof observerOrOnNext === 'function') {
            onNextFunc = observerOrOnNext;
        } else {
            onNextFunc = observerOrOnNext.onNext.bind(observerOrOnNext);
            onError = observerOrOnNext.onError.bind(observerOrOnNext);
            onCompleted = observerOrOnNext.onCompleted.bind(observerOrOnNext);
        }
        return new AnonymousObservable(function (observer) {
            return source.subscribe(function (x) {
                try {
                    onNextFunc(x);
                } catch (e) {
                    observer.onError(e);
                }
                observer.onNext(x);
            }, function (exception) {
                if (!onError) {
                    observer.onError(exception);
                } else {
                    try {
                        onError(exception);
                    } catch (e) {
                        observer.onError(e);
                    }
                    observer.onError(exception);
                }
            }, function () {
                if (!onCompleted) {
                    observer.onCompleted();
                } else {
                    try {
                        onCompleted();
                    } catch (e) {
                        observer.onError(e);
                    }
                    observer.onCompleted();
                }
            });
        });
    };

    /**
     *  Invokes a specified action after the source observable sequence terminates gracefully or exceptionally.
     *  
     *  1 - obs = observable.finallyAction(function () { console.log('sequence ended'; });
     *  
     *  @param finallyAction Action to invoke after the source observable sequence terminates.
     *  @return Source sequence with the action-invoking termination behavior applied. 
     */  
    observableProto.finallyAction = function (action) {
        var source = this;
        return new AnonymousObservable(function (observer) {
            var subscription = source.subscribe(observer);
            return disposableCreate(function () {
                try {
                    subscription.dispose();
                } catch (e) { 
                    throw e;                    
                } finally {
                    action();
                }
            });
        });
    };

    /**
     *  Ignores all elements in an observable sequence leaving only the termination messages.
     *  
     *  @return An empty observable sequence that signals termination, successful or exceptional, of the source sequence.    
     */
    observableProto.ignoreElements = function () {
        var source = this;
        return new AnonymousObservable(function (observer) {
            return source.subscribe(noop, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    /**
     *  Materializes the implicit notifications of an observable sequence as explicit notification values.
     *  
     *  @return An observable sequence containing the materialized notification values from the source sequence.
     */    
    observableProto.materialize = function () {
        var source = this;
        return new AnonymousObservable(function (observer) {
            return source.subscribe(function (value) {
                observer.onNext(notificationCreateOnNext(value));
            }, function (exception) {
                observer.onNext(notificationCreateOnError(exception));
                observer.onCompleted();
            }, function () {
                observer.onNext(notificationCreateOnCompleted());
                observer.onCompleted();
            });
        });
    };

    /**
     *  Repeats the observable sequence a specified number of times. If the repeat count is not specified, the sequence repeats indefinitely.
     *  
     *  1 - repeated = source.repeat();
     *  2 - repeated = source.repeat(42);
     *  
     *  @param {Number} [repeatCount]  Number of times to repeat the sequence. If not provided, repeats the sequence indefinitely.
     *  @return The observable sequence producing the elements of the given sequence repeatedly.   
     */
    observableProto.repeat = function (repeatCount) {
        return enumerableRepeat(this, repeatCount).concat();
    };

    /**
     *  Repeats the source observable sequence the specified number of times or until it successfully terminates. If the retry count is not specified, it retries indefinitely.
     *  
     *  1 - retried = retry.repeat();
     *  2 - retried = retry.repeat(42);
     *  
     *  @param {Number} [retryCount]  Number of times to retry the sequence. If not provided, retry the sequence indefinitely.
     *  @return An observable sequence producing the elements of the given sequence repeatedly until it terminates successfully. 
     */
    observableProto.retry = function (retryCount) {
        return enumerableRepeat(this, retryCount).catchException();
    };

    /**
     *  Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.
     *  For aggregation behavior with no intermediate results, see Observable.aggregate.
     *  
     *  1 - scanned = source.scan(function (acc, x) { return acc + x; });
     *  2 - scanned = source.scan(0, function (acc, x) { return acc + x; });
     *  
     *  @param [seed] The initial accumulator value.
     *  @param accumulator An accumulator function to be invoked on each element.
     *  @return An observable sequence containing the accumulated values.
     */
    observableProto.scan = function () {
        var seed, hasSeed = false, accumulator;
        if (arguments.length === 2) {
            seed = arguments[0];
            accumulator = arguments[1];
            hasSeed = true;
        } else {
            accumulator = arguments[0];
        }
        var source = this;
        return observableDefer(function () {
            var hasAccumulation = false, accumulation;
            return source.select(function (x) {
                if (hasAccumulation) {
                    accumulation = accumulator(accumulation, x);
                } else {
                    accumulation = hasSeed ? accumulator(seed, x) : x;
                    hasAccumulation = true;
                }
                return accumulation;
            });
        });
    };

    /**
     *  Bypasses a specified number of elements at the end of an observable sequence.
     *  
     *  @param count Number of elements to bypass at the end of the source sequence.
     *  @return An observable sequence containing the source sequence elements except for the bypassed ones at the end.
     *  
     *  This operator accumulates a queue with a length enough to store the first <paramref name="count"/> elements. As more elements are
     *  received, elements are taken from the front of the queue and produced on the result sequence. This causes elements to be delayed.
     *        
     */
    observableProto.skipLast = function (count) {
        var source = this;
        return new AnonymousObservable(function (observer) {
            var q = [];
            return source.subscribe(function (x) {
                q.push(x);
                if (q.length > count) {
                    observer.onNext(q.shift());
                }
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    /**
     *  Prepends a sequence of values to an observable sequence with an optional scheduler and an argument list of values to prepend.
     *  
     *  1 - source.startWith(1, 2, 3);
     *  2 - source.startWith(Rx.Scheduler.timeout, 1, 2, 3);
     *  
     *  @return The source sequence prepended with the specified values.  
     */
    observableProto.startWith = function () {
        var values, scheduler, start = 0;
        if (arguments.length > 0 && arguments[0] != null && arguments[0].now !== undefined) {
            scheduler = arguments[0];
            start = 1;
        } else {
            scheduler = immediateScheduler;
        }
        values = slice.call(arguments, start);
        return enumerableFor([observableFromArray(values, scheduler), this]).concat();
    };

    /**
     *  Returns a specified number of contiguous elements from the end of an observable sequence, using an optional scheduler to drain the queue.
     *  
     *  1 - obs = source.takeLast(5);
     *  2 - obs = source.takeLast(5, Rx.Scheduler.timeout);
     *  
     *  @param count Number of elements to take from the end of the source sequence.
     *  @param [scheduler] Scheduler used to drain the queue upon completion of the source sequence.
     *  @return An observable sequence containing the specified number of elements from the end of the source sequence.
     *  
     *  This operator accumulates a buffer with a length enough to store elements <paramref name="count"/> elements. Upon completion of
     *  the source sequence, this buffer is drained on the result sequence. This causes the elements to be delayed.
     * 
     */   
    observableProto.takeLast = function (count, scheduler) {
        return this.takeLastBuffer(count).selectMany(function (xs) { return observableFromArray(xs, scheduler); });
    };

    /**
     *  Returns an array with the specified number of contiguous elements from the end of an observable sequence.
     *  
     *  @param count Number of elements to take from the end of the source sequence.
     *  @return An observable sequence containing a single array with the specified number of elements from the end of the source sequence.
     *  
     *  This operator accumulates a buffer with a length enough to store <paramref name="count"/> elements. Upon completion of the
     *  source sequence, this buffer is produced on the result sequence.
     *   
     */
    observableProto.takeLastBuffer = function (count) {
        var source = this;
        return new AnonymousObservable(function (observer) {
            var q = [];
            return source.subscribe(function (x) {
                q.push(x);
                if (q.length > count) {
                    q.shift();
                }
            }, observer.onError.bind(observer), function () {
                observer.onNext(q);
                observer.onCompleted();
            });
        });
    };

    /**
     *  Projects each element of an observable sequence into zero or more windows which are produced based on element count information.
     *  
     *  1 - xs.windowWithCount(10);
     *  2 - xs.windowWithCount(10, 1);
     *  
     *  @param count Length of each window.
     *  @param [skip] Number of elements to skip between creation of consecutive windows. If not specified, defaults to the count.
     *  @return An observable sequence of windows.  
     */
    observableProto.windowWithCount = function (count, skip) {
        var source = this;
        if (count <= 0) {
            throw new Error(argumentOutOfRange);
        }
        if (skip == null) {
            skip = count;
        }
        if (skip <= 0) {
            throw new Error(argumentOutOfRange);
        }
        return new AnonymousObservable(function (observer) {
            var m = new SingleAssignmentDisposable(),
                refCountDisposable = new RefCountDisposable(m),
                n = 0,
                q = [],
                createWindow = function () {
                    var s = new Subject();
                    q.push(s);
                    observer.onNext(addRef(s, refCountDisposable));
                };
            createWindow();
            m.setDisposable(source.subscribe(function (x) {
                var s;
                for (var i = 0, len = q.length; i < len; i++) {
                    q[i].onNext(x);
                }
                var c = n - count + 1;
                if (c >= 0 && c % skip === 0) {
                    s = q.shift();
                    s.onCompleted();
                }
                n++;
                if (n % skip === 0) {
                    createWindow();
                }
            }, function (exception) {
                while (q.length > 0) {
                    q.shift().onError(exception);
                }
                observer.onError(exception);
            }, function () {
                while (q.length > 0) {
                    q.shift().onCompleted();
                }
                observer.onCompleted();
            }));
            return refCountDisposable;
        });
    };

    /**
     *  Returns the elements of the specified sequence or the specified value in a singleton sequence if the sequence is empty.
     *  
     *  1 - obs = xs.defaultIfEmpty();
     *  2 - obs = xs.defaultIfEmpty(false);
     *  
     *  @param defaultValue The value to return if the sequence is empty. If not provided, this defaults to null.
     *  @return An observable sequence that contains the specified default value if the source is empty; otherwise, the elements of the source itself. 
     */
    observableProto.defaultIfEmpty = function (defaultValue) {
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

    /**
     *  Returns an observable sequence that contains only distinct elements according to the keySelector and the comparer.
     *  
     *  1 - obs = xs.distinct();
     *  2 - obs = xs.distinct(function (x) { return x.id; });
     *  2 - obs = xs.distinct(function (x) { return x.id; }, function (x) { return x.toString(); });
     *  
     *  @param {Function} [keySelector]  A function to compute the comparison key for each element.
     *  @param {Function} [keySerializer]  Used to serialize the given object into a string for object comparison.
     *  @return An observable sequence only containing the distinct elements, based on a computed key value, from the source sequence.
     *  Usage of this operator should be considered carefully due to the maintenance of an internal lookup structure which can grow large.   
     */
   observableProto.distinct = function (keySelector, keySerializer) {
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

    /**
     *  Groups the elements of an observable sequence according to a specified key selector function and comparer and selects the resulting elements by using a specified function.
     *  
     *  1 - observable.groupBy(function (x) { return x.id; });
     *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; });
     *  3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; }, function (x) { return x.toString(); });
     *  
     *  @param keySelector A function to extract the key for each element.
     *  @param {Function} [elementSelector]  A function to map each source element to an element in an observable group.
     *  @param {Function} [keySerializer]  Used to serialize the given object into a string for object comparison.
     *  @return A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.    
     */
    observableProto.groupBy = function (keySelector, elementSelector, keySerializer) {
        return this.groupByUntil(keySelector, elementSelector, function () {
            return observableNever();
        }, keySerializer);
    };

    /**
     *  Groups the elements of an observable sequence according to a specified key selector function.
     *  A duration selector function is used to control the lifetime of groups. When a group expires, it receives an OnCompleted notification. When a new element with the same
     *  key value as a reclaimed group occurs, the group will be reborn with a new lifetime request.
     *  
     *  1 - observable.groupByUntil(function (x) { return x.id; }, null,  function () { return Rx.Observable.never(); });
     *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); });
     *  3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); }, function (x) { return x.toString(); });
     *  
     *  @param keySelector A function to extract the key for each element.
     *  @param durationSelector A function to signal the expiration of a group.
     *  @param {Function} [keySerializer]  Used to serialize the given object into a string for object comparison.
     *  @return 
     *  A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.
     *  If a group's lifetime expires, a new group with the same key value can be created once an element with such a key value is encoutered.
     *      
     */
    observableProto.groupByUntil = function (keySelector, elementSelector, durationSelector, keySerializer) {
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
                        if (serializedKey in map) {
                            delete map[serializedKey];
                            writer.onCompleted();
                        }
                        groupDisposable.remove(md);
                    };
                    md.setDisposable(duration.take(1).subscribe(noop, function (exn) {
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

    /**
     *  Projects each element of an observable sequence into a new form by incorporating the element's index.
     *  
     *  1 - source.select(function (value) { return value * value; });
     *  2 - source.select(function (value, index) { return value * value + index; });
     *  
     *  @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
     *  @return An observable sequence whose elements are the result of invoking the transform function on each element of source. 
     */
    observableProto.select = observableProto.map = function (selector) {
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

    /**
     *  One of the Following:
     *  Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
     *  
     *  1 - source.selectMany(function (x) { return Rx.Observable.range(0, x); });
     *  Or:
     *  Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.
     *  
     *  1 - source.selectMany(function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
     *  Or:
     *  Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
     *  
     *  1 - source.selectMany(Rx.Observable.fromArray([1,2,3]));
     *  
     *  @param selector A transform function to apply to each element or an observable sequence to project each element from the source sequence onto.
     *  @param {Function} [resultSelector]  A transform function to apply to each element of the intermediate sequence.
     *  @return An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.   
     */
    observableProto.selectMany = observableProto.flatMap = function (selector, resultSelector) {
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

    /**
     *  Bypasses a specified number of elements in an observable sequence and then returns the remaining elements.
     *  
     *  @param count The number of elements to skip before returning the remaining elements.
     *  @return An observable sequence that contains the elements that occur after the specified index in the input sequence.   
     */
    observableProto.skip = function (count) {
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

    /**
     *  Bypasses elements in an observable sequence as long as a specified condition is true and then returns the remaining elements.
     *  The element's index is used in the logic of the predicate function.
     *  
     *  1 - source.skipWhile(function (value) { return value < 10; });
     *  1 - source.skipWhile(function (value, index) { return value < 10 || index < 10; });
     *  
     *  @param predicate A function to test each element for a condition; the second parameter of the function represents the index of the source element.
     *  @return An observable sequence that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.   
     */
    observableProto.skipWhile = function (predicate) {
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

    /**
     *  Returns a specified number of contiguous elements from the start of an observable sequence, using the specified scheduler for the edge case of take(0).
     *  
     *  1 - source.take(5);
     *  2 - source.take(0, Rx.Scheduler.timeout);
     *  
     *  @param {Number} count The number of elements to return.
     *  @param [scheduler] Scheduler used to produce an OnCompleted message in case <paramref name="count count</paramref> is set to 0.
     *  @return An observable sequence that contains the specified number of elements from the start of the input sequence.  
     */
    observableProto.take = function (count, scheduler) {
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

    /**
     *  Returns elements from an observable sequence as long as a specified condition is true.
     *  The element's index is used in the logic of the predicate function.
     *  
     *  1 - source.takeWhile(function (value) { return value < 10; });
     *  1 - source.takeWhile(function (value, index) { return value < 10 || index < 10; });
     *  
     *  @param {Function} predicate A function to test each element for a condition; the second parameter of the function represents the index of the source element.
     *  @return An observable sequence that contains the elements from the input sequence that occur before the element at which the test no longer passes.  
     */
    observableProto.takeWhile = function (predicate) {
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

    /**
     *  Filters the elements of an observable sequence based on a predicate by incorporating the element's index.
     *  
     *  1 - source.where(function (value) { return value < 10; });
     *  1 - source.where(function (value, index) { return value < 10 || index < 10; });
     *  
     *  @param {Function} predicate A function to test each source element for a conditio; the second parameter of the function represents the index of the source element.
     *  @return An observable sequence that contains elements from the input sequence that satisfy the condition.   
     */
    observableProto.where = observableProto.filter = function (predicate) {
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
    var AnonymousObservable = root.Internals.AnonymousObservable = (function () {
        inherits(AnonymousObservable, Observable);
        function AnonymousObservable(subscribe) {

            var s = function (observer) {
                var autoDetachObserver = new AutoDetachObserver(observer);
                if (currentThreadScheduler.scheduleRequired()) {
                    currentThreadScheduler.schedule(function () {
                        try {
                            autoDetachObserver.disposable(subscribe(autoDetachObserver));
                        } catch (e) {
                            if (!autoDetachObserver.fail(e)) {
                                throw e;
                            } 
                        }
                    });
                } else {
                    try {
                        autoDetachObserver.disposable(subscribe(autoDetachObserver));
                    } catch (e) {
                        if (!autoDetachObserver.fail(e)) {
                            throw e;
                        }
                    }
                }

                return autoDetachObserver;
            };
            AnonymousObservable.super_.constructor.call(this, s);
        }

        return AnonymousObservable;
    }());

    var AutoDetachObserver = (function () {

        inherits(AutoDetachObserver, AbstractObserver);
        function AutoDetachObserver(observer) {
            AutoDetachObserver.super_.constructor.call(this);
            this.observer = observer;
            this.m = new SingleAssignmentDisposable();
        }

        AutoDetachObserver.prototype.next = function (value) {
            var noError = false;
            try {
                this.observer.onNext(value);
                noError = true;
            } catch (e) { 
                throw e;                
            } finally {
                if (!noError) {
                    this.dispose();
                }
            }
        };
        AutoDetachObserver.prototype.error = function (exn) {
            try {
                this.observer.onError(exn);
            } catch (e) { 
                throw e;                
            } finally {
                this.dispose();
            }
        };
        AutoDetachObserver.prototype.completed = function () {
            try {
                this.observer.onCompleted();
            } catch (e) { 
                throw e;                
            } finally {
                this.dispose();
            }
        };
        AutoDetachObserver.prototype.disposable = function (value) {
            return this.m.disposable(value);
        };
        AutoDetachObserver.prototype.dispose = function () {
            AutoDetachObserver.super_.dispose.call(this);
            this.m.dispose();
        };

        return AutoDetachObserver;
    }());

    var GroupedObservable = (function () {
        function subscribe(observer) {
            return this.underlyingObservable.subscribe(observer);
        }

        inherits(GroupedObservable, Observable);
        function GroupedObservable(key, underlyingObservable, mergedDisposable) {
            GroupedObservable.super_.constructor.call(this, subscribe);
            this.key = key;
            this.underlyingObservable = !mergedDisposable ?
                underlyingObservable :
                new AnonymousObservable(function (observer) {
                    return new CompositeDisposable(mergedDisposable.getDisposable(), underlyingObservable.subscribe(observer));
                });
        }
        return GroupedObservable;
    }());

    var InnerSubscription = function (subject, observer) {
        this.subject = subject;
        this.observer = observer;
    };
    InnerSubscription.prototype.dispose = function () {
        if (!this.subject.isDisposed && this.observer !== null) {
            var idx = this.subject.observers.indexOf(this.observer);
            this.subject.observers.splice(idx, 1);
            this.observer = null;
        }
    };

    /**
     *  Represents an object that is both an observable sequence as well as an observer.
     *  Each notification is broadcasted to all subscribed observers.
     */
    var Subject = root.Subject = (function () {
        function subscribe(observer) {
            checkDisposed.call(this);
            if (!this.isStopped) {
                this.observers.push(observer);
                return new InnerSubscription(this, observer);
            }
            if (this.exception) {
                observer.onError(this.exception);
                return disposableEmpty;
            }
            observer.onCompleted();
            return disposableEmpty;
        }

        inherits(Subject, Observable);

        /**
         * @constructor
         * Creates a subject.
         */      
        function Subject() {
            Subject.super_.constructor.call(this, subscribe);
            this.isDisposed = false,
            this.isStopped = false,
            this.observers = [];
        }

        addProperties(Subject.prototype, Observer, {
            onCompleted: function () {
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var os = this.observers.slice(0);
                    this.isStopped = true;
                    for (var i = 0, len = os.length; i < len; i++) {
                        os[i].onCompleted();
                    }

                    this.observers = [];
                }
            },
            onError: function (exception) {
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var os = this.observers.slice(0);
                    this.isStopped = true;
                    this.exception = exception;
                    for (var i = 0, len = os.length; i < len; i++) {
                        os[i].onError(exception);
                    }

                    this.observers = [];
                }
            },
            onNext: function (value) {
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var os = this.observers.slice(0);
                    for (var i = 0, len = os.length; i < len; i++) {
                        os[i].onNext(value);
                    }
                }
            },
            dispose: function () {
                this.isDisposed = true;
                this.observers = null;
            }
        });

        Subject.create = function (observer, observable) {
            return new AnonymousSubject(observer, observable);
        };

        return Subject;
    }());

    /**
     *  Represents the result of an asynchronous operation.
     *  The last value before the OnCompleted notification, or the error received through OnError, is sent to all subscribed observers.
     */   
    var AsyncSubject = root.AsyncSubject = (function () {

        function subscribe(observer) {
            checkDisposed.call(this);
            if (!this.isStopped) {
                this.observers.push(observer);
                return new InnerSubscription(this, observer);
            }
            var ex = this.exception;
            var hv = this.hasValue;
            var v = this.value;
            if (ex) {
                observer.onError(ex);
            } else if (hv) {
                observer.onNext(v);
                observer.onCompleted();
            } else {
                observer.onCompleted();
            }
            return disposableEmpty;
        }

        inherits(AsyncSubject, Observable);

        /**
         * @constructor
         * Creates a subject that can only receive one value and that value is cached for all future observations.
         */ 
        function AsyncSubject() {
            AsyncSubject.super_.constructor.call(this, subscribe);

            this.isDisposed = false,
            this.isStopped = false,
            this.value = null,
            this.hasValue = false,
            this.observers = [],
            this.exception = null;
        }

        addProperties(AsyncSubject.prototype, Observer, {
            onCompleted: function () {
                var o, i, len;
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var os = this.observers.slice(0);
                    this.isStopped = true;
                    var v = this.value;
                    var hv = this.hasValue;

                    if (hv) {
                        for (i = 0, len = os.length; i < len; i++) {
                            o = os[i];
                            o.onNext(v);
                            o.onCompleted();
                        }
                    } else {
                        for (i = 0, len = os.length; i < len; i++) {
                            os[i].onCompleted();
                        }
                    }

                    this.observers = [];
                }
            },
            onError: function (exception) {
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var os = this.observers.slice(0);
                    this.isStopped = true;
                    this.exception = exception;

                    for (var i = 0, len = os.length; i < len; i++) {
                        os[i].onError(exception);
                    }

                    this.observers = [];
                }
            },
            onNext: function (value) {
                checkDisposed.call(this);
                if (!this.isStopped) {
                    this.value = value;
                    this.hasValue = true;
                }
            },
            dispose: function () {
                this.isDisposed = true;
                this.observers = null;
                this.exception = null;
                this.value = null;
            }
        });

        return AsyncSubject;
    }());

    var AnonymousSubject = (function () {
        function subscribe(observer) {
            return this.observable.subscribe(observer);
        }

        inherits(AnonymousSubject, Observable);
        function AnonymousSubject(observer, observable) {
            AnonymousSubject.super_.constructor.call(this, subscribe);
            this.observer = observer;
            this.observable = observable;
        }

        addProperties(AnonymousSubject.prototype, Observer, {
            onCompleted: function () {
                this.observer.onCompleted();
            },
            onError: function (exception) {
                this.observer.onError(exception);
            },
            onNext: function (value) {
                this.observer.onNext(value);
            }
        });

        return AnonymousSubject;
    }());

    // Check for AMD
    if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
        window.Rx = root;
        return define(function () {
            return root;
        });
    } else if (freeExports) {
        if (typeof module == 'object' && module && module.exports == freeExports) {
            module.exports = root;
        } else {
            freeExports = root;
        }
    } else {
        window.Rx = root;
    }
}(this));