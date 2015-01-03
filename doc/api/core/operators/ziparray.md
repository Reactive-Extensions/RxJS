### `Rx.Observable.zipArray(...args)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/ziparray.js "View in source")

Merges the specified observable sequences into one observable sequence by emitting a list with the elements of the observable sequences at corresponding indexes.

#### Arguments
1. `args` *(Arguments | Array)*: Observable sources.

#### Returns
*(`Observable`)*: An observable sequence containing lists of elements at corresponding indexes.

#### Example
```js
var range = Rx.Observable.range(0, 5);

var source = Rx.Observable.zipArray(
    range,
    range.skip(1), 
    range.skip(2)
);

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

// => Next: 0,1,2 
// => Next: 1,2,3 
// => Next: 2,3,4 
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/ziparray.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/ziparray.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- [`rx`](https://www.npmjs.org/package/rx).experimental.js
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/ziparay.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/ziparay.js)
