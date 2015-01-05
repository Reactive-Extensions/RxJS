### `Rx.Observable.prototype.partition(predicate, [thisArg])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/partition.js "View in source")

Returns two observables which partition the observations of the source by the given function.  The first will trigger observations for those values for which the predicate returns true. The second will trigger observations for those values where the predicate returns false. The predicate is executed once for each subscribed observer. Both also propagate all error observations arising from the source and each completes when the source completes.

#### Arguments
1. `predicate` *(`Function`)*: Selector function to invoke for each produced element, resulting in another sequence to which the selector will be invoked recursively again. The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(`Any`)*: Object to use as `this` when executing the predicate.

#### Returns
*(`Array`)*:  An array of observables. The first triggers when the predicate returns true, and the second triggers when the predicate returns false.

#### Example

An example using ES6 syntax:
```js
let [odds, evens] = Rx.Observable.range(0, 10)
  .partition(x => x % 2 === 0);

let subscription1 = odds.subscribe(
  x  => console.log('Evens: %s', x),
  e  => console.log('Error: %s', e),
  () => console.log('Completed')
);

// => Evens: 0
// => Evens: 2
// => Evens: 4
// => Evens: 6
// => Evens: 8
// => Completed

let subscription2 = odds.subscribe(
  x  => console.log('Odds: %s', x),
  e  => console.log('Error: %s', e),
  () => console.log('Completed')
);

// => Odds: 1
// => Odds: 3
// => Odds: 5
// => Odds: 7
// => Odds: 9
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/partition.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/partition.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.coincidence.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.coincidence.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Coincidence`](http://www.nuget.org/packages/RxJS-Coincidence/)

Unit Tests:
- [`/tests/observable/partition.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/partition.js)
