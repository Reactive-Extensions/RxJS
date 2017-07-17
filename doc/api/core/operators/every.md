# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
### `Rx.Observable.prototype.every(predicate, [thisArg])` ##
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/every.js "View in source")

Determines whether all elements of an observable sequence satisfy a condition.

#### Arguments
1. `predicate` *(`Function`)*: A function to test each element for a condition.
2. `[thisArg]` *(`Function`)*: Object to use as this when executing callback.

#### Returns
*(`Observable`)*: An observable sequence containing a single element determining whether all elements in the source sequence pass the test in the specified predicate.

#### Example
```js
var source = Rx.Observable.of(1,2,3,4,5)
  .every(function (x) {
    return x < 6;
  });

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
- [`/src/core/linq/observable/every.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/every.js)

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
- [`/tests/observable/every.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/every.js)
