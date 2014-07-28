### `Rx.Observable.prototype.onErrorResumeNext(second)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/onerrorresumenextproto.js "View in source") 

Continues an observable sequence that is terminated normally or by an exception with the next observable sequence or Promise.

#### Arguments
1. `second` *(`Observable` | `Promise`)*:  Second observable sequence used to produce results after the first sequence terminates.

#### Returns
*(`Observable`)*: An observable sequence that concatenates the first and second sequence, even if the first sequence terminates exceptionally.

#### Example
```js
var source = Rx.Observable.throw(new Error())
    .onErrorResumeNext(Rx.Observable.return(42));

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
- [`/src/core/observable/onerrorresumenextproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/onerrorresumenextproto.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) 
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.extras.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.extras.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/onerrorresumenext.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/onerrorresumenext.js)
