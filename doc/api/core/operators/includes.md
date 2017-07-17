# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
### `Rx.Observable.prototype.includes(searchElement, [fromIndex])` ###
### `Rx.Observable.prototype.contains(searchElement, [fromIndex])` **DEPRECATED** ###
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/includes.js "View in source")

Determines whether an observable sequence includes a specified element with an optional from index.

#### Arguments
1. `searchElement` *(`Any`)*: The value to locate in the source sequence.
2. `[fromIndex]` *(`Number`)*: The index to start the search.  If not specified, defaults to 0.

#### Returns
*(`Observable`)*: An observable sequence containing a single element determining whether the source sequence includes an element that has the specified value with an optional from index.

#### Example
```js
/* Without an index */
var source = Rx.Observable.of(42)
  .includes(42);

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

// => Next: true
// => Completed

/* With an index */
var source = Rx.Observable.of(1,2,3)
  .includes(2, 1);

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

// => Next: true
// => Completed
```
### Location

File:
- [`/src/core/linq/observable/includes.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/includes.js)

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
- [`/tests/observable/includes.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/includes.js)
