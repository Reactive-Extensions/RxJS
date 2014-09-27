### `Rx.Observable.prototype.min([comparer])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/min.js "View in source")

Returns the minimum element in an observable sequence according to the optional comparer else a default greater than less than check.

#### Arguments
1. `[comparer]` *(`Function`)*:  Comparer used to compare elements.

#### Returns
*(`Observable`)*: An observable sequence containing a single element with the minimum element in the source sequence.

#### Example
```js
/* Without comparer */
var source = Rx.Observable.fromArray([1,3,5,7,9,2,4,6,8])
    .min();

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
// => Completed

/* With a comparer */
function comparer (x, y) {
    if (x > y) {
        return 1;
    } else if (x < y) {
        return -1;
    }
    return 0;
}

var source = Rx.Observable.fromArray([1,3,5,7,9,2,4,6,8])
    .min(comparer);

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
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/min.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/min.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.aggregates.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js)

Prerequisites:
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

Unit Tests:
- [`/tests/observable/min.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/min.js)
