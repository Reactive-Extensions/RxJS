### `Rx.Observable.prototype.scan([seed], accumulator)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/scan.js "View in source")

Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.

For aggregation behavior with no intermediate results, see `Rx.Observable#aggregate` or `Rx.Observable#reduce`.

#### Arguments
1. `[seed]` *(`Any`)*: The initial accumulator value.
2. `accumulator` *(`Function`)*: An accumulator function to be invoked on each element.

#### Returns
*(`Observable`)*: An observable sequence which results from the comonadic bind operation.

#### Example
```js
/* Without a seed */
var source = Rx.Observable.range(1, 3)
    .scan(
        function (acc, x) {
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

// => Next: 1
// => Next: 3
// => Next: 6
// => Completed

/* With a seed */
var source = Rx.Observable.range(1, 3)
    .scan(
        1,
        function (acc, x) {
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

// => Next: 1
// => Next: 2
// => Next: 6
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/scan.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/scan.js)

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
