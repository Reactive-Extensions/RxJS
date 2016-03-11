### `Rx.Observable.prototype.flatMapLatest(selector, [thisArg])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/flatmaplatest.js "View in source")

Transform the items emitted by an Observable into Observables, and mirror those items emitted by the most-recently transformed Observable.

The `flatMapLatest` operator is similar to the `flatMap` and `concatMap` methods described above, however, rather than emitting all of the items emitted by all of the Observables that the operator generates by transforming items from the source `Observable`, `flatMapLatest` instead emits items from each such transformed `Observable` only until the next such `Observable` is emitted, then it ignores the previous one and begins emitting items emitted by the new one.

#### Arguments
1. `selector` *(`Function`)*:  A transform function to apply to each source element.  The callback has the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(`Any`)*: Object to use as `this` when executing the predicate.

#### Returns
*(`Observable`)*: An observable sequence which transforms the items emitted by an Observable into Observables, and mirror those items emitted by the most-recently transformed Observable.

#### Example
```js
var source = Rx.Observable
  .range(1, 3)
  .flatMapLatest(function(x) {
    return Rx.Observable.from([x + 'a', x + 'b']);
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

// Next: 1a
// Next: 2a
// Next: 3a
// Next: 3b
// Completed
```

### Location

File:
- [`/src/core/linq/observable/flatmaplatest.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/flatmaplatest.js)

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
- None
