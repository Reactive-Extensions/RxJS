### `Rx.Observable.prototype.combineLatest(...args, resultSelector)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/combinelatestproto.js "View in source")

Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences produces an element.  This can be in the form of an argument list of observables or an array.

#### Arguments
1. `args` *(arguments | Array)*: An array or arguments of Observable sequences.
1. `resultSelector` *(`Function`)*: Function to invoke whenever either of the sources produces an element.

#### Returns
*(`Observable`)*: An observable sequence containing the result of combining elements of the sources using the specified result selector function.

#### Example
```js
/* Have staggering intervals */
var source1 = Rx.Observable.interval(100)
    .map(function (i) { return 'First: ' + i; });

var source2 = Rx.Observable.interval(150)
    .map(function (i) { return 'Second: ' + i; });

// Combine latest of source1 and source2 whenever either gives a value
var source = source1.combineLatest(
        source2,
        function (s1, s2) { return s1 + ', ' + s2; }
    ).take(4);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

// => Next: First: 0, Second: 0
// => Next: First: 1, Second: 0
// => Next: First: 1, Second: 1
// => Next: First: 2, Second: 1
// => Completed
```
### Location

File:
- [`/src/core/linq/observable/combinelatestproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/combinelatestproto.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/combinelatestproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/combinelatestproto.js)
