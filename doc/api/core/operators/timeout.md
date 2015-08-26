### `Rx.Observable.prototype.timeout(dueTime, [other], [scheduler])`
### `Rx.Observable.prototype.timeout([firstTimeout], timeoutDurationSelector, [other])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/timeout.js "View in source")

Returns the source observable sequence or the other observable sequence if dueTime elapses.

--OR--

Returns the source observable sequence, switching to the other observable sequence if a timeout is signaled.

#### Arguments

If using a relative or absolute time:
1. `dueTime` *(Date | Number)*: Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) when a timeout occurs.
2. `[other]` *(`Observable` | `Promise` | `Error`)*: Observable sequence or Promise to return in case of a timeout. If a string is specified, then an error will be thrown with the given error message.  If not specified, a timeout error throwing sequence will be used.
3. `[scheduler]` *(`Scheduler`)*: Scheduler to run the timeout timers on. If not specified, the default scheduler is used.

If using a timeout duration selector:
1. `[firstTimeout]` *(`Observable`)*: Observable sequence that represents the timeout for the first element. If not provided, this defaults to `Rx.Observable.never()`.
2. `timeoutDurationSelector` *(`Function`)*: Selector to retrieve an observable sequence that represents the timeout between the current element and the next element.
3. `[other]` *(`Scheduler`)*:Sequence to return in case of a timeout. If not provided, this is set to `Observable.throw`

#### Returns
*(`Observable`)*: An observable sequence with time interval information on values.

#### Example
```js
/* With no other */
var source = Rx.Observable
  .just(42)
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
  .just(42)
  .delay(5000)
  .timeout(200, new Error('Timeout has occurred.'));

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
  .just(42)
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
  .just(42)
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

/* without a first timeout */
var array = [
  200,
  300,
  350,
  400
];

var source = Rx.Observable
  .for(array, function (x) { return Rx.Observable.timer(x); })
  .map(function (x, i) { return i; })
  .timeout(function (x) { return Rx.Observable.timer(400); });

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
// => Error: Error: Timeout

/* With no other */
var array = [
  200,
  300,
  350,
  400
];

var source = Rx.Observable
  .for(array, function (x) { return Rx.Observable.timer(x); })
  .map(function (x, i) { return i; })
  .timeout(
    Rx.Observable.timer(250),
    function (x) { return Rx.Observable.timer(400); }
  );

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
// => Error: Error: Timeout

/* With other */
var array = [
  200,
  300,
  350,
  400
];

var source = Rx.Observable
  .for(array, function (x) { return Rx.Observable.timer(x); })
  .map(function (x, i) { return i; })
  .timemout(
    Rx.Observable.timer(250),
    function (x) { return Rx.Observable.timer(400); },
    Rx.Observable.just(42)
  );

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
