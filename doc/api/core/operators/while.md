### `Rx.Observable.while(condition, source)`
### `Rx.Observable.whileDo(condition, source)` *DEPRECATED*
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/while.js "View in source") 

Repeats source as long as condition holds emulating a while loop.  There is an alias for this method called 'whileDo' for browsers <IE9.

### Arguments
1. `condition` *(`Function`)*: The condition which determines if the source will be repeated.
2. `source` *(`Observable`)*: The observable sequence that will be run if the condition function returns true.

#### Returns
*(`Observable`)*: An observable sequence which is repeated as long as the condition holds. 

#### Example
```js
var i = 0;

// Repeat until condition no longer holds
var source = Rx.Observable.while(
    function () { ++i < 3 },
    Rx.Observable.return(42)
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

// => Next: 42
// => Next: 42
// => Next: 42
// => Completed 
```

### Location

File:
- [`/src/core/observable/while.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/while.js)

Dist:
- [`rx.experimental.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Experimental`](http://www.nuget.org/packages/RxJS-Experimental)

Unit Tests:
- [`/tests/observable/while.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/while.js)