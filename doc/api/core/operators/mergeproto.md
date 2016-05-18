### `Rx.Observable.prototype.merge(maxConcurrent | other)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/mergeconcat.js "View in source")

Merges an observable sequence of observable sequences into an observable sequence, limiting the number of concurrent subscriptions to inner sequences.
Or merges two observable sequences into a single observable sequence.

#### Arguments
1. `maxConcurrent` *(`Number`)*: Maximum number of inner observable sequences being subscribed to concurrently.
1. `other` *(`Observable`)*:  The second observable sequence to merge into the first.

#### Returns
*(`Observable`)*: The observable sequence that merges the elements of the inner sequences.

#### Example
```js
/* Merge two sequences */
var source1 = Rx.Observable.interval(100)
    .map(function (x) { return 'First: ' + x; });

var source2 = Rx.Observable.interval(50)
    .map(function (x) { return 'Second: ' + x; });

var source = source1
    .merge(source2)
    .take(5);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

// => Next: Second: 0
// => Next: First: 0
// => Next: Second: 1
// => Next: Second: 2
// => Next: First: 1
// => Completed

/* Use max concurrency */
var source = Rx.Observable.range(0, 3)
    .map(function (x) { return Rx.Observable.range(x, 3); })
    .merge(1);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

// => Next: 0
// => Next: 1
// => Next: 2
// => Next: 1
// => Next: 2
// => Next: 3
// => Next: 2
// => Next: 3
// => Next: 4
// => Completed
```

### Location

File:
- [`/src/core/perf/operators/mergeconcat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/mergeconcat.js)

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
- [`/tests/observable/mergeconcat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/mergeconcat.js)

* * *
