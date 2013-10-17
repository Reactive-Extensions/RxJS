# `Rx.VirtualTimeScheduler` class #

Base class for providing scheduling in virtual time.  This inherits from the `Rx.Scheduler` class.

## Usage ##

The following shows an example of using the `Rx.VirtualScheduler`. In order for this to work, you must implement the `add`, `toDateTimeOffset` and `toRelative` methods as described below.

```js
/* Comparer required for scheduling priority */
function comparer (x, y) {
    if (x > y) { return 1; }
    if (x < y) { return -1; }
    return 0;
}

var scheduler = new Rx.VirtualScheduler(0, comparer);

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
scheduler.toDateTimeOffset = function (absolute) {
    return new Date(absolute).getTime();
};

/**
 * Converts the time span number/Date to a relative virtual time value.       
 * @param {Number} timeSpan TimeSpan value to convert.
 * @return {Number} Corresponding relative virtual time value.
 */
scheduler.toRelative = function (timeSpan) {
    return timeSpan;
};

// Schedule some time
scheduler.scheduleAbsolute(1, function () { console.log('foo'); });
scheduler.scheduleAbsolute(2, function () { console.log('bar'); });
scheduler.scheduleAbsolute(3, function () { scheduler.stop(); });

// Start the scheduler
scheduler.start();

// => foo
// => bar

// Check the clock once stopped
console.log(s.now());
// => 3

console.log(s.clock);
// => 3

```

### Location

- rx.virtualtime.js

## `VirtualTimeScheduler Constructor` ##
- [`constructor`](#rxvirtualtimeschedulerinitialclock-comparer)

## `VirtualTimeScheduler Abstract Methods` ##
- [`add`](#rxvirtualtimeschedulerprototypeaddabsolute-relative)
- [`toDateTimeOffset`](#rxvirtualtimeschedulerprototypetodatetimeoffsetabsolute)
- [`toRelative`](#rxvirtualtimeschedulerprototypetorelativetimespan)

## `VirtualTimeScheduler Instance Methods` ##
- [`advanceBy`](#rxvirtualtimeschedulerprototypeadvancebytime)
- [`advanceTo`](#rxvirtualtimeschedulerprototypeadvancetotime)
- [`getNext`](#rxvirtualtimeschedulerprototypegetnext)
- [`scheduleAbsolute`](#rxvirtualtimeschedulerprototypescheduleabsoluteduetime-action)
- [`scheduleAbsoluteWithState`](#rxvirtualtimeschedulerprototypescheduleabsolutewithstatestate-duetime-action)
- [`scheduleRelative`](#rxvirtualtimeschedulerprototypeschedulerelativeduetime-action)
- [`scheduleRelativeWithState`](#rxvirtualtimeschedulerprototypeschedulerelativewithstatestate-duetime-action)
- [`sleep`](#rxvirtualtimeschedulerprototypesleeptime)
- [`start`](#rxvritualtimeschedulerprototypestart)
- [`stop`](#rxvritualtimeschedulerprototypestop)
- [`toRelative`](#rxvirtualtimeschedulerprototypetorelativetimespan)

## `VirtualTimeScheduler Instance Properties` ##
- [`isEnabled`](#isenabled)

## Inherited Classes ##
- [`Rx.Scheduler`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/scheduler.md)

## _VirtualTimeScheduler Constructor_ ##

### <a id="rxvirtualtimescheduler"></a>`Rx.VirtualTimeScheduler(initialClock, comparer)`
<a href="#rxvirtualtimescheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/virtualtimescheduler.js#L34-L40 "View in source") 

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

### Location

- rx.virtualtime.js

* * *

## _VirtualTimeScheduler Abstract Methods_ ##

### <a id="rxvirtualtimeschedulerprototypeaddabsolute-relative"></a>`Rx.VirtualTimeScheduler.prototype.add()`
<a href="#rxvirtualtimeschedulerprototypeaddabsolute-relative">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/asyncsubject.js#L54 "View in source") 

Adds a relative time value to an absolute time value.  This method is used in several methods including `scheduleRelativeWithState`, `advanceBy` and `sleep`.

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

### Location

- rx.virtualtime.js

* * *

### <a id="rxvirtualtimeschedulerprototypetodatetimeoffsetabsolute"></a>`Rx.VirtualTimeScheduler.prototype.toDateTimeOffset(absolute)`
<a href="#rxvirtualtimeschedulerprototypetodatetimeoffsetabsolute">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/asyncsubject.js#L61 "View in source") 

Converts an absolute time to a number.  This is used directly in the `now` method on the `Rx.Scheduler`

### Arguments
1. `absolute` *(Any)*: The absolute time to convert.

#### Returns
*(Number)*: The absolute time in ms.

#### Example

One possible implementation could be as simple as the following:

```js
// String -> Number
scheduler.toDateTimeOffset = function (absolute) {
    return return absolute.length;
};
```

### Location

- rx.virtualtime.js

* * *

### <a id="rxvirtualtimeschedulerprototypetorelativetimespan"></a>`Rx.VirtualTimeScheduler.prototype.toRelative(timeSpan)`
<a href="#rxvirtualtimeschedulerprototypetorelativetimespan">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/asyncsubject.js#L61 "View in source") 

Converts the time span number/Date to a relative virtual time value.  

### Arguments
1. `timeSpan` *(Any)*: The time span number value to convert.  This is used directly in `scheduleWithRelativeAndState` and `scheduleWithAbsoluteAndState`.

#### Returns
*(Number)*: Corresponding relative virtual time value.

#### Example

One possible implementation could be as simple as the following:

```js
// Number -> Number
scheduler.toRelative = function (timeSpan) {
    return timeSpan;
};
```

### Location

- rx.virtualtime.js

* * *


