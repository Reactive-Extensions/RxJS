/**
* @preserve Copyright (c) Microsoft Corporation.  All rights reserved.
* This code is licensed by Microsoft Corporation under the terms
* of the MICROSOFT REACTIVE EXTENSIONS FOR JAVASCRIPT AND .NET LIBRARIES License.
* See http://go.microsoft.com/fwlink/?LinkID=220762.
*/

(function (global, _undefined) {
    'use strict';
    var root,
        nothing = function() {
            return;
        },
        defaultNow = function() {
            return new Date().getTime();
        },
        defaultComparer = function(a, b) {
            return a === b;
        },
        identity = function(x) {
            return x;
        },
        defaultKeySerializer = function(x) {
            return x.toString();
        },
        hasProp = Object.prototype.hasOwnProperty,
        inherits = function (child, parent) {
            for (var key in parent) {
                if (hasProp.call(parent, key)) {
                    child[key] = parent[key];
                }
            }
            function ctor() { this.constructor = child; }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor;
            child.base = parent.prototype;
            return child;
        },
        extendObject = function (child, parent) {
            for (var key in parent) {
                if (hasProp.call(parent, key)) {
                    child[key] = parent[key];
                }
            }
        },       
        slice = Array.prototype.slice,
        argumentOutOfRange = 'Argument out of range',
        objectDisposed = 'Object has been disposed';

    if (typeof global.module !== 'undefined' && typeof global.exports !== 'undefined') {
        root = global.module.exports;
    } else {
        root = global.Rx = {};
    }

    root.VERSION = '1.0.10621';

var cloneArray = function (arr) {
    var duplicate, i;
    duplicate = [];
    for (i = 0; i < arr.length; i++) {
        duplicate.push(arr[i]);
    }
    return duplicate;
},
List = root.List = (function () {
    function List(comparer) {
        this.comparer = comparer || defaultComparer;
        this.size = 0;
        this.items = [];
    }
    List.fromArray = function (array, comparer) {
        var i, len = array.length, l = new List(comparer);
        for (i = 0; i < len; i++) {
            l.add(array[i]);
        }
        return l;
    };
    List.prototype.count = function() { return this.size; };
    List.prototype.add = function (item) {
        this.items[this.size] = item;
        this.size++;
    };
    List.prototype.removeAt = function (index) {
        if (index < 0 || index >= this.size) {
            throw new Error(argumentOutOfRange);
        }
        if (index === 0) {
            this.items.shift();
            this.size--;
        } else {
            this.items.splice(index, 1);
            this.size--;
        }
    };
    List.prototype.indexOf = function (item) {
        var i, localItem;
        for (i = 0; i < this.items.length; i++) {
            localItem = this.items[i];
            if (this.comparer(item, localItem)) {
                return i;
            }
        }
        return -1;
    };
    List.prototype.remove = function (item) {
        var index = this.indexOf(item);
        if (index === -1) {
            return false;
        }
        this.removeAt(index);
        return true;
    };
    List.prototype.clear = function () {
        this.items = [];
        this.size = 0;
    };
    List.prototype.item = function (index, value) {
        if (index < 0 || index >= count) {
            throw new Error(argumentOutOfRange);
        }
        if (value === _undefined) {
            return this.items[index];
        } else {
            this.items[index] = value;
        }
    };
    List.prototype.toArray = function () {
        var result = [], i;
        for (i = 0; i < this.items.length; i++) {
            result.push(this.items[i]);
        }
        return result;
    };
    List.prototype.contains = function (item) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.comparer(item, this.items[i])) {
                return true;
            }
        }
        return false;
    };
    return List;
})();
var copyArray = function (sourceArray, sourceIndex, destinationArray, destinationIndex, count) {
    var idx = count;
    while (idx > 0) {
        destinationArray[idx + destinationIndex - 1] = sourceArray[idx + sourceIndex - 1];
        idx--;
    }
},
IndexedItem = (function () {
    function IndexedItem(id, value) {
        this.id = id;
        this.value = value;
    }
    IndexedItem.prototype.compareTo = function (other) {
        var c = this.value.compareTo(other.value);
        if (c === 0) {
            c = this.id - other.id;
        }
        return c;
    };
    return IndexedItem;
})(),
PriorityQueue = (function () {
    function PriorityQueue(capacity) {
        this.items = new Array(capacity);
        this.size = 0;
    }
	PriorityQueue.prototype.count = function () {
		return this.size;
	};
    PriorityQueue.prototype.isHigherPriority = function (left, right) {
        return this.items[left].compareTo(this.items[right]) < 0;
    };
    PriorityQueue.prototype.percolate = function (index) {
        var parent, temp;
        if (index >= this.size || index < 0) {
            return;
        }
        parent = Math.floor((index - 1) / 2);
        if (parent < 0 || parent === index) {
            return;
        }
        if (this.isHigherPriority(index, parent)) {
            temp = this.items[index];
            this.items[index] = this.items[parent];
            this.items[parent] = temp;
            this.percolate(parent);
        }
    };
    PriorityQueue.prototype.heapify = function (index) {
        var first, left, right, temp;
        if (index === _undefined) {
            index = 0;
        }
        if (index >= this.size || index < 0) {
            return;
        }
        left = 2 * index + 1;
        right = 2 * index + 2;
        first = index;
        if (left < this.size && this.isHigherPriority(left, first)) {
            first = left;
        }
        if (right < this.size && this.isHigherPriority(right, first)) {
            first = right;
        }
        if (first !== index) {
            temp = this.items[index];
            this.items[index] = this.items[first];
            this.items[first] = temp;
            this.heapify(first);
        }
    };
    PriorityQueue.prototype.peek = function () {
        return this.items[0].value;
    };
    PriorityQueue.prototype.removeAt = function (index) {
        var temp;
        this.items[index] = this.items[--this.size];
        delete this.items[this.size];
        this.heapify();
        if (this.size < this.items.length >> 2) {
            temp = this.items;
            this.items = new Array(this.items.length >> 1);
            copyArray(temp, 0, this.items, 0, this.size);
        }
    };
    PriorityQueue.prototype.dequeue = function () {
        var result = this.peek();
        this.removeAt(0);
        return result;
    };
    PriorityQueue.prototype.enqueue = function (item) {
        var index, temp;
        if (this.size >= this.items.length) {
            temp = this.items;
            this.items = new Array(this.items.length * 2);
            copyArray(temp, 0, this.items, 0, temp.length);
        }
        index = this.size++;
        this.items[index] = new IndexedItem(PriorityQueue.count++, item);
        this.percolate(index);
    };
    PriorityQueue.prototype.remove = function (item) {
        var i;
        for (i = 0; i < this.size; i++) {
            if (this.items[i].value === item) {
                this.removeAt(i);
                return true;
            }
        }
        return false;
    };
    PriorityQueue.count = 0;
    
    return PriorityQueue;
})();

var CompositeDisposable = root.CompositeDisposable = (function () {
    function CompositeDisposable() {
        this.disposed = false;
        this.disposables = List.fromArray(slice.call(arguments));
    }
    CompositeDisposable.prototype.count = function () {
        return this.disposables.count();
    };
    CompositeDisposable.prototype.add = function (item) {
        if (this.disposed) {
            item.dispose();
        } else {
            this.disposables.add(item);
        }
    };
    CompositeDisposable.prototype.remove = function (item) {
        var shouldDispose = false;
        if (!this.disposed) {
            shouldDispose = this.disposables.remove(item);
        }
        if (shouldDispose) {
            item.dispose();
        }
        return shouldDispose;
    };
    CompositeDisposable.prototype.dispose = function () {
        var currentDisposables, i;
        if (!this.disposed) {
            this.disposed = true;
            currentDisposables = this.disposables.toArray();
            this.disposables.clear();
        }
        if (currentDisposables !== _undefined) {
            for (i = 0; i < currentDisposables.length; i++) {
                currentDisposables[i].dispose();
            }
        }
    };
    CompositeDisposable.prototype.clear = function () {
        var currentDisposables, i;
        currentDisposables = this.disposables.toArray();
        this.disposables.clear();
        for (i = 0; i < currentDisposables.length; i++) {
            currentDisposables[i].dispose();
        }
    };
    CompositeDisposable.prototype.contains = function (item) {
        return this.disposables.contains(item);
    };
    CompositeDisposable.prototype.isDisposed = function () {
        return this.disposed;
    };
    CompositeDisposable.prototype.toArray = function () {
        return this.disposables.toArray();
    };
    return CompositeDisposable;
})();
var Disposable = root.Disposable = {
    create: function (action) {
        return {
            isDisposed: false,
            dispose: function () {
                if (!this.isDisposed) {
                    action();
                    this.isDisposed = true;
                }
            }
        };
    },
    empty: {
        dispose: function () { }
    }
},
disposableCreate = Disposable.create,
disposableEmpty = Disposable.empty;
var SingleAssignmentDisposable = root.SingleAssignmentDisposable = (function () {
    function SingleAssignmentDisposable() {
        this.disposed = false;
        this.current = null;
    }
    SingleAssignmentDisposable.prototype.isDisposed = function () {
        return this.disposed;
    };
    SingleAssignmentDisposable.prototype.disposable = function (value) {
        var shouldDispose;
        if (value === _undefined) {
            return this.current;
        } else {
            if (this.current !== null) {
                throw new Error('Disposable has already been assigned');
            }
            shouldDispose = this.disposed;
            if (!shouldDispose) {
                this.current = value;
            }
            if (shouldDispose && value !== null) {
                value.dispose();
            }
        }
    };
    SingleAssignmentDisposable.prototype.dispose = function () {
        var old = null;
        if (!this.disposed) {
            this.disposed = true;
            old = this.current;
            this.current = null;
        }
        if (old !== null) {
            old.dispose();
        }
    };
    return SingleAssignmentDisposable;
})();
var SerialDisposable = root.SerialDisposable = (function () {
    function SerialDisposable() {
        this.disposed = false;
        this.current = null;
    }
    SerialDisposable.prototype.isDisposed = function () {
        return this.disposed;
    };
    SerialDisposable.prototype.disposable = function (value) {
        var old, shouldDispose;
        if (value === _undefined) {
            return this.current;
        } else {
            shouldDispose = this.disposed;
            old = null;
            if (!shouldDispose) {
                old = this.current;
                this.current = value;
            }
            if (old !== null) {
                old.dispose();
            }
            if (shouldDispose && value !== null) {
                value.dispose();
            }
        }
    };
    SerialDisposable.prototype.dispose = function () {
        var old = null;
        if (!this.disposed) {
            this.disposed = true;
            old = this.current;
            this.current = null;
        }
        if (old !== null) {
            old.dispose();
        }
    };
    return SerialDisposable;
})();
var InnerDisposable = (function () {
    function InnerDisposable(disposable) {
        this.disposable = disposable;
        this.isInnerDisposed = false;
        this.disposable.count++;
    }
    InnerDisposable.prototype.dispose = function () {
        var shouldDispose = false;
        if (!this.disposable.isUnderlyingDisposed) {
            if (!this.isInnerDisposed) {
                this.isInnerDisposed = true;
                this.disposable.count--;
                if (this.disposable.count === 0 && this.disposable.isPrimaryDisposed) {
                    this.disposable.isUnderlyingDisposed = true;
                    shouldDispose = true;
                }
            }
        }
        if (shouldDispose) {
            this.disposable.underlyingDisposable.dispose();
        }
    };
    return InnerDisposable;
})(),
RefCountDisposable = root.RefCountDisposable = (function () {
    function RefCountDisposable(disposable) {
        this.underlyingDisposable = disposable;
        this.isUnderlyingDisposed = false;
        this.isPrimaryDisposed = false;
        this.count = 0;
    }
    RefCountDisposable.prototype.dispose = function () {
        var shouldDispose = false;
        if (!this.isUnderlyingDisposed) {
            if (!this.isPrimaryDisposed) {
                this.isPrimaryDisposed = true;
                if (this.count === 0) {
                    this.isUnderlyingDisposed = true;
                    shouldDispose = true;
                }
            }
        }
        if (shouldDispose) {
            this.underlyingDisposable.dispose();
        }
    };
    RefCountDisposable.prototype.getDisposable = function () {
        if (this.isUnderlyingDisposed) {
            return disposableEmpty;
        } else {
            return new InnerDisposable(this);
        }
    };
    RefCountDisposable.prototype.isDisposed = function () {
        return this.isUnderlyingDisposed;
    };
    return RefCountDisposable;
})();

var ScheduledItem;
ScheduledItem = (function () {
    function ScheduledItem(scheduler, state, action, dueTime, comparer) {
        this.scheduler = scheduler;
        this.state = state;
        this.action = action;
        this.dueTime = dueTime;
        this.comparer = comparer || function (a, b) {
            return a - b;
        };
        this.disposable = new SingleAssignmentDisposable();
    }
    ScheduledItem.prototype.invoke = function () {
        return this.disposable.disposable(this.invokeCore());
    };
    ScheduledItem.prototype.compareTo = function (other) {
        return this.comparer(this.dueTime, other.dueTime);
    };
    ScheduledItem.prototype.isCancelled = function () {
        return this.disposable.isDisposed();
    };
    ScheduledItem.prototype.invokeCore = function () {
        return this.action(this.scheduler, this.state);
    };
    return ScheduledItem;
})();
var Scheduler = root.Scheduler = (function () {
    function Scheduler(now, schedule, scheduleRelative, scheduleAbsolute) {
        this.now = now;
        this._schedule = schedule;
        this._scheduleRelative = scheduleRelative;
        this._scheduleAbsolute = scheduleAbsolute;
    }
    Scheduler.prototype.schedule = function (action) {
        return this._schedule(action, Scheduler.invoke);
    };
    Scheduler.prototype.scheduleWithState = function (state, action) {
        return this._schedule(state, action);
    };
    Scheduler.prototype.scheduleWithRelative = function (dueTime, action) {
        return this._scheduleRelative(action, dueTime, Scheduler.invoke);
    };
    Scheduler.prototype.scheduleWithRelativeAndState = function (state, dueTime, action) {
        return this._scheduleRelative(state, dueTime, action);
    };
    Scheduler.prototype.scheduleWithAbsolute = function (dueTime, action) {
        return this._scheduleAbsolute(action, dueTime, Scheduler.invoke);
    };
    Scheduler.prototype.scheduleWithAbsoluteAndState = function (state, dueTime, action) {
        return this._scheduleAbsolute(state, dueTime, action);
    };
    Scheduler.prototype.scheduleRecursive = function (action) {
        return this.scheduleRecursiveWithState(action, function (_action, self) {
            _action(function () {
                self(_action);
            });
        });
    };
    Scheduler.prototype.scheduleRecursiveWithState = function (state, action) {
        var pair;
        pair = {
            first: state,
            second: action
        };
        return this.scheduleWithState(pair, function (s, p) {
            return Scheduler._invokeRec1(s, p);
        });
    };
    Scheduler.prototype.scheduleRecursiveWithRelative = function (dueTime, action) {
        return this.scheduleRecursiveWithRelativeAndState(action, dueTime, function (_action, self) {
            _action(function (dt) {
                self(_action, dt);
            });
        });
    };
    Scheduler.prototype.scheduleRecursiveWithRelativeAndState = function (state, dueTime, action) {
        var pair;
        pair = {
            first: state,
            second: action
        };
        return this._scheduleRelative(pair, dueTime, function (s, p) {
            return Scheduler._invokeRec2(s, p);
        });
    };
    Scheduler.prototype.scheduleRecursiveWithAbsolute = function (dueTime, action) {
        return this.scheduleRecursiveWithAbsoluteAndState(action, dueTime, function (_action, self) {
            _action(function (dt) {
                self(_action, dt);
            });
        });
    };
    Scheduler.prototype.scheduleRecursiveWithAbsoluteAndState = function (state, dueTime, action) {
        var pair;
        pair = {
            first: state,
            second: action
        };
        return this._scheduleAbsolute(pair, dueTime, function (s, p) {
            return Scheduler._invokeRec3(s, p);
        });
    };

    Scheduler.now = defaultNow;
    Scheduler.normalize = function (timeSpan) {
        if (timeSpan < 0) {
            timeSpan = 0;
        }
        return timeSpan;
    };
    Scheduler.invoke = function (scheduler, action) {
        action();
        return disposableEmpty;
    };
    Scheduler._invokeRec1 = function (scheduler, pair) {
        var action, group, recursiveAction, state;
        group = new CompositeDisposable();
        state = pair.first;
        action = pair.second;
        recursiveAction = null;
        recursiveAction = function (state1) {
            action(state1, function (state2) {
                var d, isAdded, isDone;
                isAdded = false;
                isDone = false;
                d = null;
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
    };
    Scheduler._invokeRec2 = function (scheduler, pair) {
        var action, group, recursiveAction, state;
        group = new CompositeDisposable();
        state = pair.first;
        action = pair.second;
        recursiveAction = function (state1) {
            action(state1, function (state2, dueTime1) {
                var d, isAdded, isDone;
                isAdded = false;
                isDone = false;
                d = scheduler.scheduleWithRelativeAndState(state2, dueTime1, function (scheduler1, state3) {
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
    };
    Scheduler._invokeRec3 = function (scheduler, pair) {
        var action, group, recursiveAction, state;
        group = new CompositeDisposable();
        state = pair.first;
        action = pair.second;
        recursiveAction = function (state1) {
            action(state1, function (state2, dueTime1) {
                var isAdded = false, 
                    isDone = false,
                    d = scheduler.scheduleWithAbsoluteAndState(state2, dueTime1, function (scheduler1, state3) {
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
    };

    Scheduler.create = function (now, schedule, scheduleRelative, scheduleAbsolute) {
        var AnonymousScheduler = (function () {
            inherits(AnonymousScheduler, Scheduler);
            function AnonymousScheduler() {
                AnonymousScheduler.base.constructor.apply(this, arguments);
            }
            return AnonymousScheduler;
        })();
        return new AnonymousScheduler(now, schedule, scheduleRelative, scheduleAbsolute);
    };

    return Scheduler;
})();

var ImmediateScheduler = (function () {
    inherits(ImmediateScheduler, Scheduler);
    function ImmediateScheduler() {
        var scheduler = this;
        ImmediateScheduler.base.constructor.call(this, defaultNow, function (state, action) {
            return action(scheduler, state);
        }, function (state, dueTime, action) {
            while (Scheduler.normalize(dueTime) > 0) {
            }
            return action(scheduler, state);
        }, function (state, dueTime, action) {
            return scheduler.scheduleWithRelativeAndState(state, dueTime - scheduler.now(), action);
        });
    }
    return ImmediateScheduler;
})(),
immediateScheduler = Scheduler.Immediate = new ImmediateScheduler();
var Trampoline = (function () {
    function Trampoline() {
        CurrentThreadScheduler.queue = new PriorityQueue(4);
    }
    Trampoline.prototype.dispose = function () {
        CurrentThreadScheduler.queue = null;
    };
    Trampoline.prototype.run = function () {
        var item, queue = CurrentThreadScheduler.queue;
        while (queue.count() > 0) {
            item = queue.dequeue();
            if (!item.isCancelled()) {
                while (item.dueTime - Scheduler.now() > 0) { }
                if (!item.isCancelled()) {
                    item.invoke();
                }
            }
        }
    };
    return Trampoline;
})(),
CurrentThreadScheduler = (function () {
    inherits(CurrentThreadScheduler, Scheduler);
    function CurrentThreadScheduler() {
        var scheduler = this;
        CurrentThreadScheduler.base.constructor.call(this, defaultNow, function (state, action) {
            return scheduler.scheduleWithRelativeAndState(state, 0, action);
        }, function (state, dueTime, action) {
            var dt = scheduler.now() + Scheduler.normalize(dueTime),
                queue = CurrentThreadScheduler.queue,
                si = new ScheduledItem(scheduler, state, action, dt), 
                t;
            if (queue === null) {
                t = new Trampoline();
                try {
                    CurrentThreadScheduler.queue.enqueue(si);
                    t.run();
                } finally {
                    t.dispose();
                }
            } else {
                queue.enqueue(si);
            }
            return si.disposable;
        }, function (state, dueTime, action) {
            return scheduler.scheduleWithRelativeAndState(state, dueTime - scheduler.now(), action);
        });
    }
    CurrentThreadScheduler.prototype.scheduleRequired = function () {
        return CurrentThreadScheduler.queue === null;
    };
    CurrentThreadScheduler.prototype.ensureTrampoline = function (action) {
        if (this.scheduleRequired()) {
            return this.schedule(action);
        } else {
            return action();
        }
    };
    CurrentThreadScheduler.queue = null;

    return CurrentThreadScheduler;
})(),
currentThreadScheduler = Scheduler.CurrentThread = new CurrentThreadScheduler();
var VirtualTimeScheduler = root.VirtualTimeScheduler = (function () {
    inherits(VirtualTimeScheduler, Scheduler);
    function VirtualTimeScheduler(initialClock, comparer) {
        var scheduler = this;
        this.clock = initialClock;
        this.comparer = comparer;
        this.isEnabled = false;
        VirtualTimeScheduler.base.constructor.call(this, function () {
            return scheduler.toDateTimeOffset(scheduler.clock);
        }, function (state, action) {
            return scheduler.scheduleAbsolute(state, scheduler.clock, action);
        }, function (state, dueTime, action) {
            return scheduler.scheduleRelative(state, scheduler.toRelative(dueTime), action);
        }, function (state, dueTime, action) {
            return scheduler.scheduleRelative(state, scheduler.toRelative(dueTime - scheduler.now()), action);
        });
        this.queue = new PriorityQueue(1024);
    }
    VirtualTimeScheduler.prototype.scheduleRelative = function (state, dueTime, action) {
        var runAt = this.add(this.clock, dueTime);
        return this.scheduleAbsolute(state, runAt, action);
    };
    VirtualTimeScheduler.prototype.start = function () {
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
    };
    VirtualTimeScheduler.prototype.stop = function () {
        return this.isEnabled = false;
    };
    VirtualTimeScheduler.prototype.advanceTo = function (time) {
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
            return this.clock = time;
        }
    };
    VirtualTimeScheduler.prototype.advanceBy = function (time) {
        var dt = this.add(this.clock, time);
        if (this.comparer(this.clock, dt) >= 0) {
            throw new Error(argumentOutOfRange);
        }
        return this.advanceTo(dt);
    };
    VirtualTimeScheduler.prototype.getNext = function () {
        var next;
        while (this.queue.count() > 0) {
            next = this.queue.peek();
            if (next.isCancelled()) {
                this.queue.dequeue();
            } else {
                return next;
            }
        }
        return null;
    };
    VirtualTimeScheduler.prototype.scheduleAbsolute = function (state, dueTime, action) {
        var self = this,
        run = function (scheduler, state1) {
            self.queue.remove(si);
            return action(scheduler, state1);
        },
        si = new ScheduledItem(self, state, run, dueTime, self.comparer);
        self.queue.enqueue(si);
        return si.disposable;
    };
    return VirtualTimeScheduler;
})();
var TimeoutScheduler = (function () {
    inherits(TimeoutScheduler, Scheduler);
    function TimeoutScheduler() {
        var scheduler = this;
        TimeoutScheduler.base.constructor.call(this, defaultNow, function (state, action) {
            var id = global.setTimeout(function () {
                    action(scheduler, state);
            }, 0),
            d = disposableCreate(function () {
                global.clearTimeout(id);
            });
            return d;
        }, function (state, dueTime, action) {
            var d, dt, id;
            dt = Scheduler.normalize(dueTime);
            id = global.setTimeout(function () {
                action(scheduler, state);
            }, dt);
            d = disposableCreate(function () {
                global.clearTimeout(id);
            });
            return d;
        }, function (state, dueTime, action) {
            return scheduler.scheduleWithRelativeAndState(state, dueTime - scheduler.now(), action);
        });
    }
    return TimeoutScheduler;
})(),
timeoutScheduler = Scheduler.Timeout = new TimeoutScheduler();

var Notification = root.Notification = (function () {
    function Notification() { }
    Notification.prototype.accept = function (observerOrOnNext, onError, onCompleted) {
        if (arguments.length > 1 || typeof observerOrOnNext === 'function') {
            return this._accept(observerOrOnNext, onError, onCompleted);
        } else {
            return this._acceptObservable(observerOrOnNext);
        }
    };
    Notification.prototype.toObservable = function (scheduler) {
        var notification = this;
        scheduler = scheduler || Scheduler.Immediate;
        return observableCreateWithDisposable(function (observer) {
            return scheduler.schedule(function () {
                notification._acceptObservable(observer);
                if (notification.kind === 'N') {
                    observer.onCompleted();
                }
            });
        });
    };
    Notification.prototype.hasValue = false;
    Notification.prototype.equals = function (other) {
        var otherString = other === _undefined || other === null ? '' : other.toString();
        return this.toString() === otherString;
    };
    return Notification;
})();
Notification.createOnNext = function (next) {
    var notification = new Notification();
    notification.value = next;
    notification.hasValue = true;
    notification.kind = 'N';
    notification._accept = function (onNext) {
        return onNext(this.value);
    };
    notification._acceptObservable = function (observer) {
        return observer.onNext(this.value);
    };
    notification.toString = function () {
        return 'OnNext(' + this.value + ')';
    };
    return notification;
};
Notification.createOnError = function (error) {
    var notification = new Notification();
    notification.exception = error;
    notification.kind = 'E';
    notification._accept = function (onNext, onError) {
        return onError(this.exception);
    };
    notification._acceptObservable = function (observer) {
        return observer.onError(this.exception);
    };
    notification.toString = function () {
        return 'OnError(' + this.exception + ')';
    };
    return notification;
};
Notification.createOnCompleted = function () {
    var notification = new Notification();
    notification.kind = 'C';
    notification._accept = function (onNext, onError, onCompleted) {
        return onCompleted();
    };
    notification._acceptObservable = function (observer) {
        return observer.onCompleted();
    };
    notification.toString = function () {
        return 'OnCompleted()';
    };
    return notification;
};
var Enumerable = function() { };
var enumerableProto = Enumerable.prototype;
enumerableProto.concat = function () {
    var sources = this;
    return observableCreateWithDisposable(function (observer) {
        var cancelable, e = sources.getEnumerator(), isDisposed = false, subscription = new SerialDisposable();
        cancelable = immediateScheduler.scheduleRecursive(function (self) {
            var current, d, ex, hasNext = false;
            if (!isDisposed) {
                try {
                    hasNext = e.moveNext();
                    if (hasNext) {
                        current = e.current;
                    }
                } catch (exception) {
                    ex = exception;
                }
            } else {
                return;
            }
            if (ex !== undefined) {
                observer.onError(ex);
                return;
            }
            if (!hasNext) {
                observer.onCompleted();
                return;
            }
            d = new SingleAssignmentDisposable();
            subscription.disposable(d);
            d.disposable(current.subscribe(
                function (x) { observer.onNext(x); },
                function (exn) { observer.onError(exn); },
                function () { self(); }));
        });
        return new CompositeDisposable(subscription, cancelable, disposableCreate(function () {
            isDisposed = true;
        }));
    });
};
enumerableProto.catchException = function () {
    var sources = this;
    return observableCreateWithDisposable(function (observer) {
        var cancelable, e = sources.getEnumerator(), isDisposed = false, subscription, lastException;
        subscription = new SerialDisposable();
        cancelable = immediateScheduler.scheduleRecursive(function (self) {
            var current, d, ex, hasNext;
            hasNext = false;
            if (!isDisposed) {
                try {
                    hasNext = e.moveNext();
                    if (hasNext) {
                        current = e.current;
                    }
                } catch (exception) {
                    ex = exception;
                }
            } else {
                return;
            }
            if (ex !== undefined) {
                observer.onError(ex);
                return;
            }
            if (!hasNext) {
                if (lastException !== undefined) {
                    observer.onError(lastException);
                } else {
                    observer.onCompleted();
                }
                return;
            }
            d = new SingleAssignmentDisposable();
            subscription.disposable(d);
            d.disposable(current.subscribe(
                function (x) { observer.onNext(x); },
                function (exn) {
                    lastException = exn;
                    self();
                },
                function () { observer.onCompleted(); }));
        });
        return new CompositeDisposable(subscription, cancelable, disposableCreate(function () {
            isDisposed = true;
        }));
    });
};
var enumerableRepeat = Enumerable.repeat = function (value, repeatCount) {
    if (repeatCount === _undefined) {
        repeatCount = -1;
    }
    var enumerable = new Enumerable();
    enumerable.getEnumerator = function () {
        return {
            left: repeatCount,
            current: null,
            moveNext: function () {
                if (this.left === 0) {
                    this.current = null;
                    return false;
                }
                if (this.left > 0) {
                    this.left--;
                }
                this.current = value;
                return true;
            }
        };
    };    
    return enumerable;
};
var enumerableFor = Enumerable.forEnumerator = function (source) {
    var enumerable = new Enumerable();
    enumerable.getEnumerator = function () {
        return {
            _index: -1,
            current: null,
            moveNext: function () {
                if (++this._index < source.length) {
                    this.current = source[this._index];
                    return true;
                }
                this._index = -1;
                this.current = null;
                return false;
            }
        };
    };
    return enumerable;
};
var Observer = root.Observer = function() { },
AbstractObserver = root.AbstractObserver = (function () {
    inherits(AbstractObserver, Observer);
    function AbstractObserver() {
        this.isStopped = false;
    }
    AbstractObserver.prototype.onNext = function (value) {
        if (!this.isStopped) {
            this.next(value);
        }
    };
    AbstractObserver.prototype.onError = function (error) {
        if (!this.isStopped) {
            this.isStopped = true;
            this.error(error);
        }
    };
    AbstractObserver.prototype.onCompleted = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this.completed();
        }
    };
    AbstractObserver.prototype.dispose = function () {
        this.isStopped = true;
    };
    return AbstractObserver;
})();
var AnonymousObserver = (function () {
    inherits(AnonymousObserver, AbstractObserver);
    function AnonymousObserver(onNext, onError, onCompleted) {
        AnonymousObserver.base.constructor.call(this);
        this._onNext = onNext;
        this._onError = onError;
        this._onCompleted = onCompleted; 
    }
    AnonymousObserver.prototype.next = function (value) {
        this._onNext(value);
    };
    AnonymousObserver.prototype.error = function (exception) {
        this._onError(exception);
    };
    AnonymousObserver.prototype.completed = function () {
        this._onCompleted();
    };
    return AnonymousObserver;
})();
var BinaryObserver = root.BinaryObserver = (function () {
    inherits(BinaryObserver, Observer);
    function BinaryObserver(left, right) {
        if (typeof left === 'function' && typeof right === 'function') {
            this.leftObserver = observerToObserver(left);
            this.rightObserver = observerToObserver(right);
        } else {
            this.leftObserver = left;
            this.rightObserver = right;
        }
    }
    BinaryObserver.prototype.onNext = function (value) {
        var self = this;
        return value.switchValue(function (left) {
            return left.accept(self.leftObserver);
        }, function (right) {
            return right.accept(self.rightObserver);
        });
    };
    BinaryObserver.prototype.onError = function () { };
    BinaryObserver.prototype.onCompleted = function () { };
    return BinaryObserver;
})();
var ScheduledObserver = (function () {
    inherits(ScheduledObserver, AbstractObserver);
    function ScheduledObserver(scheduler, observer) {
        this.scheduler = scheduler;
        this.observer = observer;
        this.isAcquired = false;
        this.hasFaulted = false;
        this.queue = [];
        this.disposable = new SerialDisposable();
    }
    ScheduledObserver.prototype.ensureActive = function () {
        var isOwner = false, parent = this;
        if (!this.hasFaulted && this.queue.length > 0) {
            isOwner = !this.isAcquired;
            this.isAcquired = true;
        }
        if (isOwner) {
            this.disposable.disposable(this.scheduler.scheduleRecursive(function (self) {
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
    ScheduledObserver.prototype.dispose = function () {
        ScheduledObserver.base.dispose.call(this);
        this.disposable.dispose();
    };
    return ScheduledObserver;
})();
var observerCreate = Observer.create = function (onNext, onError, onCompleted) {
	onError || (onError = function (e) {
		throw e;
	});
	onCompleted || (onCompleted = function () {
	});	
    return new AnonymousObserver(onNext, onError, onCompleted);
},
observerFromNotifier = Observer.fromNotifier = function (handler) {
    return new AnonymousObserver(function (x) {
        return handler(Notification.createOnNext(x));
    }, function (exception) {
        return handler(Notification.createOnError(exception));
    }, function () {
        return handler(Notification.createOnCompleted());
    });
},
observerToObserver = function(handler) {
    return new AnonymousObserver(function(x) {
        handler(Notification.createOnNext(x));
    }, function (e) {
        handler(Notification.createOnError(e));
    }, function () {
        handler(Notification.createOnCompleted());
    });
};
Observer.prototype.toNotifier = function () {
    var observer = this;
    return function (n) {
        return n.accept(observer);
    };
};
Observer.prototype.asObserver = function () {
    var source = this;
    return new AnonymousObserver(function (x) {
        return source.onNext(x);
    }, function (e) {
        return source.onError(e);
    }, function () {
        return source.onCompleted();
    });
};

	var Observable = root.Observable = (function () {
		function Observable() { }
		Observable.prototype.subscribe = function (observerOrOnNext, onError, onCompleted) {
			var subscriber;
			if (arguments.length === 0 || arguments.length > 1 || typeof observerOrOnNext === 'function') {
				subscriber = observerCreate(observerOrOnNext, onError, onCompleted);
			} else {
				subscriber = observerOrOnNext;
			}
			return this._subscribe(subscriber);
		};
		return Observable;
	})(),
	observableProto = Observable.prototype,
	AnonymousObservable = (function () {
		inherits(AnonymousObservable, Observable);
		function AnonymousObservable(subscribe) {
			AnonymousObservable.base.constructor.call(this);
			this.__subscribe = subscribe;
		}
		AnonymousObservable.prototype._subscribe = function (observer) {
			var autoDetachObserver = new AutoDetachObserver(observer), observable = this;
			if (currentThreadScheduler.scheduleRequired()) {
				currentThreadScheduler.schedule(function () {
					autoDetachObserver.disposable(observable.__subscribe(autoDetachObserver));
				});
			} else {
				autoDetachObserver.disposable(observable.__subscribe(autoDetachObserver));
			}

			return autoDetachObserver;
		};
		return AnonymousObservable;
	})(),
	AutoDetachObserver = (function () {
		inherits(AutoDetachObserver, AbstractObserver);
		function AutoDetachObserver(observer) {
			AutoDetachObserver.base.constructor.call(this);
			this.observer = observer;
			this.m = new SingleAssignmentDisposable();   
		}
		AutoDetachObserver.prototype.disposable = function (value) {
			return this.m.disposable(value);
		};
		AutoDetachObserver.prototype.next = function (value) {
			this.observer.onNext(value);
		};
		AutoDetachObserver.prototype.error = function (error) {
			this.observer.onError(error);
			this.m.dispose();
		};
		AutoDetachObserver.prototype.completed = function () {
			this.observer.onCompleted();
			this.m.dispose();
		};
		AutoDetachObserver.prototype.dispose = function () {
			AutoDetachObserver.base.dispose.call(this);
			this.m.dispose();
		};
		return AutoDetachObserver;
	})();
var GroupedObservable = (function () {
    inherits(GroupedObservable, Observable);
    function GroupedObservable(key, underlyingObservable, mergedDisposable) {
        GroupedObservable.base.constructor.call(this);
        this.key = key;
        this.underlyingObservable = !mergedDisposable ?
            underlyingObservable :
            observableCreateWithDisposable(function(observer) {
                return new CompositeDisposable(mergedDisposable.getDisposable(), underlyingObservable.subscribe(observer));
            });
    }
    GroupedObservable.prototype._subscribe = function (observer) {
        return this.underlyingObservable.subscribe(observer);
    };
    return GroupedObservable;
})();
var ConnectableObservable = root.ConnectableObservable = (function () {
    inherits(ConnectableObservable, Observable);
    function ConnectableObservable(source, subject) {
        this.subject = subject;
        this.source = source.asObservable();
        this.hasSubscription = false;
        this.subscription = null;
    }
    ConnectableObservable.prototype.connect = function () {
        if (!this.hasSubscription) {
            var self = this;
            this.hasSubscription = true;
            this.subscription = new CompositeDisposable(this.source.subscribe(this.subject), disposableCreate(function () {
                self.hasSubscription = false;
            }));
        }
        return this.subscription;
    };
    ConnectableObservable.prototype.refCount = function () {
        var connectableSubscription = null,
            count = 0, 
            source = this;
        return observableCreateWithDisposable(function (observer) {
            var shouldConnect, subscription;
            count++;
            shouldConnect = count === 1;
            subscription = source.subscribe(observer);
            if (shouldConnect) {
                connectableSubscription = source.connect();
            }
            return disposableCreate(function () {
                subscription.dispose();
                count--;
                if (count === 0) {
                    connectableSubscription.dispose();
                }
            });
        });
    };
    ConnectableObservable.prototype._subscribe = function (observer) {
        return this.subject.subscribe(observer);
    };
    return ConnectableObservable;
})();
var Subject = root.Subject = (function () {
    inherits(Subject, Observable);
    extendObject(Subject, Observer);
    function Subject() {
        Subject.base.constructor.call(this);
        this.isDisposed = false;
        this.isStopped = false;
        this.observers = new List();
        this.exception = _undefined;
    }
    Subject.prototype.onCompleted = function () {
        var os, i;
        this.checkDisposed();
        if (!this.isStopped) {
            os = this.observers.toArray();
            this.observers = new List();
            this.isStopped = true;
        }
        if (os !== _undefined) {
            for (i = 0; i < os.length; i++) {
                os[i].onCompleted();
            }
        }
    };
    Subject.prototype.onError = function (exception) {
        var os, i;
        this.checkDisposed();
        if (!this.isStopped) {
            os = this.observers.toArray();
            this.observers = new List();
            this.isStopped = true;
            this.exception = exception;
        }
        if (os !== _undefined) {
            for (i = 0; i < os.length; i++) {
                os[i].onError(exception);
            }
        }
    };
    Subject.prototype.onNext = function (value) {
        var os, i;
        this.checkDisposed();
        if (!this.isStopped) {
            os = this.observers.toArray();
        }
        if (os !== undefined) {
            for (i = 0; i < os.length; i++) {
                os[i].onNext(value);
            }
        }
    };
    Subject.prototype._subscribe = function (observer) {
        this.checkDisposed();
        if (!this.isStopped) {
            this.observers.add(observer);
            return (function (subject, obs) {
                return {
                    observer: obs,
                    dispose: function () {
                        if (this.observer !== null && !subject.isDisposed) {
                            subject.observers.remove(this.observer);
                            this.observer = null;
                        }
                    }
                };
            })(this, observer);
        }
        if (this.exception !== _undefined) {
            observer.onError(this.exception);
            return disposableEmpty;
        }
        observer.onCompleted();
        return disposableEmpty;
    };
    Subject.prototype.unsubscribe = function (observer) {
        if (this.observers !== null) {
            return this.observers.Remove(observer);
        }
    };
    Subject.prototype.checkDisposed = function () {
        if (this.isDisposed) {
            throw new Error(objectDisposed);
        }
    };
    Subject.prototype.dispose = function () {
        this.isDisposed = true;
        this.observers = null;
    };

    Subject.create = function (observer, observable) {
        return new AnonymousSubject(observer, observable);
    };

    return Subject;
})();
var AsyncSubject = root.AsyncSubject = (function () {
    inherits(AsyncSubject, Observable);
    extendObject(AsyncSubject, Observer);
    function AsyncSubject() {
        AsyncSubject.base.constructor.call(this);
        this.isDisposed = false;
        this.isStopped = false;
        this.value = null;
        this.hasValue = false;
        this.observers = new List();
        this.exception = null;
    }
    AsyncSubject.prototype.onCompleted = function () {
        var hv = false, o, os, v, i;
        this.checkDisposed();
        if (!this.isStopped) {
            os = this.observers.toArray();
            this.observers = new List();
            this.isStopped = true;
            v = this.value;
            hv = this.hasValue;
        }
        if (os !== _undefined) {
            if (hv) {
                for (i = 0; i < os.length; i++) {
                    o = os[i];
                    o.onNext(v);
                    o.onCompleted();
                }
            } else {
                for (i = 0; i < os.length; i++) {
                    os[i].onCompleted();
                }
            }
        }
    };
    AsyncSubject.prototype.onError = function (exception) {
        var os, i;
        this.checkDisposed();
        if (!this.isStopped) {
            os = this.observers.toArray();
            this.observers = new List();
            this.isStopped = true;
            this.exception = exception;
        }
        if (os !== _undefined) {
            for (i = 0; i < os.length; i++) {
                os[i].onError(exception);
            }
        }
    };
    AsyncSubject.prototype.onNext = function (value) {
        this.checkDisposed();
        if (!this.isStopped) {
            this.value = value;
            this.hasValue = true;
        }
    };
    AsyncSubject.prototype._subscribe = function (observer) {
        var ex, hv, v;
        this.checkDisposed();
        if (!this.isStopped) {
            this.observers.add(observer);
            return (function (subject, obs) {
                return {
                    observer: obs,
                    dispose: function() {
                        if (this.observer !== null && !subject.isDisposed) {
                            subject.observers.remove(this.observer);
                            this.observer = null;
                        }
                    }
                };
            })(this, observer);
        }
        ex = this.exception;
        hv = this.hasValue;
        v = this.value;
        if (ex !== null) {
            observer.onError(ex);
        } else if (hv) {
            observer.onNext(v);
            observer.onCompleted();
        } else {
            observer.onCompleted();
        }
        return disposableEmpty;
    };
    AsyncSubject.prototype.checkDisposed = function () {
        if (this.isDisposed) {
            throw new Error(objectDisposed);
        }
    };
    AsyncSubject.prototype.dispose = function () {
        this.isDisposed = true;
        this.observers = null;
        this.exception = null;
        this.value = null;
    };
    return AsyncSubject;
})();
var BehaviorSubject = root.BehaviorSubject = (function () {
    inherits(BehaviorSubject, Observable);
    extendObject(BehaviorSubject, Observer);
    function BehaviorSubject(value) {
        BehaviorSubject.base.constructor.call(this);
        this.value = value;
        this.observers = new List();
        this.isDisposed = false;
        this.isStopped = false;
        this.exception = null;
    }
    BehaviorSubject.prototype.onCompleted = function () {
        var os, i;
        os = null;
        this._checkDisposed();
        if (!this.isStopped) {
            os = this.observers.toArray();
            this.observers = new List();
            this.isStopped = true;
        }
        if (os !== null) {
            for (i = 0; i < os.length; i++) {
                os[i].onCompleted();
            }
        }
    };
    BehaviorSubject.prototype.onError = function (error) {
        var i, os;
        os = null;
        this._checkDisposed();
        if (!this.isStopped) {
            os = this.observers.toArray();
            this.observers = new List();
            this.isStopped = true;
            this.exception = error;
        }
        if (os !== null) {
            for (i = 0; i < os.length; i++) {
                os[i].onError(error);
            }
        }
    };
    BehaviorSubject.prototype.onNext = function (value) {
        var os, i;
        os = null;
        this._checkDisposed();
        if (!this.isStopped) {
            this.value = value;
            os = this.observers.toArray();
        }
        if (os !== null) {
            for (i = 0; i < os.length; i++) {
                os[i].onNext(value);
            }
        }
    };
    BehaviorSubject.prototype._subscribe = function (observer) {
        var ex;
        this._checkDisposed();
        if (!this.isStopped) {
            this.observers.add(observer);
            observer.onNext(this.value);
            return (function (subject, obs) {
                return {
                    observer: obs,
                    dispose: function () {
                        if (this.observer !== null && !subject.isDisposed) {
                            subject.observers.remove(this.observer);
                            this.observer = null;
                        }
                    }
                };
            })(this, observer);
        }
        ex = this.exception;
        if (ex !== null) {
            observer.onError(ex);
        } else {
            observer.onCompleted();
        }
        return disposableEmpty;
    };
    BehaviorSubject.prototype._checkDisposed = function () {
        if (this.isDisposed) {
            throw new Error(objectDisposed);
        }
    };
    BehaviorSubject.prototype.dispose = function () {
        this.isDisposed = true;
        this.observers = null;
        this.value = null;
        this.exception = null;
    };
    return BehaviorSubject;
})();
BehaviorSubject.prototype.toNotifier = Observer.prototype.toNotifier;
BehaviorSubject.prototype.AsObserver = Observer.prototype.AsObserver;
var ReplaySubject = root.ReplaySubject = (function () {
    inherits(ReplaySubject, Observable);
    extendObject(ReplaySubject, Observable);

    function ReplaySubject(bufferSize, window, scheduler) {
        this.bufferSize = bufferSize === _undefined ? Number.MAX_VALUE : bufferSize;
        this.window = window === _undefined ? Number.MAX_VALUE : window;
        this.scheduler = scheduler || Scheduler.currentThread;
        this.q = [];
        this.observers = new List();
        this.isStopped = false;
        this.isDisposed = false;
    }

    ReplaySubject.prototype._trim = function (now) {
        var correction = this.isStopped ? 1 : 0,
            limit = correction + this.bufferSize;
        if (limit < this.bufferSize) {
            limit = this.bufferSize;
        }
        while (this.q.length > limit) {
            this.q.shift();
        }
        while (this.q.length > correction && now - this.q[0].timestamp > this.window) {
            this.q.shift();
        }
    };
    ReplaySubject.prototype._enqueue = function (n) {
        var now = this.scheduler.now(),
            t = { value: n, timestamp: now };
        this.q.push(t);
        this._trim(now);
    };
    ReplaySubject.prototype.onNext = function (value) {
        var o = null, observer, i;
        this._checkDisposed();
        if (!this.isStopped) {
            o = this.observers.toArray();
            this._enqueue(Notification.createOnNext(value));
            for (i = 0; i < o.length; i++) {
                observer = o[i];
                observer.onNext(value);
            }
        }
        if (o !== null) {
            for (i = 0; i < o.length; i++) {
                observer = o[i];
                observer.ensureActive();
            }
        }
    };
    ReplaySubject.prototype.onError = function (error) {
        var o = null, i;
        this._checkDisposed();
        if (!this.isStopped) {
            this.isStopped = true;
            this._enqueue(Notification.createOnError(error));
            o = this.observers.toArray();
            for (i = 0; i < o.length; i++) {
                o[i].onError(error);
            }
            this.observers = new List();
        }
        if (o !== null) {
            for (i = 0; i < o.length; i++) {
                o[i].ensureActive();
            }
        }
    };
    ReplaySubject.prototype.onCompleted = function () {
        var o = null, i;
        this._checkDisposed();
        if (!this.isStopped) {
            this.isStopped = true;
            this._enqueue(Notification.createOnCompleted());
            o = this.observers.toArray();
            for (i = 0; i < o.length; i++) {
                o[i].onCompleted();
            }
            this.observers = new List();
        }
        if (o !== null) {
            for (i = 0; i < o.length; i++) {
                o[i].ensureActive();
            }
        }
    };
    ReplaySubject.prototype._subscribe = function (observer) {
        var so = new ScheduledObserver(this.scheduler, observer),
            subscription = (function (subject, obs) {
                return { 
                    subject: subject,
                    observer: obs,
                    dispose: function () {
                        this.observer.dispose();
                        this.subject._unsubscribe(this.observer);
                    }
                };
            })(this, so),
            i;
        this._checkDisposed();
        this._trim(this.scheduler.now());
        this.observers.add(so);
        for (i = 0; i < this.q.length; i++) {
            this.q[i].value.accept(so);
        }
        so.ensureActive();
        return subscription;
    };
    ReplaySubject.prototype._unsubscribe = function (observer) {
        if (!this.isDisposed) {
            this.observers.remove(observer);
        }
    };
    ReplaySubject.prototype.dispose = function () {
        this.isDisposed = true;
        this.observers = null;
    };
    ReplaySubject.prototype._checkDisposed = function () {
        if (this.isDisposed) {
            throw new Error(objectDisposed);
        }
    };
    return ReplaySubject;
})();
var AnonymousSubject = (function () {
    inherits(AnonymousSubject, Observable);
    extendObject(AnonymousSubject, Observer);
    function AnonymousSubject(observer, observable) {
        this.observer = observer;
        this.observable = observable;
    }
    AnonymousSubject.prototype.onCompleted = function () {
        return this.observer.onCompleted();
    };
    AnonymousSubject.prototype.onError = function (exception) {
        return this.observer.onError(exception);
    };
    AnonymousSubject.prototype.onNext = function (value) {
        return this.observer.onNext(value);
    };
    AnonymousSubject.prototype._Subscribe = function (observer) {
        return this.observable.Subscribe(observer);
    };

    return AnonymousSubject;
})();

var observableStart = Observable.start = function (original, instance, args, scheduler) {
    args || (args = []);
    return observableToAsync(original, scheduler).apply(instance, args);
},
observableToAsync = Observable.toAsync = function (original, scheduler) {
    scheduler || (scheduler = timeoutScheduler);
    return function () {
        var subject = new AsyncSubject(),
        delayed = function () {
            var result;
            try {
                result = original.apply(this, arguments);
            } catch (e) {
                subject.onError(e);
                return;
            }
            subject.onNext(result);
            subject.onCompleted();
        },
        args = slice.call(arguments),
        parent = this;
        scheduler.schedule(function () {
            delayed.apply(parent, args);
        });
        return subject;
    };
};
observableProto.multicast = function (subjectOrSubjectSelector, selector) {
    var source = this;
    return typeof subjectOrSubjectSelector === 'function' ?
        observableCreateWithDisposable(function(observer) {
            var connectable = source.multicast(subjectOrSubjectSelector());
            return new CompositeDisposable(selector(connectable).subscribe(observer), connectable.connect());
        }) :
        new ConnectableObservable(source, subjectOrSubjectSelector);
};
observableProto.publish = function (selector) {
    return !selector ?
        this.multicast(new Subject()) :
        this.multicast(function () {
            return new Subject();
        }, selector);
};
observableProto.publishLast = function (selector) {
    return !selector ?
        this.multicast(new AsyncSubject()) :
        this.multicast(function () {
            return new AsyncSubject();
        }, selector);
};
observableProto.replay = function (selector, bufferSize, window, scheduler) {
    return !selector || selector === null ?
        this.multicast(new ReplaySubject(bufferSize, window, scheduler)) :
        this.multicast(function () {
            return new ReplaySubject(bufferSize, window, scheduler);
        }, selector);
};
observableProto.publishValue = function (initialValueOrSelector, initialValue) {
    return typeof initialValueOrSelector === 'function' ?
        this.multicast(function () {
            return new BehaviorSubject(initialValue);
        }, initialValueOrSelector) :
        this.multicast(new BehaviorSubject(initialValueOrSelector));
};
var observableNever = Observable.never = function () {
    return observableCreateWithDisposable(function () {
        return disposableEmpty;
    });
},
observableEmpty = Observable.empty = function (scheduler) {
    scheduler || (scheduler = immediateScheduler);
    return observableCreateWithDisposable(function (observer) {
        return scheduler.schedule(function () {
            return observer.onCompleted();
        });
    });
},
observableReturn = Observable.returnValue = function (value, scheduler) {
    scheduler || (scheduler = immediateScheduler);
    return observableCreateWithDisposable(function (observer) {
        return scheduler.schedule(function () {
            observer.onNext(value);
            return observer.onCompleted();
        });
    });
},
observableThrow = Observable.throwException = function (exception, scheduler) {
    scheduler || (scheduler = immediateScheduler);
    return observableCreateWithDisposable(function (observer) {
        return scheduler.schedule(function () {
            return observer.onError(exception);
        });
    });
},
observableGenerate = Observable.generate = function (initialState, condition, iterate, resultSelector, scheduler) {
    scheduler || (scheduler = immediateScheduler);
    return observableCreateWithDisposable(function (observer) {
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
},
observableDefer = Observable.defer = function (observableFactory) {
    return observableCreateWithDisposable(function (observer) {
        var result;
        try {
            result = observableFactory();
        } catch (e) {
            return observableThrow(e).subscribe(observer);
        }
        return result.subscribe(observer);
    });
},
observableUsing = Observable.using = function (resourceFactory, observableFactory) {
    return observableCreateWithDisposable(function (observer) {
        var disposable = disposableEmpty, resource, source;
        try {
            resource = resourceFactory();
            if (resource !== null) {
                disposable = resource;
            }
            source = observableFactory(resource);
        } catch (exception) {
            return new CompositeDisposable(observableThrow(exception).subscribe(observer), disposable);
        }
        return new CompositeDisposable(source.subscribe(observer), disposable);
    });
},
observableFromArray = Observable.fromArray = function (array, scheduler) {
    scheduler || (scheduler = currentThreadScheduler);
    return observableCreateWithDisposable(function (observer) {
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
},
observableCreateWithDisposable = Observable.createWithDisposable = function (subscribe) {
    return new AnonymousObservable(subscribe);
},
obsrevableCreate = Observable.create = function (subscribe) {
    return observableCreateWithDisposable(function (o) {
        return disposableCreate(subscribe(o));
    });
},
observableRange = Observable.range = function (start, count, scheduler) {
    scheduler || (scheduler = currentThreadScheduler);
    var max = start + count - 1;
    return observableGenerate(start, function (x) {
        return x <= max;
    }, function (x) {
        return x + 1;
    }, function (x) {
        return x;
    }, scheduler);
};
observableProto.repeat = function (repeatCount) {
    return enumerableRepeat(this, repeatCount).concat();
};
observableProto.retry = function (retryCount) {
    return enumerableRepeat(this, retryCount).catchException();
};
Observable.repeat = function (value, repeatCount, scheduler) {
    scheduler || (scheduler = currentThreadScheduler);
    if (repeatCount === _undefined) {
        repeatCount = -1;
    }
    return observableReturn(value, scheduler).repeat(repeatCount);
};

observableProto.select = function (selector) {
    var parent = this;
    return observableCreateWithDisposable(function (observer) {
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
        }, function (e) { observer.onError(e); }, function () { observer.onCompleted(); });
    });
};
observableProto.where = function (predicate) {
    var parent = this;
    return observableCreateWithDisposable(function (observer) {
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
        }, function (e) { observer.onError(e); }, function () { observer.onCompleted(); });
    });
};
observableProto.groupByUntil = function (keySelector, elementSelector, durationSelector, keySerializer) {
    var source = this;
    elementSelector || (elementSelector = identity);
    keySerializer || (keySerializer = defaultKeySerializer);
    return observableCreateWithDisposable(function (observer) {
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
                    if (map[serializedKey] !== _undefined) {
                        delete map[serializedKey];
                        writer.onCompleted();
                    }
                    groupDisposable.remove(md);
                };
                md.disposable(duration.take(1).subscribe(function () { }, function (exn) {
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
            var w;
            for (w in map) {
                map[w].onError(ex);
            }
            observer.onError(ex);
        }, function () {
            var w;
            for (w in map) {
                map[w].onCompleted();
            }
            observer.onCompleted();
        }));
        return refCountDisposable;
    });
};
observableProto.groupBy = function (keySelector, elementSelector, keySerializer) {
    return this.groupByUntil(keySelector, elementSelector, function () {
        return observableNever();
    }, keySerializer);
};
observableProto.take = function (count) {
    if (count <= 0) {
        throw new Error(argumentOutOfRange);
    }
    var observable = this;
    return observableCreateWithDisposable(function (observer) {
        var remaining = count;
        return observable.subscribe(function (x) {
            if (remaining > 0) {
                remaining--;
                observer.onNext(x);
                if (remaining === 0) {
                    observer.onCompleted();
                }
            }
        }, function (e) { return observer.onError(e); }, function () { return observer.onCompleted(); });
    });
};
observableProto.skip = function (count) {
    if (count < 0) {
        throw new Error(argumentOutOfRange);
    }
    var observable = this;
    return observableCreateWithDisposable(function (observer) {
        var remaining = count;
        return observable.subscribe(function (x) {
            if (remaining <= 0) {
                observer.onNext(x);
            } else {
                remaining--;
            }
        }, function (e) { return observer.onError(e); }, function () { return observer.onCompleted(); });
    });
};
observableProto.takeWhile = function (predicate) {
    var observable = this;
    return observableCreateWithDisposable(function (observer) {
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
        }, function (e) { return observer.onError(e); }, function () { return observer.onCompleted(); });
    });
};
observableProto.skipWhile = function (predicate) {
    var source = this;
    return observableCreateWithDisposable(function (observer) {
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
        }, function (e) {
            observer.onError(e);
        }, function () {
            observer.onCompleted();
        });
    });
};
observableProto.selectMany = function (selector, resultSelector) {
    if (resultSelector !== _undefined) {
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
var selectMany = function (selector) {
    return this.select(selector).mergeObservable();
};
observableProto.addRef = function (r) {
    var xs = this;
    return observableCreateWithDisposable(function (observer) {
        return new CompositeDisposable(r.getDisposable(), xs.subscribe(observer));
    });
};
var sequenceContainsNoElements = 'Sequence contains no elements.';
observableProto.finalValue = function () {
	var source = this;
    return observableCreateWithDisposable(function (observer) {
        var hasValue = false, value;
        return source.subscribe(function (x) {
            hasValue = true;
            value = x;
        }, function (e) {
            observer.onError(e);
        }, function () {
            if (!hasValue) {
                observer.onError(new Error(sequenceContainsNoElements));
            } else {
                observer.onNext(value);
                observer.onCompleted();
            }
        });
    });
},
observableProto.toArray = function () {
    var accumulator = function (list, i) {
        list.push(i);
        return list;
    };
    return this.scan([], accumulator).startWith([]).finalValue();
};
observableProto.materialize = function () {
    var source = this;
    return observableCreateWithDisposable(function (observer) {
        return source.subscribe(function (value) {
            observer.onNext(Notification.createOnNext(value));
        }, function (exception) {
            observer.onNext(Notification.createOnError(exception));
            observer.onCompleted();
        }, function () {
            observer.onNext(Notification.createOnCompleted());
            observer.onCompleted();
        });
    });
};
observableProto.dematerialize = function () {
    var source = this;
    return observableCreateWithDisposable(function (observer) {
        return source.subscribe(function (x) {
            return x.accept(observer);
        }, function (e) { observer.onError(e);}, function () { observer.onCompleted();});
    });
};
observableProto.asObservable = function () {
    var source = this;
    return observableCreateWithDisposable(function (observer) {
        return source.subscribe(observer);
    });
};
observableProto.windowWithCount = function (count, skip) {
    var source = this;
    if (count <= 0) {
        throw new Error(argumentOutOfRange);
    }
    if (skip === _undefined) {
        skip = count;
    }
    if (skip <= 0) {
        throw new Error(argumentOutOfRange);
    }
    return observableCreateWithDisposable(function (observer) {
        var m = new SingleAssignmentDisposable(),
            refCountDisposable = new RefCountDisposable(m),
            n = 0,
            q = [],
            createWindow = function () {
                var s = new Subject();
                q.push(s);
                observer.onNext(s.addRef(refCountDisposable));
            };
        createWindow();
        m.disposable(source.subscribe(function (x) {
            var c, i, s;
            for (i = 0; i < q.length; i++) {
                q[i].onNext(x);
            }
            c = n - count + 1;
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
observableProto.bufferWithCount = function (count, skip) {
    if (skip === _undefined) {
        skip = count;
    }
    return this.windowWithCount(count, skip).selectMany(function (x) {
        return x.toArray();
    }).where(function (x) {
        return x.length > 0;
    });
};
observableProto.startWith = function () {
    var values, scheduler, start = 0;
    if (arguments.length > 0 && arguments[0].now !== undefined) {
        scheduler = arguments[0];
        start = 1;
    } else {
        scheduler = immediateScheduler;
    }
    values = slice.call(arguments, start);
    return enumerableFor([observableFromArray(values, scheduler), this]).concat();
};
observableProto.scan = function (seed, accumulator) {
    var source = this;
    return observableDefer(function () {
        var hasAccumulation = false, accumulation;
        return source.select(function (x) {
            if (hasAccumulation) {
                accumulation = accumulator(accumulation, x);
            } else {
                accumulation = accumulator(seed, x);
                hasAccumulation = true;
            }
            return accumulation;
        });
    });
};
observableProto.scan1 = function (accumulator) {
    var source = this;
    return observableDefer(function () {
        var hasAccumulation = false, accumulation;
        return source.select(function (x) {
            if (hasAccumulation) {
                accumulation = accumulator(accumulation, x);
            } else {
                accumulation = x;
                hasAccumulation = true;
            }
            return accumulation;
        });
    });
};
observableProto.distinctUntilChanged = function (keySelector, comparer) {
    var source = this;
    keySelector || (keySelector = identity);
    comparer || (comparer = defaultComparer);
    return observableCreateWithDisposable(function (observer) {
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
        }, function (e) { observer.onError(e); }, function () { observer.onCompleted(); });
    });
};
observableProto.finalValuelyDo = function (finallyAction) {
    var source = this;
    return observableCreateWithDisposable(function (observer) {
        var subscription = source.subscribe(observer);
        return disposableCreate(function () {
            try {
                 subscription.dispose();
            } finally {
                finallyAction();
            }
        });
    });
};
observableProto.doAction = function (observerOrOnNext, onError, onCompleted) {
    var source = this, onNextFunc;
    if (arguments.length == 0 || arguments.length > 1 || typeof observerOrOnNext == 'function') {
        onNextFunc = observerOrOnNext;
    } else {
        onNextFunc = function (x) { observerOrOnNext.onNext(x); };
        onError = function (exception) { observerOrOnNext.onError(exception); };
        onCompleted = function () { observerOrOnNext.onCompleted(); };
    }
    return observableCreateWithDisposable(function (observer) {
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
observableProto.skipLast = function (count) {
    var source = this;
    return observableCreateWithDisposable(function (observer) {
        var q = [];
        return source.subscribe(function (x) {
            q.push(x);
            if (q.length > count) {
                observer.onNext(q.shift());
            }
        }, function (e) { observer.onError(e); }, function () { observer.onCompleted(); });
    });
};
observableProto.takeLast = function (count) {
    var source = this;
    return observableCreateWithDisposable(function (observer) {
        var q = [];
        return source.subscribe(function (x) {
            q.push(x);
            if (q.length > count) {
                q.shift();
            }
        }, function (e) {
            observer.onError(e); 
        }, function () {
            while (q.length > 0) {
                observer.onNext(q.shift());
            }
            observer.onCompleted();
        });
    });
};
observableProto.ignoreElements = function () {
    var source = this;
    return observableCreateWithDisposable(function (observer) {
        return source.subscribe(nothing, function (e) { observer.onError(e); }, function () { observer.onCompleted(); });
    });
};
observableProto.elementAt = function (index) {
    if (index < 0) {
        throw new Error(argumentOutOfRange);
    } 
    var source = this;
    return observableCreateWithDisposable(function (observer) {
        var i = index;
        return source.subscribe(function (x) {
            if (i === 0) {
                observer.onNext(x);
                observer.onCompleted();
            }
            i--;
        }, function (e) { observer.onError(e); }, function () {
            observer.onError(new Error(argumentOutOfRange));
        });
    });
};
observableProto.elementAtOrDefault = function (index, defaultValue) {
    var source = this;
    if (index < 0) {
        throw new Error(argumentOutOfRange);
    } 
    if (defaultValue === _undefined) {
        defaultValue = null;
    }
    return observableCreateWithDisposable(function (observer) {
        var i = index;
        return source.subscribe(function (x) {
            if (i === 0) {
                observer.onNext(x);
                observer.onCompleted();
            }
            i--;
        }, function (e) {
            observer.onError(e);
        }, function () {
            observer.onNext(defaultValue);
            observer.onCompleted();
        });
    });
};
observableProto.defaultIfEmpty = function (defaultValue) {
    var source = this;
    if (defaultValue === _undefined) {
        defaultValue = null;
    }
    return observableCreateWithDisposable(function (observer) {
        var found = false;
        return source.subscribe(function (x) {
            found = true;
            observer.onNext(x);
        }, function (e) { observer.onError(e); }, function () {
            if (!found) {
                observer.onNext(defaultValue);
            }
            observer.onCompleted();
        });
    });
};
observableProto.distinct = function (keySelector, keySerializer) {
    var source = this;
    keySelector || (keySelector = identity);
    keySerializer || (keySerializer = defaultKeySerializer);
    return observableCreateWithDisposable(function (observer) {
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
        }, function (e) { observer.onError(e); }, function () { observer.onCompleted(); });
    });
};
observableProto.mergeObservable = function () {
    var sources = this;
    return observableCreateWithDisposable(function (observer) {
        var group = new CompositeDisposable(),
            isStopped = false, 
            m = new SingleAssignmentDisposable();
        group.add(m);
        m.disposable(sources.subscribe(function (innerSource) {
            var innerSubscription = new SingleAssignmentDisposable();
            group.add(innerSubscription);
            innerSubscription.disposable(innerSource.subscribe(function (x) {
                observer.onNext(x);
            }, function (exception) {
                observer.onError(exception);
            }, function () {
                group.remove(innerSubscription);
                if (isStopped && group.count() === 1) {
                    observer.onCompleted();
                }
            }));
        }, function (exception) {
            observer.onError(exception);
        }, function () {
            isStopped = true;
            if (group.count() === 1) {
                observer.onCompleted();
            }
        }));
        return group;
    });
};
observableProto.merge = function (maxConcurrent) {
    var sources = this;
    return observableCreateWithDisposable(function (observer) {
        var activeCount = 0, 
            group = new CompositeDisposable(), 
            isStopped = true, 
            q = [], 
            subscribe = function (xs) {
                var subscription = new SingleAssignmentDisposable();
                group.add(subscription);
                subscription.disposable(xs.subscribe(function (x) {
                    observer.onNext(x);
                }, function (exception) {
                    observer.onError(exception);
                }, function () {
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
            if (activeCount < maxConcurrent) {
                activeCount++;
                subscribe(innerSource);
            } else {
                q.push(innerSource);
            }
        }, function (exception) {
            observer.onError(exception);
        }, function () {
            isStopped = true;
            if (activeCount === 0) {
                observer.onCompleted();
            }
        }));
        return group;
    });
};
observableProto.switchLatest = function () {
    var sources = this;
    return observableCreateWithDisposable(function (observer) {
        var hasLatest = false, 
            innerSubscription = new SerialDisposable(), 
            isStopped = false, 
            latest = 0, 
            subscription = sources.subscribe(function (innerSource) {
                var d = new SingleAssignmentDisposable(), id = ++latest;
                hasLatest = true;
                innerSubscription.disposable(d);
                return d.disposable(innerSource.subscribe(function (x) {
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
            }, function (e) {
                observer.onError(e);
            }, function () {
                isStopped = true;
                if (!hasLatest) {
                    observer.onCompleted();
                }
            });
        return new CompositeDisposable(subscription, innerSubscription);
    });
};
Observable.merge = function (scheduler) {
    scheduler || (scheduler = immediateScheduler);
    var sources = arguments.length > 1 && arguments[1] instanceof Array ?
        arguments[1] :
        slice.call(arguments, 1);
    return observableFromArray(sources, scheduler).mergeObservable();
};
observableProto._shift = function (func, args) {
    var items = cloneArray(args);
    items.unshift(this);
    return func.apply(this, items);
};
observableProto.concat = function () {
    return this._shift(observableConcat, arguments);
};
observableProto.concatObservable = function () {
    return this.merge(1);
};
var observableConcat = Observable.concat = function () {
    var sources = arguments.length === 1 && arguments[0] instanceof Array ?
        arguments[0] :
        slice.call(arguments);
    return enumerableFor(sources).concat();
};
observableProto.catchException = function (handlerOrSecond) {
    if (typeof handlerOrSecond === 'function') {
        return observableCatchHandler(this, handlerOrSecond);
    }
    return observableCatch([this, handlerOrSecond]);
};
var observableCatchHandler = function (source, handler) {
    return observableCreateWithDisposable(function (observer) {
        var d1 = new SingleAssignmentDisposable(), subscription = new SerialDisposable();
        d1.disposable(source.subscribe(function (x) { observer.onNext(x); }, function (exception) {
            var d, result;
            try {
                result = handler(exception);
            } catch (ex) {
                observer.onError(ex);
                return;
            }
            d = new SingleAssignmentDisposable();
            subscription.disposable(d);
            d.disposable(result.subscribe(observer));
        }, function () { observer.onCompleted(); }));
        return subscription;
    });
};
var observableCatch = Observable.catchException = function () {
    var items = arguments.length === 1 && arguments[0] instanceof Array ?
        arguments[0] :
        slice.call(arguments);
    return enumerableFor(items).catchException();
};
observableProto.onErrorResumeNext = function (second) {
    return onErrorResumeNext([this, second]);
};
var onErrorResumeNext = Observable.onErrorResumeNext = function () {
    var sources = arguments.length === 1 && arguments[0] instanceof Array ?
        arguments[0] :
        slice.call(arguments);
    return observableCreateWithDisposable(function (observer) {
        var pos = 0, subscription = new SerialDisposable(),
        cancelable = immediateScheduler.scheduleRecursive(function (self) {
            var current, d;
            if (pos < sources.length) {
                current = sources[pos++];
                d = new SingleAssignmentDisposable();
                subscription.disposable(d);
                d.disposable(current.subscribe(function (x) {
                    observer.onNext(x);
                }, function () {
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
observableProto._combine = function (rightSource, combinerSelector) {
    var leftSource = this;
    return observableCreateWithDisposable(function (observer) {
        var leftSubscription = new SingleAssignmentDisposable(),
            rightSubscription = new SingleAssignmentDisposable(),
            combiner = combinerSelector(observer, leftSubscription, rightSubscription);
        leftSubscription.disposable(leftSource.materialize().select(function (x) {
            return { switchValue: function (l) { return l(x); } };
        }).subscribe(combiner));
        rightSubscription.disposable(rightSource.materialize().select(function (x) {
            return { switchValue: function (l, r) { return r(x); } };
        }).subscribe(combiner));
        return new CompositeDisposable(leftSubscription, rightSubscription);
    });
};
var ZipHelper = (function () {
    function ZipHelper(selector, observer) {
        var self = this;
        this.selector = selector;
        this.observer = observer;
        this.leftQ = [];
        this.rightQ = [];
        this.left = observerCreate(function (left) {
            if (left.kind === 'E') {
                self.observer.onError(left.exception);
                return;
            }
            if (self.rightQ.length === 0) {
                self.leftQ.push(left);
            } else {
                self.onNext(left, self.rightQ.shift());
            }
        });
        this.right = observerCreate(function (right) {
            if (right.kind === 'E') {
                self.observer.onError(right.exception);
                return;
            }
            if (self.leftQ.length === 0) {
                self.rightQ.push(right);
            } else {
                self.onNext(self.leftQ.shift(), right);
            }
        });
    }
    ZipHelper.prototype.onNext = function (left, right) {
        var result;
        if (left.kind === 'C' || right.kind === 'C') {
            this.observer.onCompleted();
            return;
        }
        try {
            result = this.selector(left.value, right.value);
        } catch (ex) {
            this.observer.onError(ex);
            return;
        }
        this.observer.onNext(result);
    };
    return ZipHelper;
})();
observableProto.zip = function (second, resultSelector) {
    var first = this;
    return first._combine(second, function (observer) {
        var combiner = new ZipHelper(resultSelector, observer);
        return new BinaryObserver(function (x) {
            return combiner.left.onNext(x);
        }, function (x) {
            return combiner.right.onNext(x);
        });
    });
};
var CombineLatestHelper;
CombineLatestHelper = (function () {
    function CombineLatestHelper(selector, observer) {
        var self = this;
        this.selector = selector;
        this.observer = observer;
        this.leftStopped = false;
        this.rightStopped = false;
        this.left = observerCreate(function (left) {
            if (left.kind === 'N') {
                self.leftValue = left;
                if (self.rightValue !== _undefined) {
                    self.onNext();
                } else if (self.rightStopped) {
                    self.observer.onCompleted();
                }
            } else if (left.kind === 'E') {
                self.observer.onError(left.exception);
            } else {
                self.leftStopped = true;
                if (self.rightStopped) {
                    self.observer.onCompleted();
                }
            }
        });
        this.right = observerCreate(function (right) {
            if (right.kind === 'N') {
                self.rightValue = right;
                if (self.leftValue !== _undefined) {
                    self.onNext();
                } else if (self.leftStopped) {
                    self.observer.onCompleted();
                }
            } else if (right.kind === 'E') {
                self.observer.onError(right.exception);
            } else {
                self.rightStopped = true;
                if (self.leftStopped) {
                    self.observer.onCompleted();
                }
            }
        });
    }
    CombineLatestHelper.prototype.onNext = function () {
        var result;
        try {
            result = this.selector(this.leftValue.value, this.rightValue.value);
        } catch (ex) {
            this.observer.onError(ex);
            return;
        }
        this.observer.onNext(result);
    };
    return CombineLatestHelper;
})(); 
observableProto.combineLatest = function(second, resultSelector) {
  return this._combine(second, function(observer) {
    var combiner = new CombineLatestHelper(resultSelector, observer);
    return new BinaryObserver(function(x) {
      return combiner.left.onNext(x);
    }, function(x) {
      return combiner.right.onNext(x);
    });
  });
};
observableProto.takeUntil = function (other) {
    var source = this;
    return other._combine(source, function (observer, otherSubscription) {
        var isOtherStopped = false, isSourceStopped = false;
        return new BinaryObserver(function (otherValue) {
            if (!isSourceStopped && !isOtherStopped) {
                if (otherValue.kind === 'C') {
                    isOtherStopped = true;
                } else if (otherValue.kind === 'E') {
                    isOtherStopped = true;
                    isSourceStopped = true;
                    observer.onError(otherValue.exception);
                } else {
                    isSourceStopped = true;
                    observer.onCompleted();
                }
            }
        }, function (sourceValue) {
            if (!isSourceStopped) {
                sourceValue.accept(observer);
                isSourceStopped = sourceValue.kind !== 'N';
                if (isSourceStopped) {
                    otherSubscription.dispose();
                }
            }
        });
    });
};
observableProto.skipUntil = function (other) {
    return this._combine(other, function (observer, leftSubscription, rightSubscription) {
        var open = false, rightStopped = false;
        return new BinaryObserver(function (left) {
            if (open) {
                left.accept(observer);
            }
        }, function (right) {
            if (!rightStopped) {
                if (right.kind === 'N') {
                    open = true;
                } else if (right.kind === 'E') {
                    observer.onError(right.exception);
                }
                rightStopped = true;
                rightSubscription.dispose();
            }
        });
    });
};
Observable.amb = function () {
    var acc = observableNever(),
        func = function (previous, current) {
            return previous.amb(current);
        }, 
        i,
        items = arguments.length === 1 && arguments[0] instanceof Array ?
            arguments[0] :
            slice.call(arguments);
    for (i = 0; i < items.length; i++) {
        acc = func(acc, items[i]);
    }
    return acc;
};
observableProto.amb = function (rightSource) {
    return this._combine(rightSource, function (observer, leftSubscription, rightSubscription) {
        var choice = 'N';
        return new BinaryObserver(function (left) {
            if (choice === 'N') {
                choice = 'L';
                rightSubscription.dispose();
            }
            if (choice === 'L') {
                left.accept(observer);
            }
        }, function (right) {
            if (choice === 'N') {
                choice = 'R';
                leftSubscription.dispose();
            }
            if (choice === 'R') {
                right.accept(observer);
            }
        });
    });
};
})(this);
