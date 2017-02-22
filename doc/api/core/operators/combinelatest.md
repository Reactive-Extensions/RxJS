### `Rx.Observable.combineLatest(...args, [resultSelector])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/combinelatest.js "View in source")

Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences produces an element.  This can be in the form of an argument list of observables or an array.  If the result selector is omitted, a list with the elements will be yielded.

#### Arguments
1. `args` *(arguments | Array)*: An array or arguments of Observable sequences.
2. `[resultSelector]` *(`Function`)*: Function to invoke whenever either of the sources produces an element.  If omitted, a list with the elements will be yielded.

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
var source = Rx.Observable.combineLatest(
    source1,
    source2
  ).take(4);

var subscription = source.subscribe(
  function (x) {
    console.log('Next: %s', JSON.stringify(x));
  },
  function (err) {
    console.log('Error: %s', err);
  },
  function () {
    console.log('Completed');
  });

// => Next: ["First: 0","Second: 0"]
// => Next: ["First: 1","Second: 0"]
// => Next: ["First: 1","Second: 1"]
// => Next: ["First: 2","Second: 1"]
// => Completed

/* Have staggering intervals */
var source1 = Rx.Observable.interval(100)
  .map(function (i) { return 'First: ' + i; });

var source2 = Rx.Observable.interval(150)
  .map(function (i) { return 'Second: ' + i; });

// Combine latest of source1 and source2 whenever either gives a value with a selector
var source = Rx.Observable.combineLatest(
    source1,
    source2,
    function (s1, s2) { return s1 + ', ' + s2; }
  ).take(4);

var subscription = source.subscribe(
  function (x) {
    console.log('Next: %s', x);
  },
  function (err) {
    console.log('Error: %s', err);
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
- [`/src/core/perf/operators/combinelatest.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/combinelatest.js)

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
- [`/tests/observable/combinelatest.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/combinelatest.js)
