# `Rx.Scheduler` class #

Provides a set of static methods to access commonly used schedulers and a base class for all schedulers.

## Usage ##

The follow example shows the basic usage of an `Rx.Scheduler`.

```js
var disposable = Rx.Scheduler.timeout.scheduleWithState(
     'world',
     function (x) {
          console.log('hello ' + x);
     }
);

// => hello world
```

### Location

- rx.js

## `Scheduler Constructor` ##
- [`constructor`](#rxschedulernow-schedule-schedulerelative-scheduleabsolute)

## `Scheduler Instance Methods` ##
- [`catch`](#rxschedulerprototypecatchhandler)
- [`now`](#rxschedulerprototypenow)

### Standard Scheduling ###
- [`schedule`](#rxschedulerprototypescheduleaction)
- [`scheduleWithState`](#rxschedulerprototypeschedulewithstatestate-action)
- [`scheduleWithAbsolute`](#rxschedulerprototypeschedulewithabsoluteduetime-action)
- [`scheduleWithAbsoluteAndState`](#rxschedulerprototypeschedulewithabsoluteandstatestate-duetime-action)
- [`scheduleWithRelative`](#rxschedulerprototypeschedulewithrelativeduetime-action)
- [`scheduleWithRelativeAndState`](#rxschedulerprototypeschedulewithrelativeandstatestate-duetime-action)

### Recursive Scheduling ###
- [`scheduleRecursive`](#rxschedulerprototypeschedulerecursiveaction)
- [`scheduleRecursiveWithState`](#rxschedulerprototypeschedulerecursivewithstatestate-action)
- [`scheduleRecursiveWithAbsolute`](#rxschedulerprototypeschedulerecursivewithabsoluteduetime-action)
- [`scheduleRecursiveWithAbsoluteAndState`](#rxschedulerprototypeschedulerecursivewithabsoluteandstatestate-duetime-action)
- [`scheduleRecursiveWithRelative`](#rxschedulerprototypeschedulerecursivewithrelativeduetime-action)
- [`scheduleRecursiveWithRelativeAndState`](#rxschedulerprototypeschedulerecursivewithrelativeandstatestate-duetime-action)

### Periodic Scheduling ###
- [`schedulePeriodic`](#rxschedulerprototypescheduleperiodicperiod-action)
- [`schedulePeriodicWithState`](#rxschedulerscheduleperiodicwithstatestate-period-action)

## `Scheduler Class Methods ##
- [`normalize`](#rxschedulernormalizetimespan)

## `Scheduler Class Properties` ##
- [`currentThread`](#rxschedulercurrentthread)
- [`immediate`](#rxschedulerimmediate)
- [`timeout`](#rxschedulertimeout)

## _Scheduler Constructor_ ##

### <a id="rxschedulernow-schedule-schedulerelative-scheduleabsolute"></a>`Rx.Scheduler(now, schedule, scheduleRelative, scheduleAbsolute)`
<a href="#rxschedulernow-schedule-schedulerelative-scheduleabsolute">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.js "View in source")

Initializes a new instance of the `Rx.Scheduler`.  This is meant for Scheduler implementers and not normal usage.

#### Arguments
1. `now` *(Function)*: Function which gets the current time according to the local machine's system clock.
2. `schedule` *(Function)*: Function to schedule an action immediately.
3. `scheduleRelative` *(Function)*: Function used to schedule an action in relative time.
4. `scheduleAbsolute` *(Function)*: Function used to schedule an action in absolute time.

#### Example
```js
// Used for scheduling immediately
function schedule(state, action) {
     var scheduler = this,
          disposable = new Rx.SingleAssignmentDisposable();

     var id = setTimeout(function () {
          if (!disposable.isDisposed) {
               disposable.setDisposable(action(scheduler, state));
          }
     }, 0);

     return new CompositeDisposable(disposable, disposableCreate(function () {
          clearMethod(id);
     }));
}

// Used for scheduling relative to now
function scheduleRelative(state, dueTime, action) {
     var scheduler = this,
          dt = Scheduler.normalize(dueTime);

     // Shortcut if already 0
     if (dt === 0) {
          return scheduler.scheduleWithState(state, action);
     }

     var disposable = new Rx.SingleAssignmentDisposable();
     var id = window.setTimeout(function () {
          if (!disposable.isDisposed) {
               disposable.setDisposable(action(scheduler, state));
          }
     }, dt);

     return new CompositeDisposable(disposable, disposableCreate(function () {
          window.clearTimeout(id);
     }));
}

// Used for scheduling in absolute time
function scheduleAbsolute(state, dueTime, action) {
     return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
}

var timeoutScheduler = new Rx.Scheduler(
     Date.now,
     schedule,
     scheduleRelative,
     scheduleAbsolute
);

var handle = timeoutScheduler.schedule(function () {
     console.log('hello');
});

// => hello
```

### Location

- rx.js

* * *

## _Scheduler Instance Methods_ ##

### <a id="rxschedulerprototypecatchhandler"></a>`Rx.Scheduler.prototype.catch(handler)`
### `Rx.Scheduler.prototype.catchError(handler)`
<a href="#rxschedulerprototypecatchhandler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.wrappers.js#L7-9 "View in source")

Returns a scheduler that wraps the original scheduler, adding exception handling for scheduled actions. There is an alias called `catchError` for browsers < IE9.

#### Arguments
1. `handler` *(Function)*: Handler that's run if an exception is caught. The exception will be rethrown if the handler returns `false`.

#### Returns
*(Scheduler)*: Wrapper around the original scheduler, enforcing exception handling.

#### Example

```js
function inherits (ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
}

inherits (SchedulerError, Error);

function SchedulerError(message) {
    Error.call(this, message);
}

var scheduler = Rx.Scheduler.timeout;
var catchScheduler = scheduler.catch(function (e) {
    return e instanceof SchedulerError;
});

// Throws no exception
var d1 = catchScheduler.schedule(function () {
    throw new SchedulerError('woops');
});

var d2 = catchScheduler.schedule(function () {
    throw new Error('woops');
});

// => Uncaught Error: woops
```

### Location

- rx.js

* * *

### <a id="rxschedulerprototypenow"></a>`Rx.Scheduler.prototype.now()`
<a href="#rxschedulerprototypenow">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.js#L80 "View in source")

Gets the current time according to the Scheduler implementation.

#### Returns
*(Number)*: The current time according to the Scheduler implementation.

#### Example

```js
var now = Rx.Scheduler.timeout.now();

console.log(now);
// => 1381806323143
```

### Location

- rx.js

* * *

### Standard Scheduling ###

### <a id="rxschedulerprototypescheduleaction"></a>`Rx.Scheduler.prototype.schedule(action)`
<a href="#rxschedulerprototypescheduleaction">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.js#L23-25 "View in source")

Schedules an action to be executed.

#### Arguments
1. `action` *(Function)*: Action to execute.

#### Returns
*(Disposable)*: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
var disposable = Rx.Scheduler.immediate.schedule(function () {
     console.log('hello');
});

// => hello

// Tries to cancel but too late since it is immediate
disposable.dispose();
```

### Location

- rx.js

* * *

### <a id="rxschedulerprototypeschedulewithstatestate-action"></a>`Rx.Scheduler.prototype.scheduleWithState(state, action)`
<a href="#rxschedulerprototypeschedulewithstatestate-action">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.js#L33-35 "View in source")

Schedules an action to be executed with state.

#### Arguments
1. `state` *(Any)*: State passed to the action to be executed.
2. `action` *(Function)*: Action to execute.

#### Returns
*(Disposable)*: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
var disposable = Rx.Scheduler.immediate.scheduleWithState('world', function (x) {
     console.log('hello ' + x);
});

// => hello world

// Tries to cancel but too late since it is immediate
disposable.dispose();
```

### Location

- rx.js

* * *

### <a id="rxschedulerprototypeschedulewithabsoluteduetime-action"></a>`Rx.Scheduler.prototype.scheduleWithAbsolute(dueTime, action)`
<a href="#rxschedulerprototypeschedulewithabsoluteduetime-action">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.js#L64-66 "View in source")

Schedules an action to be executed at the specified absolute due time. Note this only works with the built-in `Rx.Scheduler.timeout` scheduler, as the rest will throw an exception as the framework does not allow for blocking.

#### Arguments
1. `dueTime` *(Number)*: Absolute time at which to execute the action.
2. `action` *(Function)*: Action to execute.

#### Returns
*(Disposable)*: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
var disposable = Rx.Scheduler.timeout.scheduleWithAbsolute(
     Date.now() + 5000, /* 5 seconds in the future */
     function () {
          console.log('hello');
     }
);

// => hello
```

### Location

- rx.js

* * *

### <a id="rxschedulerprototypeschedulewithabsoluteandstatestate-duetime-action"></a>`Rx.Scheduler.prototype.scheduleWithAbsoluteAndState(state, dueTime, action)`
<a href="#rxschedulerprototypeschedulewithabsoluteandstatestate-duetime-action">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.js#L75-77 "View in source")

Schedules an action to be executed at the specified absolute due time. Note this only works with the built-in `Rx.Scheduler.timeout` scheduler, as the rest will throw an exception as the framework does not allow for blocking.

#### Arguments
1. `state` *(Any)*: State passed to the action to be executed.
2. `dueTime` *(Number)*: Absolute time at which to execute the action.
3. `action` *(Function)*: Action to execute.

#### Returns
*(Disposable)*: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
var disposable = Rx.Scheduler.timeout.scheduleWithAbsoluteAndState(
     'world',
     Date.now() + 5000, /* 5 seconds in the future */
     function (x) {
          console.log('hello ' + x);
     }
);

// => hello world
```

### Location

- rx.js

* * *

### <a id="rxschedulerprototypeschedulewithrelativeduetime-action"></a>`Rx.Scheduler.prototype.scheduleWithRelative(dueTime, action)`
<a href="#rxschedulerprototypeschedulewithrelativeduetime-action">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.js#L43-45 "View in source")

Schedules an action to be executed after the specified relative due time. Note this only works with the built-in `Rx.Scheduler.timeout` scheduler, as the rest will throw an exception as the framework does not allow for blocking.

#### Arguments
1. `dueTime` *(Number)*: Relative time at which to execute the action.
2. `action` *(Function)*: Action to execute.

#### Returns
*(Disposable)*: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
var disposable = Rx.Scheduler.timeout.scheduleWithRelative(
     5000, /* 5 seconds in the future */
     function () {
          console.log('hello');
     }
);

// => hello
```

### Location

- rx.js

* * *

### <a id="rxschedulerprototypeschedulewithrelativeandstatestate-duetime-action"></a>`Rx.Scheduler.prototype.scheduleWithRelativeAndState(state, dueTime, action)`
<a href="#rxschedulerprototypeschedulewithrelativeandstatestate-duetime-action">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.js#L54-56 "View in source")

Schedules an action to be executed at the specified relative due time. Note this only works with the built-in `Rx.Scheduler.timeout` scheduler, as the rest will throw an exception as the framework does not allow for blocking.

#### Arguments
1. `state` *(Any)*: State passed to the action to be executed.
2. `dueTime` *(Number)*: Relative time at which to execute the action.
3. `action` *(Function)*: Action to execute.

#### Returns
*(Disposable)*: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
var disposable = Rx.Scheduler.timeout.scheduleWithRelativeAndState(
     'world',
     5000, /* 5 seconds in the future */
     function (x) {
          console.log('hello ' + x);
     }
);

// => hello world
```

### Location

- rx.js

* * *

### Recursive Scheduling ###

### <a id="rxschedulerprototypeschedulerecursiveaction"></a>`Rx.Scheduler.prototype.scheduleRecursive(action)`
<a href="#rxschedulerprototypeschedulerecursiveaction">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.recursive.js#L59-62 "View in source")

Schedules an action to be executed recursively.

#### Arguments
1. `action` *(Function)*: Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action.

#### Returns
*(Disposable)*: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
var i = 0;

var disposable = Rx.Scheduler.immediate.scheduleRecursive(
     function (self) {
          console.log(i);
          if (++i < 3) {
               self(i);
          }
     }
);

// => 0
// => 1
// => 2
```

### Location

- rx.js

* * *

### <a id="rxschedulerprototypeschedulerecursivewithstatestate-action"></a>`Rx.Scheduler.prototype.scheduleRecursiveWithState(state, action)`
<a href="#rxschedulerprototypeschedulerecursivewithstatestate-action">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.recursive.js#L70-72 "View in source")

Schedules an action to be executed with state.

#### Arguments
1. `state` *(Any)*: State passed to the action to be executed.
2. `action` *(Function)*: Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in recursive invocation state.

#### Returns
*(Disposable)*: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
var disposable = Rx.Scheduler.immediate.scheduleRecursiveWithState(
     0,
     function (i, self) {
          console.log(i);
          if (++i < 3) {
               self(i);
          }
     }
);

// => 0
// => 1
// => 2
```

### Location

- rx.js

* * *

### <a id="rxschedulerprototypeschedulerecursivewithabsoluteduetime-action"></a>`Rx.Scheduler.prototype.scheduleRecursiveWithAbsolute(dueTime, action)`
<a href="#rxschedulerprototypeschedulerecursivewithabsoluteduetime-action">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.recursive.js#L103-105 "View in source")

Schedules an action to be executed recursively at a specified absolute due time. Note this only works with the built-in `Rx.Scheduler.timeout` scheduler, as the rest will throw an exception as the framework does not allow for blocking.

#### Arguments
1. `dueTime` *(Number)*: Absolute time at which to execute the action for the first time.
2. `action` *(Function)*: Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action at the specified absolute time.

#### Returns
*(Disposable)*: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
var i = 0;

var disposable = Rx.Scheduler.timeout.scheduleRecursiveWithAbsolute(
     Date.now() + 5000, /* 5 seconds in the future */
     function (self) {
          console.log(i);
          if (++i < 3) {
               // Schedule mutliplied by a second by position
               self(Date.now() + (i * 1000));
          }
     }
);

// => 0
// => 1
// => 2
```

### Location

- rx.js

* * *

### <a id="rxschedulerprototypeschedulerecursivewithabsoluteandstatestate-duetime-action"></a>`Rx.Scheduler.prototype.scheduleRecursiveWithAbsoluteAndState(state, dueTime, action)`
<a href="#rxschedulerprototypeschedulerecursivewithabsoluteandstatestate-duetime-action">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.recursive.js#L114-118 "View in source")

Schedules an action to be executed recursively at a specified absolute due time. Note this only works with the built-in `Rx.Scheduler.timeout` scheduler, as the rest will throw an exception as the framework does not allow for blocking.

#### Arguments
1. `state` *(Any)*: State passed to the action to be executed.
2. `dueTime` *(Number)*: Absolute time at which to execute the action for the first time.
3. `action` *(Function)*: Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.

#### Returns
*(Disposable)*: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
var disposable = Rx.Scheduler.timeout.scheduleRecursiveWithAbsoluteAndState(
     0,
     Date.now() + 5000, /* 5 seconds in the future */
     function (i, self) {
          console.log(i);
          if (++i < 3) {
               // Schedule mutliplied by a second by position
               self(i, Date.now() + (i * 1000));
          }
     }
);

// => 0
// => 1
// => 2
```

### Location

- rx.js

* * *

### <a id="rxschedulerprototypeschedulerecursivewithrelativeduetime-action"></a>`Rx.Scheduler.prototype.scheduleRecursiveWithRelative(dueTime, action)`
<a href="#rxschedulerprototypeschedulerecursivewithrelativeduetime-action">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.recursive.js#L80-82 "View in source")

Schedules an action to be executed recursively at a specified relative due time. Note this only works with the built-in `Rx.Scheduler.timeout` scheduler, as the rest will throw an exception as the framework does not allow for blocking.

#### Arguments
1. `dueTime` *(Number)*: Relative time at which to execute the action for the first time.
2. `action` *(Function)*: Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action at the specified relative time.

#### Returns
*(Disposable)*: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
var i = 0;

var disposable = Rx.Scheduler.timeout.scheduleRecursiveWithRelative(
     5000, /* 5 seconds in the future */
     function (self) {
          console.log(i);
          if (++i < 3) {
               // Schedule mutliplied by a second by position
               self(i * 1000);
          }
     }
);

// => 0
// => 1
// => 2
```

### Location

- rx.js

* * *

### <a id="rxschedulerprototypeschedulerecursivewithrelativeandstatestate-duetime-action"></a>`Rx.Scheduler.prototype.scheduleRecursiveWithRelativeAndState(state, dueTime, action)`
<a href="#rxschedulerprototypeschedulerecursivewithrelativeandstatestate-duetime-action">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.recursive.js#L91-95 "View in source")

Schedules an action to be executed recursively at a specified relative due time. Note this only works with the built-in `Rx.Scheduler.timeout` scheduler, as the rest will throw an exception as the framework does not allow for blocking.

#### Arguments
1. `state` *(Any)*: State passed to the action to be executed.
2. `dueTime` *(Number)*: Relative time at which to execute the action for the first time.
3. `action` *(Function)*: Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.

#### Returns
*(Disposable)*: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
var disposable = Rx.Scheduler.timeout.scheduleRecursiveWithRelativeAndState(
     0,
     5000, /* 5 seconds in the future */
     function (i, self) {
          console.log(i);
          if (++i < 3) {
               // Schedule mutliplied by a second by position
               self(i, i * 1000);
          }
     }
);

// => 0
// => 1
// => 2
```

### Location

- rx.js

* * *

### Periodic Scheduling ###

### <a id="rxschedulerprototypescheduleperiodicperiod-action"></a>`Rx.Scheduler.prototype.schedulePeriodic(period, action)`
<a href="#rxschedulerprototypescheduleperiodicperiod-action">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.periodic.js#L9-11 "View in source")

 Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using `window.setInterval` for the base implementation.

#### Arguments
1. `period` *(Number)*: Period for running the work periodically in ms.
1. `action` *(Function)*: Action to execute.

#### Returns
*(Disposable)*: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
var i = 0;

var disposable = Rx.Scheduler.timeout.schedulePeriodic(
     1000, /* 1 second */
     function () {
          console.log(i);

          // After three times, dispose
          if (++i > 3) {
               disposable.dispose();
          }
});

// => 0
// => 1
// => 2
// => 3
```

### Location

- rx.js

* * *

### <a id="rxschedulerscheduleperiodicwithstatestate-period-action"></a>`Rx.Scheduler.prototype.schedulePeriodicWithState(state, period, action)`
<a href="#rxschedulerscheduleperiodicwithstatestate-period-action">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.periodic.js#L20-31 "View in source")

Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using `window.setInterval` for the base implementation.

#### Arguments
1. `state` *(Any)*: State passed to the action to be executed.
2. `period` *(Number)*: Period for running the work periodically in ms.
2. `action` *(Function)*: Action to execute.

#### Returns
*(Disposable)*: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
var disposable = Rx.Scheduler.timeout.schedulePeriodicWithState(
     0,
     1000, /* 1 second */
     function (i) {
          console.log(i);

          // After three times, dispose
          if (++i > 3) {
               disposable.dispose();
          }

          return i;
});

// => 0
// => 1
// => 2
// => 3
```

### Location

- rx.js

* * *

## _Scheduler Class Methods_ ##

### <a id="rxschedulernormalizetimespan"></a>`Rx.Scheduler.normalize(timeSpan)`
<a href="#rxschedulernormalizetimespan">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.js#L87-90 "View in source")

Normalizes the specified time span value to a positive value.

#### Arguments
1. `timeSpan` *(Number)*: The time span value to normalize.

#### Returns
*(Number)*: The specified time span value if it is zero or positive; otherwise, 0

#### Example

```js
var r1 = Rx.Scheduler.normalize(-1);
console.log(r1);
// => 0

var r2 = Rx.Scheduler.normalize(255);
console.log(r1);
// => 255
```

### Location

- rx.js

* * *

## _Scheduler Class Properties_ ##

### <a id="rxschedulercurrentthread"></a>`Rx.Scheduler.currentThread`
<a href="#rxschedulercurrentthread">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/currentthreadscheduler.js "View in source")

Gets a scheduler that schedules work as soon as possible on the current thread.  This implementation does not support relative and absolute scheduling due to thread blocking required.

#### Example
```js
var scheduler = Rx.Scheduler.currentThread;

var disposable = scheduler.scheduleWithState(
     'world',
     function (x) {
          console.log('hello ' + x);
     });

// => hello world
```

### Location

- rx.js

* * *

### <a id="rxschedulerimmediate"></a>`Rx.Scheduler.immediate`
<a href="#rxschedulerimmediate">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/immediatescheduler.js "View in source")

Gets a scheduler that schedules work immediately on the current thread.

#### Example
```js
var scheduler = Rx.Scheduler.immediate;

var disposable = scheduler.scheduleRecursiveWithState(
     0,
     function (x, self) {
          console.log(x);
          if (++x < 3) {
               self(x);
          }
     }
);

// => 0
// => 1
// => 2
```

### Location

- rx.js

* * *

### <a id="rxschedulertimeout"></a>`Rx.Scheduler.timeout`
<a href="#rxschedulertimeout">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/timeoutscheduler.js "View in source")

Gets a scheduler that schedules work via a timed callback based upon platform.

For all schedule calls, it defaults to:

 - Node.js: uses `setImmediate` for newer builds, and `process.nextTick` for older versions.
 - Browser: depending on platform may use `setImmediate`, `MessageChannel`, `window.postMessage` and for older versions of IE, it will default to `script.onreadystatechanged`, else falls back to `window.setTimeout`.

For all relative and absolute scheduling, it defaults to using `window.setTimeout`.

#### Example
```js
var scheduler = Rx.Scheduler.timeout;

var disposable = scheduler.scheduleWithState(
     0,
     function (x) {
          console.log(x);
     }
);

// => 0
```

### Location

- rx.js

* * *
