### `Rx.Observable.prototype.concat(...args)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/concatproto.js "View in source")

Concatenates all the observable sequences.  This takes in either an array or variable arguments to concatenate.

#### Arguments
1. `args` *(arguments | Array)*: An array or arguments of Observable sequences.

#### Returns
*(`Observable`)*: An observable sequence that contains the elements of each given sequence, in sequential order.

#### Example
```js
var source = Rx.Observable
    .return(42)
    .concat(Rx.Observable.return(56), Rx.Observable.return(72));

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

// => Next: 42
// => Next: 56
// => Next: 72
// => Completed

// With a promise
var source = Rx.Observable.just(42)
    .concat(Promise.resolve(42));

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

// => Next: 42
// => Next: 542
// => Completed
```
### Location

File:
- [`/src/core/linq/observable/concatproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/concatproto.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/concatproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/concatproto.js)
