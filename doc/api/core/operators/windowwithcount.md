# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
### `Rx.Observable.prototype.windowWithCount(count, [skip])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/windowwithcount.js "View in source")

Projects each element of an observable sequence into zero or more windows which are produced based on element count information.

#### Arguments
1. `count` *(`Number`)*: Length of each buffer.
2. `[skip]` *(`Number`)*: Number of elements to skip between creation of consecutive windows. If not provided, defaults to the count.

#### Returns
*(`Observable`)*: An observable sequence of windows.

#### Example
```js
/* Without a skip */
var source = Rx.Observable.range(1, 6)
    .windowWithCount(2)
    .selectMany(function (x) { return x.toArray(); });

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

// => Next: 1,2
// => Next: 3,4
// => Next: 5,6
// => Next:
// => Completed

/* Using a skip */
var source = Rx.Observable.range(1, 6)
    .windowWithCount(2, 1)
    .selectMany(function (x) { return x.toArray(); });

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

// => Next: 1,2
// => Next: 2,3
// => Next: 3,4
// => Next: 4,5
// => Next: 5,6
// => Next: 6
// => Next:
// => Completed
```
### Location

File:
- [`/src/core/linq/observable/windowwithcount.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/windowwithcount.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.extras.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.extras.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/windowwithcount.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/windowwithcount.js)
