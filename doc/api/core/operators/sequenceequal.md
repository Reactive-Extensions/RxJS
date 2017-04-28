### `Rx.Observable.prototype.sequenceEqual(second, [comparer])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/sequenceequal.js "View in source")

Determines whether two sequences are equal by comparing the elements pairwise using a specified equality comparer.

#### Arguments
1. `second` *(`Observable` | `Promise` | `Array`)*:  Second observable sequence, Promise or array to compare.
2. `[comparer]` *(`Function`)*: Comparer used to compare elements of both sequences.

#### Returns
*(`Observable`)*: An observable sequence that contains a single element which indicates whether both sequences are of equal length and their corresponding elements are equal according to the specified equality comparer.

#### Example
```js
var source1 = Rx.Observable.return(42);
var source2 = Rx.Observable.return(42);

var source = source1.sequenceEqual(source2);

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

// => Next: true
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/sequenceequal.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/sequenceequal.js)

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
- [`/tests/observable/sequenceequal.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/sequenceequal.js)
