### `Rx.Observable.onErrorResumeNext(...args)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/onerrorresumenext.js "View in source") 

Continues an observable sequence that is terminated normally or by an exception with the next observable sequence or Promise.

### Arguments
1. `args` *(Array|arguments)*: Observable sequences to concatenate.

#### Returns
*(`Observable`)*: An observable sequence that concatenates the source sequences, even if a sequence terminates exceptionally. 

#### Example
```js
var source1 = Rx.Observable.throw(new Error('error 1'));
var source2 = Rx.Observable.throw(new Error('error 2'));
var source3 = Rx.Observable.return(42);

var source = Rx.Observable.onErrorResumeNext(source1, source2, source3);

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
// => Completed 
```

### Location

File:
- [/src/core/linq/observable/onerrorresumenext.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/onerrorresumenext.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)

Unit Tests:
- [/tests/observable/onerrorresumenext.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/onerrorresumenext.js)
