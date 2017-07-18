# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
### `Rx.Observable.mergeDelayError(...args)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/mergedelayerror.js "View in source")

Flattens an Observable that emits Observables into one Observable, in a way that allows an Observer to
receive all successfully emitted items from all of the source Observables without being interrupted by
an error notification from one of them.

This behaves like `Observable.prototype.mergeAll` except that if any of the merged Observables notify of an
error via the Observer's `onError`, `mergeDelayError` will refrain from propagating that
error notification until all of the merged Observables have finished emitting items.

#### Arguments
1. `args` *(Array|arguments)*: Arguments or an array of Observable sequences to merge.

#### Returns
*(`Observable`)*: An Observable that emits all of the items emitted by the Observables emitted by the Observable

#### Example
```js
var source1 = Rx.Observable.of(1,2,3);
var source2 = Rx.Observable.throwError(new Error('woops'));
var source3 = Rx.Observable.of(4,5,6);

var source = Rx.Observable.mergeDelayError(source1, source2, source3);

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

// => 1
// => 2
// => 3
// => 4
// => 5
// => 6
// => Error: Error: woops
```

### Location

File:
- [/src/core/linq/observable/mergedelayerror.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/mergedelayerror.js)

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
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/mergedelayerror.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/mergedelayerror.js)
