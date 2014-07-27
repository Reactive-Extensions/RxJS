### `Rx.Observable.prototype.forkJoin(second, resultSelector)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/forkjoinproto.js "View in source") 

Runs two observable sequences in parallel and combines their last elements.

#### Arguments
1. `second` *(`Observable`)*: Second observable sequence.
2. `resultSelector` *(`Any`)*: The default value if no such element exists.  If not specified, defaults to null.

#### Returns
*(`Observable`)*: An observable sequence that contains elements from the input sequence that satisfy the condition.  

#### Example
```js
var source1 = Rx.Observable.return(42);
var source2 = Rx.Observable.range(0, 3);

var source = source1.forkJoin(source2, function (s1, s2) {
    return s1 + s2; 
});

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

// => Next: 44
// => Completed
```

### Location

File:
- [`/src/core/observable/forkjoinproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/forkjoinproto.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.all.compat.js)
- [`rx.experimental.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All)
- [`RxJS-Experimental`](http://www.nuget.org/packages/RxJS-Experimental)

Unit Tests:
- [`/tests/observable/forkjoinproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/forkjoinproto.js)