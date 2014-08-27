### `Rx.Observable.prototype.toWeakSet()`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/toweakset.js "View in source") 

Creates an observable sequence with a single item of a WeakSet created from the observable sequence.  Note that this only works in an ES6 environment.

#### Returns
*(`Observable`)*: An observable sequence containing a single element with a WeakSet containing all the elements of the source sequence.  

#### Example
```js
var source = Rx.Observable.timer(0, 1000)
    .take(5)
    .toWeakSet();
    
var subscription = source.subscribe(
    function (x) {
        var arr = [];
        x.forEach(function (i) { arr.push(i); })
        console.log('Next: ' + arr);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: [0,1,2,3,4]
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/toweakset.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/toweakset.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.aggregates.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.aggregates.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

Unit Tests:
- [`/tests/observable/toweakset.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/toweakset.js)
