### `Rx.Observable.prototype.scan(accumulator, [seed])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/scan.js "View in source")

Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.

For aggregation behavior with no intermediate results, see `Rx.Observable#reduce`.

Note the `Rx.Observable.prototype.scan([seed], accumulator)` has been removed as per v3.0 and replaced with `Rx.Observable.prototype.scan(accumulator, [seed])`.

#### Arguments
1. `accumulator` *(`Function`)*: An accumulator function to be invoked on each element with the following arguments:
    1. `acc`: `Any` - the accumulated value.
    2. `currentValue`: `Any` - the current value
    3. `index`: `Number` - the current index
    4. `source`: `Observable` - the current observable instance
2. `[seed]` *(`Any`)*: The initial accumulator value.

#### Returns
*(`Observable`)*: An observable sequence which results from the comonadic bind operation.

#### Example
```js
/* Without a seed */
var source = Rx.Observable.range(1, 3)
  .scan(function (acc, x, i, source) { return acc + x; });

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

// => Next: 1
// => Next: 3
// => Next: 6
// => Completed

/* With a seed */
var source = Rx.Observable.range(1, 3)
    .scan(function (acc, x, i, source) { return acc * x; }, 1);

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

// => Next: 1
// => Next: 2
// => Next: 6
// => Completed
```

### Location

File:
- [`/src/core/perf/operators/scan.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/scan.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/scan.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/scan.js)
