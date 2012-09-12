/**
* @preserve Copyright (c) Microsoft Corporation.  All rights reserved.
* This code is licensed by Microsoft Corporation under the terms
* of the Microsoft Reference Source License (MS-RSL).
* http://referencesource.microsoft.com/referencesourcelicense.aspx.
*/

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
        Function.prototype.bind = function (thisp) {
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
        for (var key in parent) {
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
    if (!Array.prototype.every) {
        Array.prototype.every = function (predicate) {
            var t = new Object(this);
            for (var i = 0, len = t.length >>> 0; i < len; i++) {
                if (i in t && !predicate.call(arguments[1], t[i], i, t)) {
                    return false;
                }
            }
            return true;
        };
    }
    if (!Array.prototype.map) {
        Array.prototype.map = function (selector) {
            var results = [], t = new Object(this);
            for (var i = 0, len = t.length >>> 0; i < len; i++) {
                if (i in t) {
                    results.push(selector.call(arguments[1], t[i], i, t));
                }
            }
            return results;
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
        Array.prototype.indexOf = function indexOf(item) {
            var self = new Object(this), length = self.length >>> 0;
            if (!length) {
                return -1;
            }
            var i = 0;
            if (arguments.length > 1) {
                i = arguments[1];
            }
            i = i >= 0 ? i : Math.max(0, length + i);
            for (; i < length; i++) {
                if (i in self && self[i] === item) {
                    return i;
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
    var CompositeDisposable = root.CompositeDisposable = function () {
        /// <summary>
        /// Initializes a new instance of the CompositeDisposable class from a group of disposables as an argument array or splat.
        /// </summary>
        this.disposables = argsOrArray(arguments, 0);
        this.isDisposed = false;
        this.length = this.disposables.length;
    };
    CompositeDisposable.prototype.add = function (item) {
        /// <summary>
        /// Adds a disposable to the CompositeDisposable or disposes the disposable if the CompositeDisposable is disposed.
        /// </summary>
        /// <param name="item">Disposable to add.</param>
        if (this.isDisposed) {
            item.dispose();
        } else {
            this.disposables.push(item);
            this.length++;
        }
    };
    CompositeDisposable.prototype.remove = function (item) {
        /// <summary>
        /// Removes and disposes the first occurrence of a disposable from the CompositeDisposable.
        /// </summary>
        /// <param name="item">Disposable to remove.</param>
        /// <returns>true if found; false otherwise.</returns>
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
    CompositeDisposable.prototype.dispose = function () {
        /// <summary>
        /// Disposes all disposables in the group and removes them from the group.
        /// </summary>
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
    CompositeDisposable.prototype.clear = function () {
        /// <summary>
        /// Removes and disposes all disposables from the CompositeDisposable, but does not dispose the CompositeDisposable.
        /// </summary>
        var currentDisposables = this.disposables.slice(0);
        this.disposables = [];
        this.length = 0;
        for (var i = 0, len = currentDisposables.length; i < len; i++) {
            currentDisposables[i].dispose();
        }
    };
    CompositeDisposable.prototype.contains = function (item) {
        /// <summary>
        /// Determines whether the CompositeDisposable contains a specific disposable.
        /// </summary>
        /// <param name="item">Disposable to search for.</param>
        /// <returns>true if the disposable was found; otherwise, false.</returns>
        return this.disposables.indexOf(item) !== -1;
    };
    CompositeDisposable.prototype.toArray = function () {
        /// <summary>
        /// Converts the existing CompositeDisposable to an array of disposables
        /// </summary>
        /// <returns>An array of disposable objects.</returns>
        return this.disposables.slice(0);
    };

    // Main disposable class
    var Disposable = root.Disposable = function (action) {
        this.isDisposed = false;
        this.action = action;
    };
    Disposable.prototype.dispose = function () {
        /// <summary>
        /// Performs the task of cleaning up resources.
        /// </summary>
        if (!this.isDisposed) {
            this.action();
            this.isDisposed = true;
        }
    };

    var disposableCreate = Disposable.create = function (action) {
        /// <summary>
        /// Creates a disposable object that invokes the specified action when disposed.
        /// </summary>
        /// <param name="dispose">Action to run during the first call to <see cref="IDisposable.Dispose"/>. The action is guaranteed to be run at most once.</param>
        /// <returns>The disposable object that runs the given action upon disposal.</returns>
        return new Disposable(action);
    };
    var disposableEmpty = Disposable.empty = { dispose: noop };
    
    // Single assignment
    var SingleAssignmentDisposable = root.SingleAssignmentDisposable = function () {
        /// <summary>
        /// Initializes a new instance of the SingleAssignmentDisposable class.
        /// </summary>
        this.isDisposed = false;
        this.current = null;
    };
    SingleAssignmentDisposable.prototype.disposable = function (value) {
        /// <summary>
        /// Gets or sets the underlying disposable. After disposal, the result of getting this method is undefined.
        /// </summary>
        /// <param name="value">[Optional] The new underlying disposable.</param>
        /// <returns>The underlying disposable.</returns>
        return !value ? this.getDisposable() : this.setDisposable(value);
    };
    SingleAssignmentDisposable.prototype.getDisposable = function () {
        /// <summary>
        /// Gets  the underlying disposable. After disposal, the result of getting this method is undefined.
        /// </summary>
        /// <returns>The underlying disposable.</returns>
        return this.current;
    };
    SingleAssignmentDisposable.prototype.setDisposable = function (value) {
        /// <summary>
        /// Sets the underlying disposable. 
        /// </summary>
        /// <param name="value">The new underlying disposable.</param>
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
    SingleAssignmentDisposable.prototype.dispose = function () {
        /// <summary>
        /// Disposes the underlying disposable.
        /// </summary>
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

    // Multiple assignment disposable
    var SerialDisposable = root.SerialDisposable = function () {
        /// <summary>
        /// Initializes a new instance of the SerialDisposable class.
        /// </summary>
        this.isDisposed = false;
        this.current = null;
    };
    SerialDisposable.prototype.getDisposable = function () {
        /// <summary>
        /// Gets the underlying disposable.
        /// </summary>
        /// <returns>The underlying disposable</returns>
        return this.current;
    };
    SerialDisposable.prototype.setDisposable = function (value) {
        /// <summary>
        /// Sets the underlying disposable.
        /// </summary>
        /// <param name="value">The new underlying disposable.</param>
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
    SerialDisposable.prototype.disposable = function (value) {
        /// <summary>
        /// Gets or sets the underlying disposable.
        /// </summary>
        /// <remarks>If the SerialDisposable has already been disposed, assignment to this property causes immediate disposal of the given disposable object. Assigning this property disposes the previous disposable object.</remarks>
        if (!value) {
            return this.getDisposable();
        } else {
            this.setDisposable(value);
        }
    };
    SerialDisposable.prototype.dispose = function () {
        /// <summary>
        /// Disposes the underlying disposable as well as all future replacements.
        /// </summary>
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

        function RefCountDisposable(disposable) {
            /// <summary>
            /// Initializes a new instance of the RefCountDisposable class with the specified disposable.
            /// </summary>
            /// <param name="disposable">Underlying disposable.</param>
            this.underlyingDisposable = disposable;
            this.isDisposed = false;
            this.isPrimaryDisposed = false;
            this.count = 0;
        }

        RefCountDisposable.prototype.dispose = function () {
            /// <summary>
            /// Disposes the underlying disposable only when all dependent disposables have been disposed.
            /// </summary>
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
        RefCountDisposable.prototype.getDisposable = function () {
            /// <summary>
            /// Returns a dependent disposable that when disposed decreases the refcount on the underlying disposable.
            /// </summary>
            /// <returns>A dependent disposable contributing to the reference count that manages the underlying disposable's lifetime.</returns>
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

    var Scheduler = root.Scheduler = (function () {
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
        schedulerProto.catchException = function (handler) {
            /// <summary>
            /// Returns a scheduler that wraps the original scheduler, adding exception handling for scheduled actions.
            /// </summary>
            /// <param name="scheduler">Scheduler to apply an exception filter for.</param>
            /// <param name="handler">Handler that's run if an exception is caught. The exception will be rethrown if the handler returns false.</param>
            /// <returns>Wrapper around the original scheduler, enforcing exception handling.</returns>
            return new CatchScheduler(this, handler);
        };

        schedulerProto.schedulePeriodic = function (period, action) {
            /// <summary>
            /// Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using window.setInterval for the base implementation.
            /// </summary>
            /// <param name="period">Period for running the work periodically.</param>
            /// <param name="action">Action to be executed.</param>
            /// <returns>The disposable object used to cancel the scheduled recurring action (best effort).</returns>
            return this.schedulePeriodicWithState(null, period, function () {
                action();
            });
        };

        schedulerProto.schedulePeriodicWithState = function (state, period, action) {
            /// <summary>
            /// Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using window.setInterval for the base implementation.
            /// </summary>
            /// <param name="state">Initial state passed to the action upon the first iteration.</param>
            /// <param name="period">Period for running the work periodically.</param>
            /// <param name="action">Action to be executed, potentially updating the state.</param>
            /// <returns>The disposable object used to cancel the scheduled recurring action (best effort).</returns>
            var s = state, id = window.setInterval(function () {
                s = action(s);
            }, period);
            return disposableCreate(function () {
                window.clearInterval(id);
            });
        };

        schedulerProto.schedule = function (action) {
            /// <summary>
            /// Schedules an action to be executed.
            /// </summary>
            /// <param name="action">Action to execute.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this._schedule(action, invokeAction);
        };

        schedulerProto.scheduleWithState = function (state, action) {
            /// <summary>
            /// Schedules an action to be executed.
            /// </summary>
            /// <param name="state">State passed to the action to be executed.</param>
            /// <param name="action">Action to be executed.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this._schedule(state, action);
        };

        schedulerProto.scheduleWithRelative = function (dueTime, action) {
            /// <summary>
            /// Schedules an action to be executed after the specified relative due time.
            /// </summary>
            /// <param name="action">Action to execute.</param>
            /// <param name="dueTime">Relative time after which to execute the action.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this._scheduleRelative(action, dueTime, invokeAction);
        };

        schedulerProto.scheduleWithRelativeAndState = function (state, dueTime, action) {
            /// <summary>
            /// Schedules an action to be executed after dueTime.
            /// </summary>
            /// <param name="state">State passed to the action to be executed.</param>
            /// <param name="action">Action to be executed.</param>
            /// <param name="dueTime">Relative time after which to execute the action.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this._scheduleRelative(state, dueTime, action);
        };

        schedulerProto.scheduleWithAbsolute = function (dueTime, action) {
            /// <summary>
            /// Schedules an action to be executed at the specified absolute due time.
            /// </summary>
            /// <param name="action">Action to execute.</param>
            /// <param name="dueTime">Absolute time at which to execute the action.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this._scheduleAbsolute(action, dueTime, invokeAction);
        };

        schedulerProto.scheduleWithAbsoluteAndState = function (state, dueTime, action) {
            /// <summary>
            /// Schedules an action to be executed at dueTime.
            /// </summary>
            /// <param name="state">State passed to the action to be executed.</param>
            /// <param name="action">Action to be executed.</param>
            /// <param name="dueTime">Absolute time at which to execute the action.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this._scheduleAbsolute(state, dueTime, action);
        };

        schedulerProto.scheduleRecursive = function (action) {
            /// <summary>
            /// Schedules an action to be executed recursively.
            /// </summary>
            /// <param name="action">Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this.scheduleRecursiveWithState(action, function (_action, self) {
                _action(function () {
                    self(_action);
                });
            });
        };

        schedulerProto.scheduleRecursiveWithState = function (state, action) {
            /// <summary>
            /// Schedules an action to be executed recursively.
            /// </summary>
            /// <param name="state">State passed to the action to be executed.</param>
            /// <param name="action">Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in recursive invocation state.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this.scheduleWithState({ first: state, second: action }, function (s, p) {
                return invokeRecImmediate(s, p);
            });
        };

        schedulerProto.scheduleRecursiveWithRelative = function (dueTime, action) {
            /// <summary>
            /// Schedules an action to be executed recursively after a specified relative due time.
            /// </summary>
            /// <param name="action">Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action at the specified relative time.</param>
            /// <param name="dueTime">Relative time after which to execute the action for the first time.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this.scheduleRecursiveWithRelativeAndState(action, dueTime, function (_action, self) {
                _action(function (dt) {
                    self(_action, dt);
                });
            });
        };

        schedulerProto.scheduleRecursiveWithRelativeAndState = function (state, dueTime, action) {
            /// <summary>
            /// Schedules an action to be executed recursively after a specified relative due time.
            /// </summary>
            /// <param name="state">State passed to the action to be executed.</param>
            /// <param name="action">Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.</param>
            /// <param name="dueTime">Relative time after which to execute the action for the first time.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this._scheduleRelative({ first: state, second: action }, dueTime, function (s, p) {
                return invokeRecDate(s, p, 'scheduleWithRelativeAndState');
            });
        };

        schedulerProto.scheduleRecursiveWithAbsolute = function (dueTime, action) {
            /// <summary>
            /// Schedules an action to be executed recursively at a specified absolute due time.
            /// </summary>
            /// <param name="action">Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action at the specified absolute time.</param>
            /// <param name="dueTime">Absolute time at which to execute the action for the first time.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this.scheduleRecursiveWithAbsoluteAndState(action, dueTime, function (_action, self) {
                _action(function (dt) {
                    self(_action, dt);
                });
            });
        };

        schedulerProto.scheduleRecursiveWithAbsoluteAndState = function (state, dueTime, action) {
            /// <summary>
            /// Schedules an action to be executed recursively at a specified absolute due time.
            /// </summary>
            /// <param name="state">State passed to the action to be executed.</param>
            /// <param name="action">Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.</param>
            /// <param name="dueTime">Absolute time at which to execute the action for the first time.</param>
            /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
            return this._scheduleAbsolute({ first: state, second: action }, dueTime, function (s, p) {
                return invokeRecDate(s, p, 'scheduleWithAbsoluteAndState');
            });
        };

        Scheduler.now = defaultNow;
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

    // Virtual Scheduler
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

        function VirtualTimeScheduler(initialClock, comparer) {
            /// <summary>
            /// Creates a new virtual time scheduler with the specified initial clock value and absolute time comparer.
            /// </summary>
            /// <param name="initialClock">Initial value for the clock.</param>
            /// <param name="comparer">Comparer to determine causality of events based on absolute time.</param>
            this.clock = initialClock;
            this.comparer = comparer;
            this.isEnabled = false;
            this.queue = new PriorityQueue(1024);
            VirtualTimeScheduler.super_.constructor.call(this, localNow, scheduleNow, scheduleRelative, scheduleAbsolute);
        }

        addProperties(VirtualTimeScheduler.prototype, {
            schedulePeriodicWithState: function (state, period, action) {
                /// <summary>
                /// Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be emulated using recursive scheduling.
                /// </summary>
                /// <param name="state">Initial state passed to the action upon the first iteration.</param>
                /// <param name="period">Period for running the work periodically.</param>
                /// <param name="action">Action to be executed, potentially updating the state.</param>
                /// <returns>The disposable object used to cancel the scheduled recurring action (best effort).</returns>
                var s = new SchedulePeriodicRecursive(this, state, period, action);
                return s.start();
            },
            scheduleRelativeWithState: function (state, dueTime, action) {
                /// <summary>
                /// Schedules an action to be executed after dueTime.
                /// </summary>
                /// <param name="state">State passed to the action to be executed.</param>
                /// <param name="dueTime">Relative time after which to execute the action.</param>
                /// <param name="action">Action to be executed.</param>
                /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
                var runAt = this.add(this.clock, dueTime);
                return this.scheduleAbsoluteWithState(state, runAt, action);
            },
            scheduleRelative: function (dueTime, action) {
                /// <summary>
                /// Schedules an action to be executed at dueTime.
                /// </summary>
                /// <param name="dueTime">Relative time after which to execute the action.</param>
                /// <param name="action">Action to be executed.</param>
                /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
                return this.scheduleRelativeWithState(action, dueTime, invokeAction);
            },
            start: function () {
                /// <summary>
                /// Starts the virtual time scheduler.
                /// </summary>
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
            stop: function () {
                /// <summary>
                /// Stops the virtual time scheduler.
                /// </summary>
                this.isEnabled = false;
            },
            advanceTo: function (time) {
                /// <summary>
                /// Advances the scheduler's clock to the specified time, running all work till that point.
                /// </summary>
                /// <param name="time">Absolute time to advance the scheduler's clock to.</param>
                var next;
                if (this.comparer(this.clock, time) >= 0) {
                    throw new Error(argumentOutOfRange);
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
            advanceBy: function (time) {
                /// <summary>
                /// Advances the scheduler's clock by the specified relative time, running all work scheduled for that timespan.
                /// </summary>
                /// <param name="time">Relative time to advance the scheduler's clock by.</param>
                var dt = this.add(this.clock, time);
                if (this.comparer(this.clock, dt) >= 0) {
                    throw new Error(argumentOutOfRange);
                }
                return this.advanceTo(dt);
            },
            sleep: function (time) {
                /// <summary>
                /// Advances the scheduler's clock by the specified relative time.
                /// </summary>
                /// <param name="time">Relative time to advance the scheduler's clock by.</param>
                var dt = this.add(this.clock, time);

                if (this.comparer(this.clock, dt) >= 0) {
                    throw new Error(argumentOutOfRange);
                }

                this.clock = dt;
            },
            getNext: function () {
                /// <summary>
                /// Gets the next scheduled item to be executed.
                /// </summary>
                /// <returns>The next scheduled item.</returns>
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
            scheduleAbsolute: function (dueTime, action) {
                /// <summary>
                /// Schedules an action to be executed at dueTime.
                /// </summary>
                /// <param name="scheduler">Scheduler to execute the action on.</param>
                /// <param name="dueTime">Absolute time at which to execute the action.</param>
                /// <param name="action">Action to be executed.</param>
                /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
                return this.scheduleAbsoluteWithState(action, dueTime, invokeAction);
            },
            scheduleAbsoluteWithState: function (state, dueTime, action) {
                /// <summary>
                /// Schedules an action to be executed at dueTime.
                /// </summary>
                /// <param name="state">State passed to the action to be executed.</param>
                /// <param name="dueTime">Absolute time at which to execute the action.</param>
                /// <param name="action">Action to be executed.</param>
                /// <returns>The disposable object used to cancel the scheduled action (best effort).</returns>
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

    // Notifications

    var Notification = root.Notification = (function () {
        function Notification() { }

        addProperties(Notification.prototype, {
            /// <summary>
            /// Invokes the delegate corresponding to the notification or an observer and returns the produced result.
            /// &#10;
            /// &#10;1 - notification.accept(observer);
            /// &#10;2 - notification.accept(onNext, onError, onCompleted);
            /// </summary>
            /// <param name="observerOrOnNext">Delegate to invoke for an OnNext notification.</param>
            /// <param name="onError">[Optional] Delegate to invoke for an OnError notification.</param>
            /// <param name="onCompleted">[Optional] Delegate to invoke for an OnCompleted notification.</param>
            /// <returns>Result produced by the observation.</returns>
            accept: function (observerOrOnNext, onError, onCompleted) {
                if (arguments.length > 1 || typeof observerOrOnNext === 'function') {
                    return this._accept(observerOrOnNext, onError, onCompleted);
                } else {
                    return this._acceptObservable(observerOrOnNext);
                }
            },
            toObservable: function (scheduler) {
                /// <summary>
                /// Returns an observable sequence with a single notification, using the specified scheduler, else the immediate scheduler.
                /// </summary>
                /// <param name="scheduler">[Optional] Scheduler to send out the notification calls on.</param>
                /// <returns>The observable sequence that surfaces the behavior of the notification upon subscription.</returns>
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
            },
            hasValue: false,
            equals: function (other) {
                /// <summary>
                /// Indicates whether this instance and a specified object are equal.
                /// </summary>
                /// <returns>true if both objects are the same; false otherwise.</returns>
                var otherString = other == null ? '' : other.toString();
                return this.toString() === otherString;
            }
        });

        return Notification;
    })();

    var notificationCreateOnNext = Notification.createOnNext = (function () {
        inherits(ON, Notification);
        function ON(value) {
            this.value = value;
            this.hasValue = true;
            this.kind = 'N';
        }

        addProperties(ON.prototype, {
            _accept: function (onNext) {
                return onNext(this.value);
            },
            _acceptObservable: function (observer) {
                return observer.onNext(this.value);
            },
            toString: function () {
                return 'OnNext(' + this.value + ')';
            }
        });

        return function (next) {
            return new ON(next);
        };
    }());

    var notificationCreateOnError = Notification.createOnError = (function () {
        inherits(OE, Notification);
        function OE(exception) {
            this.exception = exception;
            this.kind = 'E';
        }

        addProperties(OE.prototype, {
            _accept: function (onNext, onError) {
                return onError(this.exception);
            },
            _acceptObservable: function (observer) {
                return observer.onError(this.exception);
            },
            toString: function () {
                return 'OnError(' + this.exception + ')';
            }
        });

        return function (error) {
            return new OE(error);
        };
    }());

    var notificationCreateOnCompleted = Notification.createOnCompleted = (function () {
        inherits(OC, Notification);
        function OC() {
            this.kind = 'C';
        }

        addProperties(OC.prototype, {
            _accept: function (onNext, onError, onCompleted) {
                return onCompleted();
            },
            _acceptObservable: function (observer) {
                return observer.onCompleted();
            },
            toString: function () {
                return 'OnCompleted()';
            }
        });

        return function () {
            return new OC();
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

    // Observer
    var Observer = root.Observer = function () { };
    Observer.prototype.toNotifier = function () {
        /// <summary>
        /// Creates a notification callback from an observer.
        /// </summary>
        /// <typeparam name="T">The type of the elements received by the observer.</typeparam>
        /// <param name="observer">Observer object.</param>
        /// <returns>The action that forwards its input notification to the underlying observer.</returns>
        var observer = this;
        return function (n) {
            return n.accept(observer);
        };
    };
    Observer.prototype.asObserver = function () {
        /// <summary>
        /// Hides the identity of an observer.
        /// </summary>
        /// <typeparam name="T">The type of the elements received by the source observer.</typeparam>
        /// <param name="observer">An observer whose identity to hide.</param>
        /// <returns>An observer that hides the identity of the specified observer.</returns>
        return new AnonymousObserver(this.onNext.bind(this), this.onError.bind(this), this.onCompleted.bind(this));
    };
    Observer.prototype.checked = function () {
        /// <summary>
        /// Checks access to the observer for grammar violations. This includes checking for multiple OnError or OnCompleted calls, as well as reentrancy in any of the observer methods.
        /// If a violation is detected, an Error is thrown from the offending observer method call.
        /// </summary>
        /// <param name="observer">The observer whose callback invocations should be checked for grammar violations.</param>
        /// <returns>An observer that checks callbacks invocations against the observer grammar and, if the checks pass, forwards those to the specified observer.</returns>
        return new CheckedObserver(this);
    };

    var observerCreate = Observer.create = function (onNext, onError, onCompleted) {
        /// <summary>
        /// Creates an observer from the specified OnNext, along with optional OnError, and OnCompleted actions.
        /// </summary>
        /// <param name="onNext">Observer's OnNext action implementation.</param>
        /// <param name="onError">[Optional] Observer's OnError action implementation.</param>
        /// <param name="onCompleted">[Optional] Observer's OnCompleted action implementation.</param>
        /// <returns>The observer object implemented using the given actions.</returns>
        onNext || (onNext = noop);
        onError || (onError = defaultError);
        onCompleted || (onCompleted = noop);
        return new AnonymousObserver(onNext, onError, onCompleted);
    };

    Observer.fromNotifier = function (handler) {
        /// <summary>
        /// Creates an observer from a notification callback.
        /// </summary>
        /// <param name="handler">Action that handles a notification.</param>
        /// <returns>The observer object that invokes the specified handler using a notification corresponding to each message it receives.</returns>
        return new AnonymousObserver(function (x) {
            return handler(notificationCreateOnNext(x));
        }, function (exception) {
            return handler(notificationCreateOnError(exception));
        }, function () {
            return handler(notificationCreateOnCompleted());
        });
    };

    // Abstract Observer
    var AbstractObserver = root.Internals.AbstractObserver = (function () {
        inherits(AbstractObserver, Observer);
        function AbstractObserver() {
            this.isStopped = false;
        }

        AbstractObserver.prototype.onNext = function (value) {
            /// <summary>
            /// Notifies the observer of a new element in the sequence.
            /// </summary>
            /// <param name="value">Next element in the sequence.</param>
            if (!this.isStopped) {
                this.next(value);
            }
        };
        AbstractObserver.prototype.onError = function (error) {
            /// <summary>
            /// Notifies the observer that an exception has occurred.
            /// </summary>
            /// <param name="error">The error that has occurred.</param>
            if (!this.isStopped) {
                this.isStopped = true;
                this.error(error);
            }
        };
        AbstractObserver.prototype.onCompleted = function () {
            /// <summary>
            /// Notifies the observer of the end of the sequence.
            /// </summary>
            if (!this.isStopped) {
                this.isStopped = true;
                this.completed();
            }
        };
        AbstractObserver.prototype.dispose = function () {
            /// <summary>
            /// Disposes the observer, causing it to transition to the stopped state.
            /// </summary>
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

    var AnonymousObserver = root.AnonymousObserver = (function () {
        inherits(AnonymousObserver, AbstractObserver);
        function AnonymousObserver(onNext, onError, onCompleted) {
            /// <summary>
            /// Creates an observer from the specified OnNext, OnError, and OnCompleted actions.
            /// </summary>
            /// <param name="onNext">Observer's OnNext action implementation.</param>
            /// <param name="onError">Observer's OnError action implementation.</param>
            /// <param name="onCompleted">Observer's OnCompleted action implementation.</param>
            AnonymousObserver.super_.constructor.call(this);
            this._onNext = onNext;
            this._onError = onError;
            this._onCompleted = onCompleted;
        }
        AnonymousObserver.prototype.next = function (value) {
            /// <summary>
            /// Calls the onNext action.
            /// </summary>
            /// <param name="value">Next element in the sequence.</param>
            this._onNext(value);
        };
        AnonymousObserver.prototype.error = function (exception) {
            /// <summary>
            /// Calls the onError action.
            /// </summary>
            /// <param name="error">The error that has occurred.</param>
            this._onError(exception);
        };
        AnonymousObserver.prototype.completed = function () {
            /// <summary>
            /// Calls the onCompleted action.
            /// </summary>
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
            } finally {
                this._state = 0;
            }
        };

        CheckedObserver.prototype.onError = function (err) {
            this.checkAccess();
            try {
                this._observer.onError(err);
            } finally {
                this._state = 2;
            }
        };

        CheckedObserver.prototype.onCompleted = function () {
            this.checkAccess();
            try {
                this._observer.onCompleted();
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
    var Observable = root.Observable = (function () {

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

        observableProto.subscribe = function (observerOrOnNext, onError, onCompleted) {
            /// <summary>
            /// Subscribes an observer to the observable sequence.
            /// &#10;
            /// &#10;1 - source.subscribe();
            /// &#10;2 - source.subscribe(observer);
            /// &#10;3 - source.subscribe(function (x) { console.log(x); });
            /// &#10;4 - source.subscribe(function (x) { console.log(x); }, function (err) { console.log(err); });
            /// &#10;5 - source.subscribe(function (x) { console.log(x); }, function (err) { console.log(err); }, function () { console.log('done'); });
            /// </summary>
            /// <param name="observerOrOnNext">[Optional] The object that is to receive notifications or an action to invoke for each element in the observable sequence.</param>
            /// <param name="onError">[Optional] Action to invoke upon exceptional termination of the observable sequence.</param>
            /// <param name="onCompleted">[Optional] Action to invoke upon graceful termination of the observable sequence.</param>
            /// <returns>The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler.</returns>            
            var subscriber;
            if (arguments.length === 0 || arguments.length > 1 || typeof observerOrOnNext === 'function') {
                subscriber = observerCreate(observerOrOnNext, onError, onCompleted);
            } else {
                subscriber = observerOrOnNext;
            }
            return this._subscribe(subscriber);
        };

        observableProto.toArray = function () {
            /// <summary>
            /// Creates a list from an observable sequence.
            /// </summary>
            /// <returns>An observable sequence containing a single element with a list containing all the elements of the source sequence.</returns>         
            function accumulator(list, i) {
                list.push(i);
                return list.slice(0);
            }
            return this.scan([], accumulator).startWith([]).finalValue();
        }

        return Observable;
    })();

    Observable.start = function (func, scheduler, context) {
        /// <summary>
        /// Invokes the specified function asynchronously on the specified scheduler, surfacing the result through an observable sequence.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.start(function () { console.log('hello'); });
        /// &#10;2 - res = Rx.Observable.start(function () { console.log('hello'); }, Rx.Scheduler.timeout);
        /// &#10;2 - res = Rx.Observable.start(function () { this.log('hello'); }, Rx.Scheduler.timeout, console);
        /// </summary>
        /// <param name="func">Function to run asynchronously.</param>
        /// <param name="scheduler">[Optional] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.</param>
        /// <param name="context">[Optional] The context for the func parameter to be executed.  If not specified, defaults to undefined.</param>
        /// <returns>An observable sequence exposing the function's result value, or an exception.</returns>
        /// <remarks>
        /// <list type="bullet">
        /// <item><description>The function is called immediately, not during the subscription of the resulting sequence.</description></item>
        /// <item><description>Multiple subscriptions to the resulting sequence can observe the function's result.</description></item>
        /// </list>
        /// </remarks>
        return observableToAsync(func, scheduler, context)();
    };

    var observableToAsync = Observable.toAsync = function (func, scheduler, context) {
        /// <summary>
        /// Converts the function into an asynchronous function. Each invocation of the resulting asynchronous function causes an invocation of the original synchronous function on the specified scheduler.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.toAsync(function (x, y) { return x + y; })(4, 3);
        /// &#10;2 - res = Rx.Observable.toAsync(function (x, y) { return x + y; }, Rx.Scheduler.timeout)(4, 3);
        /// &#10;2 - res = Rx.Observable.toAsync(function (x) { this.log(x); }, Rx.Scheduler.timeout, console)('hello');
        /// </summary>
        /// <param name="function">Function to convert to an asynchronous function.</param>
        /// <param name="scheduler">[Optional] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.</param>
        /// <param name="context">[Optional] The context for the func parameter to be executed.  If not specified, defaults to undefined.</param>
        /// <returns>Asynchronous function.</returns>
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

    observableProto.observeOn = function (scheduler) {
    /// <summary>
    /// Wraps the source sequence in order to run its observer callbacks on the specified scheduler.
    /// </summary>
    /// <param name="scheduler">Scheduler to notify observers on.</param>
    /// <returns>The source sequence whose observations happen on the specified scheduler.</returns>
    /// <remarks>
    /// This only invokes observer callbacks on a scheduler. In case the subscription and/or unsubscription actions have side-effects
    /// that require to be run on a scheduler, use subscribeOn.
    /// </remarks>        
        var source = this;
        return new AnonymousObservable(function (observer) {
            return source.subscribe(new ObserveOnObserver(scheduler, observer));
        });
    };

    observableProto.subscribeOn = function (scheduler) {
    /// <summary>
    /// Wraps the source sequence in order to run its subscription and unsubscription logic on the specified scheduler. This operation is not commonly used;
    /// see the remarks section for more information on the distinction between subscribeOn and observeOn.
    /// </summary>
    /// <param name="scheduler">Scheduler to perform subscription and unsubscription actions on.</param>
    /// <returns>The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler.</returns>
    /// <remarks>
    /// This only performs the side-effects of subscription and unsubscription on the specified scheduler. In order to invoke observer
    /// callbacks on a scheduler, use observeOn.
    /// </remarks>        
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
    
    Observable.create = function (subscribe) {
        /// <summary>
        /// Creates an observable sequence from a specified subscribe method implementation.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.create(function (observer) { return function () { } );
        /// </summary>
        /// <param name="subscribe">Implementation of the resulting observable sequence's subscribe method, returning a function that will be wrapped in a Disposable.</param>
        /// <returns>The observable sequence with the specified implementation for the Subscribe method.</returns>
        return new AnonymousObservable(function (o) {
            return disposableCreate(subscribe(o));
        });
    };

    Observable.createWithDisposable = function (subscribe) {
        /// <summary>
        /// Creates an observable sequence from a specified subscribe method implementation.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.create(function (observer) { return Rx.Disposable.empty; } );        
        /// </summary>
        /// <param name="subscribe">Implementation of the resulting observable sequence's subscribe method.</param>
        /// <returns>The observable sequence with the specified implementation for the Subscribe method.</returns>
        return new AnonymousObservable(subscribe);
    };

    var observableDefer = Observable.defer = function (observableFactory) {
        /// <summary>
        /// Returns an observable sequence that invokes the specified factory function whenever a new observer subscribes.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.defer(function () { return Rx.Observable.fromArray([1,2,3]); });    
        /// </summary>
        /// <param name="observableFactory">Observable factory function to invoke for each observer that subscribes to the resulting sequence.</param>
        /// <returns>An observable sequence whose observers trigger an invocation of the given observable factory function.</returns>
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

    var observableEmpty = Observable.empty = function (scheduler) {
        /// <summary>
        /// Returns an empty observable sequence, using the specified scheduler to send out the single OnCompleted message.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.empty();  
        /// &#10;2 - res = Rx.Observable.empty(Rx.Scheduler.timeout);  
        /// </summary>
        /// <param name="scheduler">Scheduler to send the termination call on.</param>
        /// <returns>An observable sequence with no elements.</returns>
        scheduler || (scheduler = immediateScheduler);
        return new AnonymousObservable(function (observer) {
            return scheduler.schedule(function () {
                observer.onCompleted();
            });
        });
    };

    var observableFromArray = Observable.fromArray = function (array, scheduler) {
        /// <summary>
        /// Converts an array to an observable sequence, using an optional scheduler to enumerate the array.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.fromArray([1,2,3]);
        /// &#10;2 - res = Rx.Observable.fromArray([1,2,3], Rx.Scheduler.timeout);
        /// </summary>
        /// <param name="scheduler">[Optional] Scheduler to run the enumeration of the input sequence on.</param>
        /// <returns>The observable sequence whose elements are pulled from the given enumerable sequence.</returns>
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

    Observable.generate = function (initialState, condition, iterate, resultSelector, scheduler) {
        /// <summary>
        /// Generates an observable sequence by running a state-driven loop producing the sequence's elements, using the specified scheduler to send out observer messages.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; });
        /// &#10;2 - res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; }, Rx.Scheduler.timeout);
        /// </summary>
        /// <param name="initialState">Initial state.</param>
        /// <param name="condition">Condition to terminate generation (upon returning false).</param>
        /// <param name="iterate">Iteration step function.</param>
        /// <param name="resultSelector">Selector function for results produced in the sequence.</param>
        /// <param name="scheduler">[Optional] Scheduler on which to run the generator loop. If not provided, defaults to Scheduler.currentThread.</param>
        /// <returns>The generated sequence.</returns>
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

    var observableNever = Observable.never = function () {
        /// <summary>
        /// Returns a non-terminating observable sequence, which can be used to denote an infinite duration (e.g. when using reactive joins).
        /// </summary>
        /// <returns>An observable sequence whose observers will never get called.</returns>
        return new AnonymousObservable(function () {
            return disposableEmpty;
        });
    };

    Observable.range = function (start, count, scheduler) {
        /// <summary>
        /// Generates an observable sequence of integral numbers within a specified range, using the specified scheduler to send out observer messages.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.range(0, 10);
        /// &#10;2 - res = Rx.Observable.range(0, 10, Rx.Scheduler.timeout);
        /// </summary>
        /// <param name="start">The value of the first integer in the sequence.</param>
        /// <param name="count">The number of sequential integers to generate.</param>
        /// <param name="scheduler">[Optional] Scheduler to run the generator loop on. If not specified, defaults to Scheduler.currentThread.</param>
        /// <returns>An observable sequence that contains a range of sequential integral numbers.</returns>
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

    Observable.repeat = function (value, repeatCount, scheduler) {
        /// <summary>
        /// Generates an observable sequence that repeats the given element the specified number of times, using the specified scheduler to send out observer messages.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.repeat(42);
        /// &#10;2 - res = Rx.Observable.repeat(42, 4);
        /// &#10;3 - res = Rx.Observable.repeat(42, 4, Rx.Scheduler.timeout);
        /// &#10;4 - res = Rx.Observable.repeat(42, null, Rx.Scheduler.timeout);
        /// </summary>
        /// <param name="value">Element to repeat.</param>
        /// <param name="repeatCount">[Optiona] Number of times to repeat the element. If not specified, repeats indefinitely.</param>
        /// <param name="scheduler">Scheduler to run the producer loop on. If not specified, defaults to Scheduler.immediate.</param>
        /// <returns>An observable sequence that repeats the given element the specified number of times.</returns>
        scheduler || (scheduler = currentThreadScheduler);
        if (repeatCount == undefined) {
            repeatCount = -1;
        }
        return observableReturn(value, scheduler).repeat(repeatCount);
    };

    var observableReturn = Observable.returnValue = function (value, scheduler) {
        /// <summary>
        /// Returns an observable sequence that contains a single element, using the specified scheduler to send out observer messages.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.returnValue(42);
        /// &#10;2 - res = Rx.Observable.returnValue(42, Rx.Scheduler.timeout);
        /// </summary>
        /// <param name="value">Single element in the resulting observable sequence.</param>
        /// <param name="scheduler">Scheduler to send the single element on. If not specified, defaults to Scheduler.immediate.</param>
        /// <returns>An observable sequence containing the single specified element.</returns>
        scheduler || (scheduler = immediateScheduler);
        return new AnonymousObservable(function (observer) {
            return scheduler.schedule(function () {
                observer.onNext(value);
                observer.onCompleted();
            });
        });
    };

    var observableThrow = Observable.throwException = function (exception, scheduler) {
        /// <summary>
        /// Returns an observable sequence that terminates with an exception, using the specified scheduler to send out the single OnError message.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.throwException(new Error('Error'));
        /// &#10;2 - res = Rx.Observable.throwException(new Error('Error'), Rx.Scheduler.timeout);
        /// </summary>
        /// <param name="exception">An object used for the sequence's termination.</param>
        /// <param name="scheduler">Scheduler to send the exceptional termination call on. If not specified, defaults to Scheduler.immediate.</param>
        /// <returns>The observable sequence that terminates exceptionally with the specified exception object.</returns>
        scheduler || (scheduler = immediateScheduler);
        return new AnonymousObservable(function (observer) {
            return scheduler.schedule(function () {
                observer.onError(exception);
            });
        });
    };

    Observable.using = function (resourceFactory, observableFactory) {
        /// <summary>
        /// Constructs an observable sequence that depends on a resource object, whose lifetime is tied to the resulting observable sequence's lifetime.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.using(function () { return new AsyncSubject(); }, function (s) { return s; });
        /// </summary>
        /// <param name="resourceFactory">Factory function to obtain a resource object.</param>
        /// <param name="observableFactory">Factory function to obtain an observable sequence that depends on the obtained resource.</param>
        /// <returns>An observable sequence whose lifetime controls the lifetime of the dependent resource object.</returns>
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
    observableProto.amb = function (rightSource) {
        /// <summary>
        /// Propagates the observable sequence that reacts first.
        /// </summary>
        /// <param name="rightSource">Second observable sequence.</param>
        /// <returns>An observable sequence that surfaces either of the given sequences, whichever reacted first.</returns>        
        var leftSource = this;
        return new AnonymousObservable(function (observer) {

            var choice,
                leftSubscription = new SingleAssignmentDisposable(),
                rightSubscription = new SingleAssignmentDisposable();

            function choiceL() {
                if (!choice) {
                    choice = 'L';
                    rightSubscription.dispose();
                }
            }

            function choiceR() {
                if (!choice) {
                    choice = 'R';
                    leftSubscription.dispose();
                }
            }

            leftSubscription.setDisposable(leftSource.subscribe(function (left) {
                choiceL();
                if (choice === 'L') {
                    observer.onNext(left);
                }
            }, function (err) {
                choiceL();
                if (choice === 'L') {
                    observer.onError(err);
                }
            }, function () {
                choiceL();
                if (choice === 'L') {
                    observer.onCompleted();
                }
            }));

            rightSubscription.setDisposable(rightSource.subscribe(function (right) {
                choiceR();
                if (choice === 'R') {
                    observer.onNext(right);
                }
            }, function (err) {
                choiceR();
                if (choice === 'R') {
                    observer.onError(err);
                }
            }, function () {
                choiceR();
                if (choice === 'R') {
                    observer.onCompleted();
                }
            }));

            return new CompositeDisposable(leftSubscription, rightSubscription);
        });
    };

    Observable.amb = function () {
        /// <summary>
        /// Propagates the observable sequence that reacts first.
        /// &#10;
        /// &#10;E.g. winner = Rx.Observable.amb(xs, ys, zs);
        /// </summary>
        /// <param name="arguments">Observable sources competing to react first.</param>
        /// <returns>An observable sequence that surfaces any of the given sequences, whichever reacted first.</returns>        
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

    observableProto.catchException = function (handlerOrSecond) {
        /// <summary>
        /// Continues an observable sequence that is terminated by an exception with the next observable sequence.
        /// &#10;
        /// &#10;1 - xs.catchException(ys)
        /// &#10;2 - xs.catchException(function (ex) { return ys(ex); })
        /// </summary>
        /// <param name="handlerOrSecond">Exception handler function that returns an observable sequence given the error that occurred in the first sequence, or a second observable sequence used to produce results when an error occurred in the first sequence.</param>
        /// <returns>An observable sequence containing the first sequence's elements, followed by the elements of the handler sequence in case an exception occurred.</returns>        
        if (typeof handlerOrSecond === 'function') {
            return observableCatchHandler(this, handlerOrSecond);
        }
        return observableCatch([this, handlerOrSecond]);
    };

    var observableCatch = Observable.catchException = function () {
        /// <summary>
        /// Continues an observable sequence that is terminated by an exception with the next observable sequence.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.catchException(/* argument list */ xs, ys, zs);
        /// &#10;2 - res = Rx.Observable.catchException(/* array */ [xs, ys, zs]);
        /// </summary>
        /// <param name="arguments">Observable sequences to catch exceptions for.</param>
        /// <returns>An observable sequence containing elements from consecutive source sequences until a source sequence terminates successfully.</returns>        
        var items = argsOrArray(arguments, 0);
        return enumerableFor(items).catchException();
    };

    observableProto.combineLatest = function () {
        /// <summary>
        /// Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences produces an element.
        /// &#10;
        /// &#10;1 - obs = observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
        /// </summary>
        /// <param name="resultSelector">Function to invoke whenever any of the sources produces an element.</param>
        /// <returns>An observable sequence containing the result of combining elements of the sources using the specified result selector function.</returns>        
        var parent = this, args = slice.call(arguments), resultSelector = args.pop();
        args.unshift(this);
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
                        res = resultSelector.apply(parent, values);
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

    observableProto.concat = function () {
        /// <summary>
        /// Concatenates all the observable sequences.  This takes in either an array or variable arguments to concatenate.
        /// &#10;
        /// &#10;1 - concatenated = xs.concat(/* argument list */ ys, zs);
        /// &#10;2 - concatenated = xs.concat(/* array */ [ys, zs]);
        /// </summary>
        /// <returns>An observable sequence that contains the elements of each given sequence, in sequential order.</returns>        
        var items = slice.call(arguments, 0);
        items.unshift(this);
        return observableConcat.apply(this, items);
    };

    var observableConcat = Observable.concat = function () {
        /// <summary>
        /// Concatenates all the observable sequences.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.concat(/* argument list */ xs, ys, zs);
        /// &#10;2 - res = Rx.Observable.concat(/* array */ [xs, ys, zs]);
        /// </summary>
        /// <param name="arguments">Observable sequences to concatenate.</param>
        /// <returns>An observable sequence that contains the elements of each given sequence, in sequential order.</returns>        
        var sources = argsOrArray(arguments, 0);
        return enumerableFor(sources).concat();
    };

    observableProto.concatObservable = function () {
        /// <summary>
        /// Concatenates an observable sequence of observable sequences.
        /// </summary>
        /// <returns>An observable sequence that contains the elements of each observed inner sequence, in sequential order.</returns>        
        return this.merge(1);
    };

    observableProto.merge = function (maxConcurrentOrOther) {
        /// <summary>
        /// Merges an observable sequence of observable sequences into an observable sequence, limiting the number of concurrent subscriptions to inner sequences.
        /// Or merges two observable sequences into a single observable sequence.
        /// &#10;
        /// &#10;1 - merged = sources.merge(1);
        /// &#10;2 - merged = source.merge(otherSource);  
        /// </summary>
        /// <param name="maxConcurrentOrOther">[Optional] Maximum number of inner observable sequences being subscribed to concurrently or the second observable sequence.</param>
        /// <returns>The observable sequence that merges the elements of the inner sequences.</returns>        
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

    var observableMerge = Observable.merge = function () {
        /// <summary>
        /// Merges all the observable sequences into a single observable sequence.
        /// &#10;
        /// &#10;1 - merged = Rx.Observable.merge(/* argument list */ xs, ys, zs);
        /// &#10;2 - merged = Rx.Observable.merge(/* array */ [xs, ys, zs]);
        /// &#10;3 - merged = Rx.Observable.merge(scheduler, /* argument list */ xs, ys, zs);
        /// &#10;4 - merged = Rx.Observable.merge(scheduler, /* array */ [xs, ys, zs]);    
        /// </summary>
        /// <param name="scheduler">[Optional] Scheduler to run the enumeration of the sequence of sources on. If not specified, the immediate scheduler is used.</param>
        /// <param name="arguments">Observable sequences to merge.</param>
        /// <returns>The observable sequence that merges the elements of the observable sequences.</returns>        
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

    observableProto.mergeObservable = function () {
        /// <summary>
        /// Merges an observable sequence of observable sequences into an observable sequence.
        /// </summary>
        /// <returns>The observable sequence that merges the elements of the inner sequences.</returns>        
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

    observableProto.onErrorResumeNext = function (second) {
        /// <summary>
        /// Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
        /// </summary>
        /// <param name="second">Second observable sequence used to produce results after the first sequence terminates.</param>
        /// <returns>An observable sequence that concatenates the first and second sequence, even if the first sequence terminates exceptionally.</returns>        
        if (!second) {
            throw new Error('Second observable is required');
        }
        return onErrorResumeNext([this, second]);
    };

    var onErrorResumeNext = Observable.onErrorResumeNext = function () {
        /// <summary>
        /// Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.onErrorResumeNext(/* argument list */ xs, ys, zs);
        /// &#10;1 - res = Rx.Observable.onErrorResumeNext(/* array */ [xs, ys, zs]);
        /// </summary>
        /// <param name="arguments">Observable sequences to concatenate.</param>
        /// <returns>An observable sequence that concatenates the source sequences, even if a sequence terminates exceptionally.</returns>        
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

    observableProto.skipUntil = function (other) {
        /// <summary>
        /// Returns the values from the source observable sequence only after the other observable sequence produces a value.
        /// </summary>
        /// <param name="other">The observable sequence that triggers propagation of elements of the source sequence.</param>
        /// <returns>An observable sequence containing the elements of the source sequence starting from the point the other sequence triggered propagation.</returns>        
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

    observableProto.switchLatest = function () {
        /// <summary>
        /// Transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.
        /// </summary>
        /// <returns>The observable sequence that at any point in time produces the elements of the most recent inner observable sequence that has been received.</returns>        
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

    observableProto.takeUntil = function (other) {
        /// <summary>
        /// Returns the values from the source observable sequence until the other observable sequence produces a value.
        /// </summary>
        /// <param name="other">Observable sequence that terminates propagation of elements of the source sequence.</param>
        /// <returns>An observable sequence containing the elements of the source sequence up to the point the other sequence interrupted further propagation.</returns>        
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

    observableProto.zip = function () {
        /// <summary>
        /// Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
        /// &#10;
        /// &#10;1 - res = obs1.zip(obs2, fn);
        /// &#10;1 - res = x1.zip([1,2,3], fn);  
        /// </summary>
        /// <param name="resultSelector">Function to invoke for each series of elements at corresponding indexes in the sources.</param>
        /// <returns>An observable sequence containing the result of combining elements of the sources using the specified result selector function.</returns>        
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
    observableProto.asObservable = function () {
        /// <summary>
        /// Hides the identity of an observable sequence.
        /// </summary>
        /// <returns>An observable sequence that hides the identity of the source sequence.</returns>        
        var source = this;
        return new AnonymousObservable(function (observer) {
            return source.subscribe(observer);
        });
    };

    observableProto.bufferWithCount = function (count, skip) {
        /// <summary>
        /// Projects each element of an observable sequence into zero or more buffers which are produced based on element count information.
        /// &#10;
        /// &#10;1 - xs.bufferWithCount(10);
        /// &#10;2 - xs.bufferWithCount(10, 1);
        /// </summary>
        /// <param name="count">Length of each buffer.</param>
        /// <param name="skip">[Optional] Number of elements to skip between creation of consecutive buffers. If not provided, defaults to the count.</param>
        /// <returns>An observable sequence of buffers.</returns>        
        if (skip === undefined) {
            skip = count;
        }
        return this.windowWithCount(count, skip).selectMany(function (x) {
            return x.toArray();
        }).where(function (x) {
            return x.length > 0;
        });
    };

    observableProto.dematerialize = function () {
        /// <summary>
        /// Dematerializes the explicit notification values of an observable sequence as implicit notifications.
        /// </summary>
        /// <returns>An observable sequence exhibiting the behavior corresponding to the source sequence's notification values.</returns>        
        var source = this;
        return new AnonymousObservable(function (observer) {
            return source.subscribe(function (x) {
                return x.accept(observer);
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    observableProto.distinctUntilChanged = function (keySelector, comparer) {
        /// <summary>
        /// Returns an observable sequence that contains only distinct contiguous elements according to the keySelector and the comparer.
        /// &#10;
        /// &#10;1 - var obs = observable.distinctUntilChanged();
        /// &#10;2 - var obs = observable.distinctUntilChanged(function (x) { return x.id; });
        /// &#10;3 - var obs = observable.distinctUntilChanged(function (x) { return x.id; }, function (x, y) { return x === y; });
        /// </summary>
        /// <param name="keySelector">[Optional] A function to compute the comparison key for each element. If not provided, it projects the value.</param>
        /// <param name="comparer">[Optional] Equality comparer for computed key values. If not provided, defaults to an equality comparer function.</param>
        /// <returns>An observable sequence only containing the distinct contiguous elements, based on a computed key value, from the source sequence.</returns>        
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

    observableProto.doAction = function (observerOrOnNext, onError, onCompleted) {
        /// <summary>
        /// Invokes an action for each element in the observable sequence and invokes an action upon graceful or exceptional termination of the observable sequence.
        /// This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
        /// &#10;
        /// &#10;1 - observable.doAction(observer);
        /// &#10;2 - observable.doAction(onNext);
        /// &#10;3 - observable.doAction(onNext, onError);
        /// &#10;4 - observable.doAction(onNext, onError, onCompleted);
        /// </summary>
        /// <param name="observerOrOnNext">Action to invoke for each element in the observable sequence or an observer.</param>
        /// <param name="onError">[Optional] Action to invoke upon exceptional termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.</param>
        /// <param name="onCompleted">[Optional] Action to invoke upon graceful termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.</param>
        /// <returns>The source sequence with the side-effecting behavior applied.</returns>        
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

    observableProto.finallyAction = function (action) {
        /// <summary>
        /// Invokes a specified action after the source observable sequence terminates gracefully or exceptionally.
        /// &#10;
        /// &#10;1 - obs = observable.finallyAction(function () { console.log('sequence ended'; });
        /// </summary>
        /// <param name="finallyAction">Action to invoke after the source observable sequence terminates.</param>
        /// <returns>Source sequence with the action-invoking termination behavior applied.</returns>        
        var source = this;
        return new AnonymousObservable(function (observer) {
            var subscription = source.subscribe(observer);
            return disposableCreate(function () {
                try {
                    subscription.dispose();
                } finally {
                    action();
                }
            });
        });
    };

    observableProto.ignoreElements = function () {
        /// <summary>
        /// Ignores all elements in an observable sequence leaving only the termination messages.
        /// </summary>
        /// <returns>An empty observable sequence that signals termination, successful or exceptional, of the source sequence.</returns>        
        var source = this;
        return new AnonymousObservable(function (observer) {
            return source.subscribe(noop, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    observableProto.materialize = function () {
        /// <summary>
        /// Materializes the implicit notifications of an observable sequence as explicit notification values.
        /// </summary>
        /// <returns>An observable sequence containing the materialized notification values from the source sequence.</returns>        
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

    observableProto.repeat = function (repeatCount) {
        /// <summary>
        /// Repeats the observable sequence a specified number of times. If the repeat count is not specified, the sequence repeats indefinitely.
        /// &#10;
        /// &#10;1 - repeated = source.repeat();
        /// &#10;2 - repeated = source.repeat(42);
        /// </summary>
        /// <param name="repeatCount">[Optional] Number of times to repeat the sequence. If not provided, repeats the sequence indefinitely.</param>
        /// <returns>The observable sequence producing the elements of the given sequence repeatedly.</returns>        
        return enumerableRepeat(this, repeatCount).concat();
    };

    observableProto.retry = function (retryCount) {
        /// <summary>
        /// Repeats the source observable sequence the specified number of times or until it successfully terminates. If the retry count is not specified, it retries indefinitely.
        /// &#10;
        /// &#10;1 - retried = retry.repeat();
        /// &#10;2 - retried = retry.repeat(42);
        /// </summary>
        /// <param name="retryCount">[Optional] Number of times to retry the sequence. If not provided, retry the sequence indefinitely.</param>
        /// <returns>An observable sequence producing the elements of the given sequence repeatedly until it terminates successfully.</returns>        
        return enumerableRepeat(this, retryCount).catchException();
    };

    observableProto.scan = function () {
        /// <summary>
        /// Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.
        /// For aggregation behavior with no intermediate results, see Observable.aggregate.
        /// &#10;
        /// &#10;1 - scanned = source.scan(function (acc, x) { return acc + x; });
        /// &#10;2 - scanned = source.scan(0, function (acc, x) { return acc + x; });
        /// </summary>
        /// <param name="seed">[Optional] The initial accumulator value.</param>
        /// <param name="accumulator">An accumulator function to be invoked on each element.</param>
        /// <returns>An observable sequence containing the accumulated values.</returns>        
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

    observableProto.skipLast = function (count) {
        /// <summary>
        /// Bypasses a specified number of elements at the end of an observable sequence.
        /// </summary>
        /// <param name="count">Number of elements to bypass at the end of the source sequence.</param>
        /// <returns>An observable sequence containing the source sequence elements except for the bypassed ones at the end.</returns>
        /// <remarks>
        /// This operator accumulates a queue with a length enough to store the first <paramref name="count"/> elements. As more elements are
        /// received, elements are taken from the front of the queue and produced on the result sequence. This causes elements to be delayed.
        /// </remarks>        
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

    observableProto.startWith = function () {
        /// <summary>
        /// Prepends a sequence of values to an observable sequence with an optional scheduler and an argument list of values to prepend.
        /// &#10;
        /// &#10;1 - source.startWith(1, 2, 3);
        /// &#10;2 - source.startWith(Rx.Scheduler.timeout, 1, 2, 3);
        /// </summary>
        /// <returns>The source sequence prepended with the specified values.</returns>        
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

    observableProto.takeLast = function (count, scheduler) {
        /// <summary>
        /// Returns a specified number of contiguous elements from the end of an observable sequence, using an optional scheduler to drain the queue.
        /// &#10;
        /// &#10;1 - obs = source.takeLast(5);
        /// &#10;2 - obs = source.takeLast(5, Rx.Scheduler.timeout);
        /// </summary>
        /// <param name="count">Number of elements to take from the end of the source sequence.</param>
        /// <param name="scheduler">[Optional] Scheduler used to drain the queue upon completion of the source sequence.</param>
        /// <returns>An observable sequence containing the specified number of elements from the end of the source sequence.</returns>
        /// <remarks>
        /// This operator accumulates a buffer with a length enough to store elements <paramref name="count"/> elements. Upon completion of
        /// the source sequence, this buffer is drained on the result sequence. This causes the elements to be delayed.
        /// </remarks>        
        return this.takeLastBuffer(count).selectMany(function (xs) { return observableFromArray(xs, scheduler); });
    };

    observableProto.takeLastBuffer = function (count) {
        /// <summary>
        /// Returns an array with the specified number of contiguous elements from the end of an observable sequence.
        /// </summary>
        /// <param name="count">Number of elements to take from the end of the source sequence.</param>
        /// <returns>An observable sequence containing a single array with the specified number of elements from the end of the source sequence.</returns>
        /// <remarks>
        /// This operator accumulates a buffer with a length enough to store <paramref name="count"/> elements. Upon completion of the
        /// source sequence, this buffer is produced on the result sequence.
        /// </remarks>        
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

    observableProto.windowWithCount = function (count, skip) {
        /// <summary>
        /// Projects each element of an observable sequence into zero or more windows which are produced based on element count information.
        /// &#10;
        /// &#10;1 - xs.windowWithCount(10);
        /// &#10;2 - xs.windowWithCount(10, 1);
        /// </summary>
        /// <param name="count">Length of each window.</param>
        /// <param name="skip">[Optional] Number of elements to skip between creation of consecutive windows. If not specified, defaults to the count.</param>
        /// <returns>An observable sequence of windows.</returns>        
        var source = this;
        if (count <= 0) {
            throw new Error(argumentOutOfRange);
        }
        if (skip === undefined) {
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
            } finally {
                if (!noError) {
                    this.dispose();
                }
            }
        };
        AutoDetachObserver.prototype.error = function (exn) {
            try {
                this.observer.onError(exn);
            } finally {
                this.dispose();
            }
        };
        AutoDetachObserver.prototype.completed = function () {
            try {
                this.observer.onCompleted();
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
        function Subject() {
            /// <summary>
            /// Creates a subject.
            /// </summary>
            Subject.super_.constructor.call(this, subscribe);
            this.isDisposed = false,
            this.isStopped = false,
            this.observers = [];
        }

        addProperties(Subject.prototype, Observer, {
            onCompleted: function () {
                /// <summary>
                /// Notifies all subscribed observers of the end of the sequence.
                /// </summary>
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
                /// <summary>
                /// Notifies all subscribed observers with the exception.
                /// </summary>
                /// <param name="error">The exception to send to all subscribed observers.</param>
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
                /// <summary>
                /// Notifies all subscribed observers with the value.
                /// </summary>
                /// <param name="value">The value to send to all subscribed observers.</param>
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var os = this.observers.slice(0);
                    for (var i = 0, len = os.length; i < len; i++) {
                        os[i].onNext(value);
                    }
                }
            },
            dispose: function () {
                /// <summary>
                /// Unsubscribe all observers and release resources.
                /// </summary>
                this.isDisposed = true;
                this.observers = null;
            }
        });

        Subject.create = function (observer, observable) {
            /// <summary>
            /// Creates a subject from the specified observer and observable.
            /// </summary>
            /// <param name="observer">The observer used to publish messages to the subject.</param>
            /// <param name="observable">The observable used to subscribe to messages sent from the subject.</param>
            /// <returns>Subject implemented using the given observer and observable.</returns>
            return new AnonymousSubject(observer, observable);
        };

        return Subject;
    }());

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