### `Rx.HistoricalScheduler` class
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/historicalscheduler.js "View in source")

Provides a virtual time scheduler that uses a `Date` for absolute time and time spans for relative time.  This inherits from the `Rx.VirtualTimeScheduler` class.

## Usage ##

The following shows an example of using the `Rx.HistoricalScheduler`.  This shows creating a minute's worth of data from January 1st, 1970.

```js
// Initial data
var initialDate = 0;
var scheduler = new Rx.HistoricalScheduler(new Date(initialDate));

// Yield unto this subject
var s = new Rx.Subject();

// Some random data
function getData(time) {
  return Math.floor(Math.random() * (time + 1));
}

// Enqueue 1 minute's worth of data
while (initialDate <= 60000) {

  (function (i) {

    scheduler.scheduleWithAbsolute(i, function () {
      s.onNext({ value: getData(i), date: new Date(i) });
    });

  }(initialDate));

  initialDate += 10000;
}

// Subscription set
s.subscribe(function (x) {
  console.log('value: ', x.value);
  console.log('date: ', x.date.toGMTString());
});

// Run it
scheduler.start();

// => value: 0
// => date: Thu, 1 Jan 1970 00:00:00 UTC
// => value: 2013
// => date: Thu, 1 Jan 1970 00:00:10 UTC
// => value: 5896
// => date: Thu, 1 Jan 1970 00:00:20 UTC
// => value: 5415
// => date: Thu, 1 Jan 1970 00:00:30 UTC
// => value: 13411
// => date: Thu, 1 Jan 1970 00:00:40 UTC
// => value: 15518
// => date: Thu, 1 Jan 1970 00:00:50 UTC
// => value: 51076
// => date: Thu, 1 Jan 1970 00:01:00 UTC
```

### Location

File:
- [`/src/core/concurrency/historicalscheduler.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/historicalscheduler.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.virutaltime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.virutaltime.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-VirtualTime`](http://www.nuget.org/packages/RxJS-VirtualTime/)

Unit Tests:
- [`/tests/concurrency/historicalscheduler.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/historicalscheduler.js)

## `HistoricalScheduler Constructor` ##
- [`constructor`](#rxhistoricalschedulerinitialclock-comparer)

## Inherited Classes ##
- [`Rx.VirtualScheduler`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/schedulers/virtualtimescheduler.md)

## _HistoricalScheduler Constructor_ ##

### `Rx.HistoricalScheduler([initialClock], [comparer])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/historicalscheduler.js "View in source")

Creates a new historical scheduler with the specified initial clock value.

#### Arguments
1. [`initialClock`] *(Function)*: Initial value for the clock.
2. [`comparer`] *(Function)*: Comparer to determine causality of events based on absolute time.

#### Example
```js
function comparer (x, y) {
  if (x > y) { return 1; }
  if (x < y) { return -1; }
  return 0;
}

var scheduler = new Rx.HistoricalScheduler(
  new Date(0),  /* initial clock of 0 */
  comparer      /* comparer for determining order */
);
```
