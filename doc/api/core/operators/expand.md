# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
### `Rx.Observable.prototype.expand(selector, [scheduler])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/expand.js "View in source")

Expands an observable sequence by recursively invoking selector.

#### Arguments
1. `selector` *(`Function`)*: Selector function to invoke for each produced element, resulting in another sequence to which the selector will be invoked recursively again.
2. [`scheduler=Rx.Scheduler.immediate`] *(`Scheduler`)*: Scheduler on which to perform the expansion. If not provided, this defaults to the immediate scheduler.

#### Returns
*(`Observable`)*: An observable sequence containing a single element determining whether all elements in the source sequence pass the test in the specified predicate.

#### Example
```js
var source = Rx.Observable.return(42)
    .expand(function (x) { return Rx.Observable.return(42 + x); })
    .take(5);

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

// => Next: 42
// => Next: 84
// => Next: 126
// => Next: 168
// => Next: 210
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/expand.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/expand.js)

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
- [`/tests/observable/expand.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/expand.js)
