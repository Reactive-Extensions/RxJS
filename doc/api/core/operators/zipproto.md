### `Rx.Observable.prototype.zip(...args, [resultSelector])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/zipproto.js "View in source")

Merges the specified observable sequences or Promises into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.

#### Arguments
1. `args` *(`Arguments` | `Array`)*: Arguments or an array of observable sequences.
2. `[resultSelector]` *(Function)*: A function which takes the inputs at the specified index and combines them together.  If omitted, a list with the elements of the observable sequences at corresponding indexes will be yielded.

#### Returns
*(`Observable`)*: An observable sequence containing the result of combining elements of the sources using the specified result selector function.

#### Example
```js
/* Without a result selector */
var range = Rx.Observable.range(0, 5);

var source = range.zip(
  range.skip(1),
  range.skip(2)
);

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

// => Next: 0,1,2
// => Next: 1,2,3
// => Next: 2,3,4
// => Completed  

/* Using arguments */
var range = Rx.Observable.range(0, 5);

var source = range.zip(
  range.skip(1),
  range.skip(2),
  function (s1, s2, s3) {
    return s1 + ':' + s2 + ':' + s3;
  }
);

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

// => Next: 0:1:2
// => Next: 1:2:3
// => Next: 2:3:4
// => Completed
```
### Location

File:
- [`/src/core/linq/observable/zipproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/zipproto.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/zip.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/zip.js)
