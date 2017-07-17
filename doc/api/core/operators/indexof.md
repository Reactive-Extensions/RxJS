# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
### `Rx.Observable.prototype.indexOf(searchElement, [fromIndex])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/indexof.js "View in source")

Returns the first index at which a given element can be found in the observable sequence, or -1 if it is not present.

#### Arguments
1. `searchElement` *(`Any`)*: The value to locate in the source sequence.
2. `[fromIndex]` *(`Number`)*: The index to start the search.  If not specified, defaults to 0.

#### Returns
*(`Observable`)*: And observable sequence containing the first index at which a given element can be found in the observable sequence, or -1 if it is not present.

#### Example
```js
/* Without an index */
var source = Rx.Observable.of(42)
  .indexOf(42);

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

// => Next: 0
// => Completed

/* With an index */
var source = Rx.Observable.of(1,2,3)
  .indexOf(2, 1);

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

// => Next: 0
// => Completed
```
### Location

File:
- [`/src/core/linq/observable/indexof.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/indexof.js)

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
- [`/tests/observable/indexof.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/indexof.js)
