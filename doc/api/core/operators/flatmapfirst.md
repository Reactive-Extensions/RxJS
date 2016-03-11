### `Rx.Observable.prototype.flatMapFirst(selector, [thisArg])`
### `Rx.Observable.prototype.selectSwitchFirst(selector, [thisArg])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/flatmapfirst.js "View in source")

Transform the items emitted by an Observable into Observables, and mirror those items emitted by the most-recently transformed Observable.

The `flatMapFirst` operator is similar to the `flatMap` and `concatMap` methods described above, however, rather than emitting all of the items emitted by all of the Observables that the operator generates by transforming items from the source `Observable`, `flatMapFirst` instead propagates the first `Observable` exclusively until it completes before it begins subscribes to the next `Observable`.  Observables that come before the current `Observable` completes will be dropped and will not propagate.

#### Arguments
1. `selector` *(`Function`)*:  A transform function to apply to each source element.  The callback has the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(`Any`)*: Object to use as `this` when executing the predicate.

#### Returns
*(`Observable`)*: An Observable sequence that is the result of concatenating non-overlapping items emitted by an Observable of Observables.

#### Example
```js
//Generate an event every 100 milliseconds
var source = Rx.Observable.generateWithRelativeTime(
   0,
   function(x) {return x < 5; },
   function(x) {return x + 1; },
   function(x) {return x; },
   function(x) {return 100; })
  .flatMapFirst(function(value) {
    //Observable takes 150 milliseconds to complete
    return Rx.Observable.timer(150).map(value);
  });

var subscription = source.subscribe(
  function (x) {
    console.log('Next: %d', x);
  },
  function (err) {
    console.log('Error: %s', err);
  },
  function () {
    console.log('Completed');
  });

// Next: 0
// Next: 2
// Next: 4
// Completed
```

### Location

File:
- [`/src/core/linq/observable/flatmapfirst.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/flatmapfirst.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.experimental.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.experimental.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Experimental`](http://www.nuget.org/packages/RxJS-Experimental/)

Unit Tests:
- None
