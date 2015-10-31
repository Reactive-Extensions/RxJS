### `Rx.Observable.prototype.delay(dueTime, [scheduler])`
### `Rx.Observable.prototype.delay([subscriptionDelay], delayDurationSelector`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/delay.js "View in source")

Time shifts the observable sequence by dueTime. The relative time intervals between the values are preserved.

--OR--

Time shifts the observable sequence based on a subscription delay and a delay selector function for each element.

#### Arguments

For delays with an absolute or relative time:

1. `dueTime` *(Date | Number)*: Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) by which to shift the observable sequence.
2. `[scheduler]` *(`Scheduler`)*: Scheduler to run the delay timers on. If not specified, the default scheduler is used.

For delays with a delay selector function:

1. `[subscriptionDelay]` *(`Observable`)*: Sequence indicating the delay for the subscription to the source.
2. `delayDurationSelector` *(`Function`)*: Selector function to retrieve a sequence indicating the delay for each given element.

#### Returns
*(`Observable`)*: Time-shifted sequence.

#### Example
```js
/* Using an absolute time to delay by a second */
var source = Rx.Observable.range(0, 3)
  .delay(new Date(Date.now() + 1000));

var subscription = source.subscribe(
  function (x) {
    console.log('Next: %s', x);
  },
  function (err) {
    console.log('Error: %s', err);
  },
  function () {
    console.log('Completed');
  });

// => Next: 0
// => Next: 1
// => Next: 2
// => Completed

/* Using an relatove time to delay by a second */
var source = Rx.Observable.range(0, 3)
  .delay(1000);

var subscription = source.subscribe(
  function (x) {
    console.log('Next: %s', x);
  },
  function (err) {
    console.log('Error: %s', err);
  },
  function () {
    console.log('Completed');
  });

// => Next: 0
// => Next: 1
// => Next: 2
// => Completed

/* With subscriptionDelay */
var source = Rx.Observable
  .range(0, 3)
  .delay(
    Rx.Observable.timer(300),
    function (x) { return Rx.Observable.timer(x * 400); }
  )
  .timeInterval()
  .map(function (x) { return x.value + ':' + x.interval; });

var subscription = source.subscribe(
  function (x) {
    console.log('Next: %s', x);
  },
  function (err) {
    console.log('Error: %s', err);
  },
  function () {
    console.log('Completed');
  });


// => Next: 0:300
// => Next: 1:400
// => Next: 2:400
// => Completed

/* Without subscriptionDelay */
var source = Rx.Observable
  .range(0, 3)
  .delay(function (x) { return Rx.Observable.timer(x * 400); })
  .timeInterval()
  .map(function (x) { return x.value + ':' + x.interval; });

var subscription = source.subscribe(
  function (x) {
    console.log('Next: %s', x);
  },
  function (err) {
    console.log('Error: %s', err);
  },
  function () {
    console.log('Completed');
  });

// => Next: 0:0
// => Next: 1:400
// => Next: 2:400
// => Completed
```
### Location

File:
- [`/src/core/linq/observable/delay.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/delay.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.time.js)

Prerequisites:
- [`rx`](https://www.npmjs.org/package/rx).time.js
    - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | rx.lite.compat.js

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/delay.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/delay.js)
