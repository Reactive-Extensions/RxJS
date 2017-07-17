# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
# `Rx.VirtualTimeScheduler` class #

Base class for providing scheduling in virtual time.  This inherits from the `Rx.Scheduler` class.

## Usage ##

The following shows an example of using the `Rx.VirtualTimeScheduler`. In order for this to work, you must implement the `add`, `toAbsoluteTime` and `toRelativeTime` methods as described below.

```js
/* Comparer required for scheduling priority */
function comparer (x, y) {
  if (x > y) { return 1; }
  if (x < y) { return -1; }
  return 0;
}

var scheduler = new Rx.VirtualTimeScheduler(0, comparer);

/**
 * Adds a relative time value to an absolute time value.
 * @param {Any} absolute Absolute virtual time value.
 * @param {Any} relative Relative virtual time value to add.
 * @return {Any} Resulting absolute virtual time sum value.
 */
scheduler.add = function (absolute, relative) {
  return absolute + relative;
};

/**
 * Converts an absolute time to a number
 * @param {Number} The absolute time in ms
 * @returns {Number} The absolute time in ms
 */
scheduler.toAbsoluteTime = function (absolute) {
  return new Date(absolute);
};

/**
 * Converts the time span number/Date to a relative virtual time value.
 * @param {Number} timeSpan TimeSpan value to convert.
 * @return {Number} Corresponding relative virtual time value.
 */
scheduler.toRelativeTime = function (timeSpan) {
  return timeSpan;
};

// Schedule some time
scheduler.scheduleAbsolute(null, new Date(1), function () { console.log('foo'); });
scheduler.scheduleAbsolute(null, new Date(2), function () { console.log('bar'); });
scheduler.scheduleAbsolute(null, new Date(3), function () { scheduler.stop(); });

// Start the scheduler
scheduler.start();

// => foo
// => bar

// Check the clock once stopped
console.log(scheduler.now());
// => 3

console.log(scheduler.clock);
// => 3
```


### Location

File:
- [`virtualtimescheduler.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/virtualtimescheduler.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.virtualtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.virtualtime.js)

## `VirtualTimeScheduler Constructor` ##
- [`constructor`](#rxvirtualtimeschedulerinitialclock-comparer)

## `VirtualTimeScheduler Instance Methods` ##
- [`advanceBy`](#rxvirtualtimeschedulerprototypeadvancebytime)
- [`advanceTo`](#rxvirtualtimeschedulerprototypeadvancetotime)
- [`scheduleAbsolute`](#rxvirtualtimeschedulerprototypescheduleabsolutestate-duetime-action)
- [`scheduleRelative`](#rxvirtualtimeschedulerprototypeschedulerelativestate-duetime-action)
- [`sleep`](#rxvirtualtimeschedulerprototypesleeptime)
- [`start`](#rxvritualtimeschedulerprototypestart)
- [`stop`](#rxvritualtimeschedulerprototypestop)

## `VirtualTimeScheduler Instance Properties` ##
- [`isEnabled`](#isenabled)

## `VirtualTimeScheduler Protected Abstract Methods` ##
- [`add`](#rxvirtualtimeschedulerprototypeaddabsolute-relative)
- [`toAbsoluteTime`](#rxvirtualtimeschedulerprototypetoabsolutetimeabsolute)
- [`toRelativeTime`](#rxvirtualtimeschedulerprototypetorelativetimetimespan)

## `VirtualTimeScheduler Protected Methods` ##
- [`getNext`](#rxvirtualtimeschedulerprototypegetnext)

## Inherited Classes ##
- [`Rx.Scheduler`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/schedulers/scheduler.md)

## _VirtualTimeScheduler Constructor_ ##

### <a id="rxvirtualtimescheduler"></a>`Rx.VirtualTimeScheduler(initialClock, comparer)`
<a href="#rxvirtualtimescheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/virtualtimescheduler.js#L38-L44 "View in source")

Creates a new virtual time scheduler with the specified initial clock value and absolute time comparer.

#### Arguments
1. `initialClock` *(Function)*: Initial value for the clock.
2. `comparer` *(Function)*: Comparer to determine causality of events based on absolute time.

#### Example
```js
function comparer (x, y) {
  if (x > y) { return 1; }
  if (x < y) { return -1; }
  return 0;
}

var scheduler = new Rx.VirtualTimeScheduler(
  0,          /* initial clock of 0 */
  comparer    /* comparer for determining order */
);
```

***

## _VirtualTimeScheduler Instance Methods_ ##

### <a id="rxvirtualtimeschedulerprototypeadvancebytime"></a>`Rx.VirtualTimeScheduler.prototype.advanceBy(time)`
<a href="#rxvirtualtimeschedulerprototypeadvancebytime">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/virtualtimescheduler.js#L166-L176 "View in source")

Advances the scheduler's clock by the specified relative time, running all work scheduled for that timespan.

#### Arguments
1. `time` *(Any)*: Relative time to advance the scheduler's clock by.

#### Example
```js
var scheduler = new MyVirtualScheduler(
  200 /* initial time */
);

scheduler.scheduleAbsolute(null, 250, function () {
  console.log('hello');
});

scheduler.advanceBy(300);
// => hello

console.log(scheduler.clock);
// => 500
```

***

### <a id="rxvirtualtimeschedulerprototypeadvancetotime"></a>`Rx.VirtualTimeScheduler.prototype.advanceTo(time)`
<a href="#rxvirtualtimeschedulerprototypeadvancetotime">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/virtualtimescheduler.js "View in source")

Advances the scheduler's clock to the specified time, running all work till that point.

#### Arguments
1. `time` *(Any)*: Absolute time to advance the scheduler's clock to.

#### Example
```js
var scheduler = new MyVirtualScheduler(
  0 /* initial time */
);

scheduler.scheduleAbsolute(null, 100, function () {
  console.log('hello');
});

scheduler.scheduleAbsolute(null, 200, function () {
  console.log('world');
});

scheduler.advanceBy(300);
// => hello
// => world

console.log(scheduler.clock);
// => 300
```

***

### <a id="rxvirtualtimeschedulerprototypescheduleabsolutestate-duetime-action"></a>`Rx.VirtualTimeScheduler.prototype.scheduleAbsolute(state, dueTime, action)`
<a href="#rxvirtualtimeschedulerprototypescheduleabsolutestate-duetime-action">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/virtualtimescheduler.js "View in source")

Schedules an action to be executed at dueTime.

#### Arguments
1. `state`: *(Any)*: State passed to the action to be executed.
2. `dueTime` *(Any)*: Absolute time at which to execute the action.
3. `action`: `Function`: Action to execute with the following arguments:
  1. `scheduler`: `Scheduler` - The current Scheduler
  2. `state`: `Any` - The current state

#### Returns
*(Disposable)*: The disposable object used to cancel the scheduled action (best effort).

#### Example
```js
var scheduler = new MyVirtualScheduler(
  0 /* initial time */
);

scheduler.scheduleAbsolute('world', 100, function (scheduler, state) {
  console.log('hello ' + state);
});

scheduler.scheduleAbsolute('moon', 200, function (scheduler, state) {
  console.log('goodnight ' + state);
});

scheduler.start();
// => hello world
// => goodnight moon

console.log(scheduler.clock);
// => 200
```

***

### <a id="rxvirtualtimeschedulerprototypeschedulerelativestate-duetime-action"></a>`Rx.VirtualTimeScheduler.prototype.scheduleRelative(state, dueTime, action)`
<a href="#rxvirtualtimeschedulerprototypeschedulerelativestate-duetime-action">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/virtualtimescheduler.js#L89-L92 "View in source")

Schedules an action to be executed at dueTime.

#### Arguments
1. `state`: *(Any)*: State passed to the action to be executed.
2. `dueTime` *(Any)*: Relative time after which to execute the action.
3. `action`: `Function`: Action to execute with the following arguments:
  1. `scheduler`: `Scheduler` - The current Scheduler
  2. `state`: `Any` - The current state

#### Returns
*(Disposable)*: The disposable object used to cancel the scheduled action (best effort).

#### Example
```js
var scheduler = new MyVirtualScheduler(
  0 /* initial time */
);

scheduler.scheduleRelative('world', 100, function (scheduler, state) {
  console.log('hello ' + state);
});

scheduler.scheduleRelative('moon', 200, function (scheduler, state) {
  console.log('goodnight ' + state);
});

scheduler.start();
// => hello world
// => goodnight moon

console.log(scheduler.clock);
// => 300
```

***

### <a id="rxvritualtimeschedulerprototypesleeptime"></a>`Rx.VirtualTimeScheduler.prototype.sleep(time)`
<a href="#rxvritualtimeschedulerprototypesleeptime">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/virtualtimescheduler.js#L182-L190 "View in source")

Advances the scheduler's clock by the specified relative time.

#### Arguments
1. `time` *(Any)*: Relative time to advance the scheduler's clock by.

#### Example
```js
var scheduler = new MyVirtualScheduler(
  0 /* initial time */
);

scheduler.sleep(400);

console.log(scheduler.clock);
// => 400
```

***

### <a id="rxvritualtimeschedulerprototypestart"></a>`Rx.VirtualTimeScheduler.prototype.start()`
<a href="#rxvritualtimeschedulerprototypestart">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/virtualtimescheduler.js#L107-L123 "View in source")

Starts the virtual time scheduler.

#### Example
```js
var scheduler = new MyVirtualScheduler(
  0 /* initial time */
);

scheduler.scheduleRelative('world', 100, function (scheduler, state) {
  console.log('hello ' + state);
});

scheduler.scheduleRelative('moon', 200, function (scheduler, state) {
  console.log('goodnight ' + state);
});

scheduler.start();
// => hello world
// => goodnight moon

console.log(scheduler.clock);
// => 400
```

***

### <a id="rxvritualtimeschedulerprototypestop"></a>`Rx.VirtualTimeScheduler.prototype.stop()`
<a href="#rxvritualtimeschedulerprototypestop">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/virtualtimescheduler.js#L128-L130 "View in source")

Stops the virtual time scheduler.

#### Example
```js
var scheduler = new MyVirtualScheduler(
  0 /* initial time */
);

scheduler.scheduleRelative('world', 100, function (scheduler, state) {
  console.log('hello ' + state);
});

scheduler.scheduleRelative(null, 100, function (scheduler, state) {
  scheduler.stop();
});

scheduler.scheduleRelative(null, 100, function (scheduler, state) {
  console.log('goodbye cruel ' + state);
});

scheduler.start();
// => hello world
```

***

## _VirtualTimeScheduler Abstract Protected Methods_ ##

### <a id="rxvirtualtimeschedulerprototypeaddabsolute-relative"></a>`Rx.VirtualTimeScheduler.prototype.add(absolute, relative)`
<a href="#rxvirtualtimeschedulerprototypeaddabsolute-relative">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/asyncsubject.js#L54 "View in source")

Adds a relative time value to an absolute time value.  This method is used in several methods including `scheduleRelative`, `advanceBy` and `sleep`.

### Arguments
1. `absolute` *(Any)*: Absolute virtual time value.
2. `relative` *(Any)*: Relative virtual time value.

#### Returns
*(Any)*: Resulting absolute virtual time sum value.

#### Example

One possible implementation could be as simple as the following:

```js
scheduler.add = function (absolute, relative) {
    return absolute + relative;
};
```

***

### <a id="rxvirtualtimeschedulerprototypetoabsolutetimeabsolute"></a>`Rx.VirtualTimeScheduler.prototype.toAbsoluteTime(absolute)`
<a href="#rxvirtualtimeschedulerprototypetoabsolutetimeabsolute">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/asyncsubject.js#L61 "View in source")

Converts an absolute time to a number.  This is used directly in the `now` method on the `Rx.Scheduler`

### Arguments
1. `absolute` *(Any)*: The absolute time to convert.

#### Returns
*(Number)*: The absolute time in ms.

#### Example

One possible implementation could be as simple as the following:

```js
// String -> Number
scheduler.toAbsoluteTime = function (absolute) {
  return absolute.length;
};
```

***

### <a id="rxvirtualtimeschedulerprototypetorelativetimetimespan"></a>`Rx.VirtualTimeScheduler.prototype.toRelativeTime(timeSpan)`
<a href="#rxvirtualtimeschedulerprototypetorelativetimetimespan">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/asyncsubject.js#L61 "View in source")

Converts the time span number/Date to a relative virtual time value.

### Arguments
1. `timeSpan` *(Any)*: The time span number value to convert.  This is used directly in `scheduleFuture`.

#### Returns
*(Number)*: Corresponding relative virtual time value.

#### Example

One possible implementation could be as simple as the following:

```js
// Number -> Number
scheduler.toRelativeTime = function (timeSpan) {
  return timeSpan;
};
```

***
