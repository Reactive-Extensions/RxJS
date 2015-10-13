### `Rx.Observable.prototype.forkJoin(...args, [resultSelector])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/forkjoinproto.js "View in source")

Runs all observable sequences in parallel and collect their last elements.

#### Arguments
1. `args`: `Arguments` | `Array` - An array or arguments of Observable sequences or Promises to collect the last elements for.
2. `resultSelector`: `Function` - The result selector from all the values produced. If not specified, `forkJoin` will return the results as an array.

#### Returns
*(`Observable`)*: An observable sequence with an array collecting the last elements of all the input sequences or the result of the result selector if specified.

#### Example
```js
// With a selector
var source = Rx.Observable.just(42).forkJoin(
  Rx.Observable.range(0, 3),
  function (s1, s2) { return s1 + s2; });

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

// => Next: 44
// => Completed

// Without a selector
var source = Rx.Observable.just(42).forkJoin(
  Rx.Observable.range(0, 3));

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

// => Next: [42, 2]
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/forkjoinproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/forkjoinproto.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.experimental.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.experimental.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All)
- [`RxJS-Experimental`](http://www.nuget.org/packages/RxJS-Experimental)

Unit Tests:
- [`/tests/observable/forkjoin.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/forkjoin.js)
