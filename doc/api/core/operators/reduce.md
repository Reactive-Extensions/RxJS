# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
### `Rx.Observable.prototype.reduce(accumulator, [seed])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/reduce.js "View in source")

Applies an accumulator function over an observable sequence, returning the result of the aggregation as a single element in the result sequence. The specified seed value is used as the initial accumulator value.

For aggregation behavior with incremental intermediate results, see the [`scan`](scan.md) method.

#### Arguments
1. `accumulator` *(`Function`)*:  An accumulator function to be invoked on each element with the following arguments:
    1. `acc`: `Any` - the accumulated value.
    2. `currentValue`: `Any` - the current value
    3. `index`: `Number` - the current index
    4. `source`: `Observable` - the current observable instance
2. `[seed]` *(`Any`)*: The initial accumulator value.

#### Returns
*(`Observable`)*: An observable sequence containing a single element with the final accumulator value.

#### Example
```js
/* With a seed */
var source = Rx.Observable.range(1, 3)
  .reduce(function (acc, x, idx, source) {
    return acc * x;
  }, 1)

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

// => Next: 6
// => Completed

/* Without a seed */
var source = Rx.Observable.range(1, 3)
  .reduce(function (acc, x, idx, source) {
    return acc * x;
  })

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

// => Next: 6
// => Completed
```

### Location

File:
- [`/src/core/perf/operators/reduce.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/reduce.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.aggregates.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.aggregates.js)

Prerequisites:
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

Unit Tests:
- [`/tests/observable/reduce.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/reduce.js)
