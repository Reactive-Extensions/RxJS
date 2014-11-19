### `Rx.Observable.prototype.take(count, [scheduler])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/take.js "View in source")

Returns a specified number of contiguous elements from the start of an observable sequence, using the specified scheduler for the edge case of `take(0)`.

#### Arguments
1. `count` *(`Number`)*: The number of elements to return.
2. `[schduler]` *(`Scheduler`)*: Scheduler used to produce an onCompleted message in case `count` is set to 0.

#### Returns
*(`Observable`)*: An observable sequence that contains the elements that occur after the specified index in the input sequence.

#### Example
```js
var source = Rx.Observable.range(0, 5)
    .take(3);

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
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/take.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/take.js)

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
- [`/tests/observable/take.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/take.js)
