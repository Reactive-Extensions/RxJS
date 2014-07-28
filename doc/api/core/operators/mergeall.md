### `Rx.Observable.prototype.mergeAll()`
### `Rx.Observable.prototype.mergeObservable()` *DEPRECATED*
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/mergeobservable.js "View in source") 

Merges an observable sequence of observable sequences into an observable sequence.

#### Returns
*(`Observable`)*: The observable sequence that merges the elements of the inner sequences. 
 
#### Example
```js
var source = Rx.Observable.range(0, 3)
    .map(function (x) { return Rx.Observable.range(x, 3); })
    .mergeAll();

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
// => Next: 1 
// => Next: 2 
// => Next: 2 
// => Next: 2 
// => Next: 3 
// => Next: 3 
// => Next: 4 
// => Completed     
```

### Location

File:
- [`/src/core/observable/mergeobservable.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/mergeobservable.js)

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
- [`/tests/observable/mergeobservable.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/mergeobservable.js)