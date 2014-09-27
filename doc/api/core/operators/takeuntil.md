### `Rx.Observable.prototype.takeUntil(other)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takeuntil.js "View in source")

Returns the values from the source observable sequence until the other observable sequence or Promise produces a value.

#### Arguments
1. `other` *(`Observable` | `Promise`)*: Observable sequence or Promise that terminates propagation of elements of the source sequence.

#### Returns
*(`Observable`)*: An observable sequence containing the elements of the source sequence up to the point the other sequence or Promise interrupted further propagation.

#### Example
```js
var source = Rx.Observable.timer(0, 1000)
    .takeUntil(Rx.Observable.timer(5000));

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
// => Next: 3
// => Next: 4
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/takeuntil.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takeuntil.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/takeuntil.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/takeuntil.js)
