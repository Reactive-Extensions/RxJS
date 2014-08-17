### `Rx.Observable.prototype.startWith([scheduler] ...args)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/startwith.js "View in source") 

Prepends a sequence of values to an observable sequence with an optional scheduler and an argument list of values to prepend.

#### Arguments
1. `[scheduler]` *(`Scheduler`)*: Scheduler to execute the function.
2. `args` *(arguments)*: Values to prepend to the observable sequence.

#### Returns
*(`Observable`)*: The source sequence prepended with the specified values.

#### Example
```js
var source = Rx.Observable.return(4)
    .startWith(1, 2, 3)

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
// => Next: 4
// => Completed 
```

### Location

File:
- [`/src/core/linq/observable/startwith.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/startwith.js)

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
- [`/tests/observable/startwith.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/startwith.js)
