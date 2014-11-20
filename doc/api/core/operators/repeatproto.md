### `Rx.Observable.prototype.repeat(repeatCount)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/repeatproto.js "View in source")

Repeats the observable sequence a specified number of times. If the repeat count is not specified, the sequence repeats indefinitely.

#### Arguments
1. `repeatCount` *(`Number`)*:  Number of times to repeat the sequence. If not provided, repeats the sequence indefinitely.

#### Returns
*(`Observable`)*: The observable sequence producing the elements of the given sequence repeatedly.

#### Example
```js
var source = Rx.Observable.range(1, 3)
    .repeat(2);

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
// => Next: 3
// => Next: 1
// => Next: 2
// => Next: 3
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/repeatproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/repeatproto.js)

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
- [`/tests/observable/repeatproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/repeatproto.js)
