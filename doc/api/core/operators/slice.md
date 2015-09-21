### `Rx.Observable.prototype.slice([begin], [end])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/slice.js "View in source")

The `slice` method returns a shallow copy of a portion of an Observable into a new Observable object.  Unlike the `Array` version, this does not support negative numbers for being or end.

#### Arguments
1. `[begin]`: `Any`: Zero-based index at which to begin extraction. If omitted, this will default to zero.
2. `[end]` `Number`: Zero-based index at which to end extraction. slice extracts up to but not including end.

#### Returns
`Observable`: A shallow copy of a portion of an Observable into a new Observable object.

#### Example
```js
/* Without an end */
var source = Rx.Observable.of(1,2,3,1,2,3)
  .slice(3);

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

// => Next: 2
// => Next: 3
// => Completed

/* With an end */
var source = Rx.Observable.of(1,2,3,1,2,3)
  .slice(2, 1);

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

// => Next: 3
// => Completed
```
### Location

File:
- [`/src/core/linq/observable/slice.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/slice.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.aggregates.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.aggregates.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

Unit Tests:
- [`/tests/observable/slice.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/slice.js)
