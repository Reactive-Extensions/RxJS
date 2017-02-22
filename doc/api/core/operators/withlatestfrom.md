### `Rx.Observable.prototype.withLatestFrom(...args, [resultSelector])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/withlatestfrom.js "View in source")

Merges the specified observable sequences into one observable sequence by using the selector function only when the source observable sequence (the instance) produces an element. The other observables can be in the form of an argument list of observables or an array. If the result selector is omitted, a list with the elements will be yielded.

#### Arguments
1. `args` *(arguments | Array)*: An array or arguments of Observable sequences.
1. `[resultSelector]` *(`Function`)*: Function to invoke when the instance source observable produces an element. If omitted, a list with the elements will be yielded.

#### Returns
*(`Observable`)*: An observable sequence containing the result of combining elements of the sources using the specified result selector function.

#### Example
```js
/* Have staggering intervals */
var source1 = Rx.Observable.interval(140)
    .map(function (i) { return 'First: ' + i; });

var source2 = Rx.Observable.interval(50)
    .map(function (i) { return 'Second: ' + i; });

// When source1 emits a value, combine it with the latest emission from source2.
var source = source1.withLatestFrom(
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

// => Next: First: 0, Second: 1
// => Next: First: 1, Second: 4
// => Next: First: 2, Second: 7
// => Next: First: 3, Second: 10
// => Completed
```
### Location

File:
- [`/src/core/perf/operators/withlatestfrom.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/withlatestfrom.js)

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
- [`/tests/observable/withlatestfrom.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/withlatestfrom.js)
