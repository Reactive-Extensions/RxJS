# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
# `Rx.Scheduler` class #

Provides a set of static methods to access commonly used schedulers and a base class for all schedulers.

## Usage ##

The follow example shows the basic usage of an `Rx.Scheduler`.

```js
var disposable = Rx.Scheduler.default.schedule(
  'world',
  function (scheduler, x) { console.log('hello ' + x); }
);

// => hello world
```

### Location

File:
- [`scheduler.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.js)
- [`scheduler.periodic.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.periodic.js)
- [`scheduler.recursive.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.recursive.js)
- [`scheduler.wrappers.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.wrappers.js)
- [`currentthreadscheduler.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/currentthreadscheduler.js)
- [`defaultscheduler.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/defaultscheduler.js)
- [`immediatescheduler.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/immediatescheduler.js)


Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

## `Scheduler Instance Methods` ##
- [`catch`](#rxschedulerprototypecatchhandler)
- [`now`](#rxschedulerprototypenow)

### Standard Scheduling ###
- [`schedule`](#rxschedulerprototypeschedulestate-action)
- [`scheduleFuture`](#rxschedulerprototypeschedulefuturestate-duetime-action)

### Recursive Scheduling ###
- [`scheduleRecursive`](#rxschedulerprototypeschedulerecursivestate-action)
- [`scheduleRecursiveFuture`](#rxschedulerprototypeschedulerecursivefuturestate-duetime-action)

### Periodic Scheduling ###
- [`schedulePeriodic`](#rxschedulerscheduleperiodicstate-period-action)

## `Scheduler` Class Methods ##
- [`normalize`](#rxschedulernormalizetimespan)
- [`isScheduler`](#rxschedulerisschedulerobj)

## `Scheduler` Class Properties ##
- [`currentThread`](#rxschedulercurrentthread)
- [`immediate`](#rxschedulerimmediate)
- [`default` | `async`](#rxschedulerdefault)

## _Scheduler Instance Methods_ ##

### <a id="rxschedulerprototypecatchhandler"></a>`Rx.Scheduler.prototype.catch(handler)`
<a href="#rxschedulerprototypecatchhandler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.wrappers.js "View in source")

Returns a scheduler that wraps the original scheduler, adding exception handling for scheduled actions.

#### Arguments
1. `handler` `Function`: Handler that's run if an exception is caught. The error will be rethrown if the handler returns `false`.

#### Returns
`Scheduler`: Wrapper around the original scheduler, enforcing exception handling.

#### Example

```js
SchedulerError.prototype = Object.create(Error.prototype);

function SchedulerError(message) {
  this.message = message;
  Error.call(this);
}

var scheduler = Rx.Scheduler.default;
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

***

### <a id="rxschedulerprototypenow"></a>`Rx.Scheduler.prototype.now()`
<a href="#rxschedulerprototypenow">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.js "View in source")

Gets the current time according to the Scheduler implementation.

#### Returns
`Number`: The current time according to the Scheduler implementation.

#### Example

```js
var now = Rx.Scheduler.default.now();

console.log(now);
// => 1381806323143
```

### Location

- rx.js

***

### Standard Scheduling ###

***

### <a id="rxschedulerprototypeschedulestate-action"></a>`Rx.Scheduler.prototype.schedule(state, action)`
<a href="#rxschedulerprototypeschedulestate-action">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.js "View in source")

Schedules an action to be executed with state.

#### Arguments
1. `state`: Any: State passed to the action to be executed.
2. `action`: `Function`: Action to execute with the following arguments:
  1. `scheduler`: `Scheduler` - The current Scheduler
  2. `state`: `Any` - The current state

#### Returns
`Disposable`: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
var disposable = Rx.Scheduler.immediate.schedule('world', function (scheduler, x) {
   console.log('hello ' + x);
});

// => hello world

// Tries to cancel but too late since it is immediate
disposable.dispose();
```

***

### <a id="rxschedulerprototypeschedulefuturestate-duetime-action"></a>`Rx.Scheduler.prototype.scheduleFuture(state, dueTime, action)`
<a href="#rxschedulerprototypeschedulefuturestate-duetime-action"">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.js "View in source")

Schedules an action to be executed at the specified relative due time. Note this only works with the built-in `Rx.Scheduler.default` scheduler, as the rest will throw an exception as the framework does not allow for blocking.

#### Arguments
1. `state` `Any`: State passed to the action to be executed.
2. `dueTime` `Number` | `Date`: Relative or absolute time at which to execute the action.
3. `action`: `Function`: Action to execute with the following arguments:
  1. `scheduler`: `Scheduler` - The current Scheduler
  2. `state`: `Any` - The current state

#### Returns
`Disposable`: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
/* Relative schedule */
var disposable = Rx.Scheduler.default.scheduleFuture(
  'world',
  5000, /* 5 seconds in the future */
  function (scheduler, x) {
    console.log('hello ' + x + ' after 5 seconds');
  }
);
// => hello world after 5 seconds

/* Absolute schedule */
var disposable = Rx.Scheduler.default.scheduleFuture(
  'world',
  new Date(Date.now() + 5000), /* 5 seconds in the future */
  function (scheduler, x) {
    console.log('hello ' + x + ' after 5 seconds');
  }
);
// => hello world after 5 seconds
```

***

### Recursive Scheduling ###

### <a id="rxschedulerprototypeschedulerecursivestate-action"></a>`Rx.Scheduler.prototype.scheduleRecursive(state, action)`
<a href="#rxschedulerprototypeschedulerecursivestate-action">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.recursive.js "View in source")

Schedules an action to be executed with state.

#### Arguments
1. `state` `Any`: State passed to the action to be executed.
2. `action`: `Function`: Action to execute with the following parameters:
  1. `state`: `Any` - The state passed in
  2. `recurse`: `Function` - The action to execute for recursive actions which takes the form of `recurse(newState)` where the new state is passed to be executed again.

#### Returns
`Disposable`: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
var disposable = Rx.Scheduler.default.scheduleRecursive(
   0,
   function (i, recurse) {
    console.log(i); if (++i < 3) { recurse(i); }
   }
);

// => 0
// => 1
// => 2
```

***

### <a id="rxschedulerprototypeschedulerecursivefuturestate-duetime-action"></a>`Rx.Scheduler.prototype.scheduleRecursiveFuture(state, dueTime, action)`
<a href="#rxschedulerprototypeschedulerecursivefuturestate-duetime-action">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.recursive.js#L114-118 "View in source")

Schedules an action to be executed recursively at a specified absolute or relative due time. Note this only works with the built-in `Rx.Scheduler.timeout` scheduler, as the rest will throw an exception as the framework does not allow for blocking.

#### Arguments
1. `state` `Any`: State passed to the action to be executed.
2. `dueTime` `Number`: Absolute time at which to execute the action for the first time.
2. `action`: `Function`: Action to execute with the following parameters:
  1. `state`: `Any` - The state passed in
  2. `recurse`: `Function` - The action to execute for recursive actions which takes the form of `recurse(newState, dueTime)`.

#### Returns
`Disposable`: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
/* Absolute recursive future */
var disposable = Rx.Scheduler.default.scheduleRecursiveFuture(
  0,
  new Date(Date.now() + 5000), /* 5 seconds in the future */
  function (i, self) {
    console.log(i);
    if (++i < 3) {
      // Schedule mutliplied by a second by position
      self(i, new Date(Date.now() + (i * 1000)));
    }
  }
);

// => 0
// => 1
// => 2

/* Relative recursive future */
var disposable = Rx.Scheduler.default.scheduleRecursiveFuture(
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

***

### Periodic Scheduling ###

### <a id="rxschedulerscheduleperiodicstate-period-action"></a>`Rx.Scheduler.prototype.schedulePeriodic(state, period, action)`
<a href="#rxschedulerscheduleperiodicstate-period-action">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.periodic.js#L20-31 "View in source")

Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using `window.setInterval` for the base implementation.

#### Arguments
1. `state` `Any`: State passed to the action to be executed.
2. `period` `Number`: Period for running the work periodically in ms.
3. `action`: `Function`: Action to execute with the following parameters.  Note that the return value from this function becomes the state in the next execution of the action.
  1. `state`: `Any` - The state passed in

#### Returns
`Disposable`: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
var disposable = Rx.Scheduler.default.schedulePeriodic(
  0,
  1000, /* 1 second */
  function (i) {
    console.log(i);

    // After three times, dispose
    if (++i > 3) { disposable.dispose(); }

    return i;
});

// => 0
// => 1
// => 2
// => 3
```

***

## _Scheduler Class Methods_ ##

### <a id="rxschedulernormalizetimespan"></a>`Rx.Scheduler.normalize(timeSpan)`
<a href="#rxschedulernormalizetimespan">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.js#L87-90 "View in source")

Normalizes the specified time span value to a positive value.

#### Arguments
1. `timeSpan` `Number`: The time span value to normalize.

#### Returns
`Number`: The specified time span value if it is zero or positive; otherwise, 0

#### Example

```js
var r1 = Rx.Scheduler.normalize(-1);
console.log(r1);
// => 0

var r2 = Rx.Scheduler.normalize(255);
console.log(r2);
// => 255
```

***

### <a id="rxschedulerisschedulerobj"></a>`Rx.Scheduler.isScheduler(obj)`
<a href="#rxschedulerisschedulerobj">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/scheduler.js "View in source")

Determines whether the given object is a `Scheduler` instance

#### Arguments
1. `obj` `Any`: The object to determine whether it is a `Scheduler` instance

#### Returns
`Boolean`: Whether the given object is a Scheduler.

#### Example

```js
var isScheduler = Rx.Scheduler.isScheduler(Rx.Scheduler.default);
console.log('Is scheduler? %s', isScheduler);
// Is scheduler? true
```

***

## _Scheduler Class Properties_ ##

### <a id="rxschedulercurrentthread"></a>`Rx.Scheduler.currentThread`
<a href="#rxschedulercurrentthread">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/currentthreadscheduler.js "View in source")

Gets a scheduler that schedules work as soon as possible on the current thread.  This implementation does not support relative and absolute scheduling due to thread blocking required.

#### Example
```js
var scheduler = Rx.Scheduler.currentThread;

var disposable = scheduler.schedule(
   'world',
   function (scheduler, x) {
      console.log('hello ' + x);
   });

// => hello world
```

### Location

- rx.js

***

### <a id="rxschedulerimmediate"></a>`Rx.Scheduler.immediate`
<a href="#rxschedulerimmediate">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/immediatescheduler.js "View in source")

Gets a scheduler that schedules work immediately on the current thread.

#### Example
```js
var scheduler = Rx.Scheduler.immediate;

var disposable = scheduler.scheduleRecursive(
  0,
  function (x, self) {
    console.log(x);
    if (++x < 3) { self(x); }
  }
);

// => 0
// => 1
// => 2
```

### Location

- rx.js

***

### <a id="rxschedulerdefault"></a>`Rx.Scheduler.default`
<a href="#rxschedulerdefault">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/defaultscheduler.js "View in source")

Gets a scheduler that schedules work via a timed callback based upon platform.  An alias exists as `Rx.Scheduler.async`.

For all schedule calls, it defaults to:

 - Node.js: uses `setImmediate` for newer builds, and `process.nextTick` for older versions.
 - Browser: depending on platform may use `setImmediate`, `MessageChannel`, `window.postMessage` and for older versions of IE, it will default to `script.onreadystatechanged`, else falls back to `window.setTimeout`.

For all relative and absolute scheduling, it defaults to using `window.setTimeout`.

#### Example
```js
var scheduler = Rx.Scheduler.default;

var disposable = scheduler.schedule(
  0,
  function (scheduler, x) {
    console.log(x);
  }
);

// => 0
```

***
