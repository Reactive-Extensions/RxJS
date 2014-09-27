### `Rx.Observable.prototype.aggregate([seed], accumulator)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/aggregate.js "View in source")

 Applies an accumulator function over an observable sequence, returning the result of the aggregation as a single element in the result sequence. The specified seed value is used as the initial accumulator value.
 For aggregation behavior with incremental intermediate results, see `Rx.Observable.scan`.

#### Arguments
1. `[seed]` *(Mixed)*: The initial accumulator value.
2. `accumulator` *(`Function`)*: accumulator An accumulator function to be invoked on each element.

#### Returns
*(`Observable`)*: An observable sequence containing a single element with the final accumulator value.

#### Example
```js
// Using a seed for the accumulate
var source = Rx.Observable.range(1, 10).aggregate(1, function (acc, x) {
    return acc * x;
});

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

// => Next: 3628800
// => Completed

// Without a seed
var source = Rx.Observable.range(1, 10).aggregate(function (acc, x) {
    return acc + x;
});

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

// => Next: 55
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/aggregate.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/aggregate.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.all.js)
- [rx.aggregates.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

Unit Tests:
- [`/tests/observable/aggregate.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/aggregate.js)
