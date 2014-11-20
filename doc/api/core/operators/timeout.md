### `Rx.Observable.prototype.timeout(dueTime, [other], [scheduler])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/timeout.js "View in source")

Returns the source observable sequence or the other observable sequence if dueTime elapses.

#### Arguments
1. `dueTime` *(Date | Number)*: Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) when a timeout occurs.
2. `[other]` *(`Observable` | `Promise` | `string`)*: Observable sequence or Promise to return in case of a timeout. If a string is specified, then an error will be thrown with the given error message.  If not specified, a timeout error throwing sequence will be used.
3. `[scheduler=Rx.Observable.timeout]` *(`Scheduler`)*: Scheduler to run the timeout timers on. If not specified, the timeout scheduler is used.

#### Returns
*(`Observable`)*: An observable sequence with time interval information on values.

#### Example
```js
/* With no other */
var source = Rx.Observable
    .return(42)
    .delay(5000)
    .timeout(200);

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

// => Error: Error: Timeout

/* With message */
var source = Rx.Observable
    .return(42)
    .delay(5000)
    .timeout(200, 'Timeout has occurred.');

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

// => Error: Error: Timeout has occurred.

/* With an observable */
var source = Rx.Observable
  .return(42)
  .delay(5000)
  .timeout(200, Rx.Observable.empty());

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

// => Completed

/* With a Promise */
var source = Rx.Observable
  .return(42)
  .delay(5000)
  .timeout(200, Promise.resolve(42));

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

// => Next: 42
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/timeout.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/timeout.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.time.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)

Unit Tests:
- [`/tests/observable/timeout.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/timeout.js)
