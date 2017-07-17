# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
### `Rx.Observable.empty([scheduler])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/empty.js "View in source")

Returns an empty observable sequence, using the specified scheduler to send out the single OnCompleted message.

#### Arguments
1. `[scheduler=Rx.Scheduler.immediate]` *(`Scheduler`)*: Scheduler to send the termination call on.

#### Returns
*(`Observable`)*: An observable sequence with no elements.

#### Example
```js
var source = Rx.Observable.empty();

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
  
// => Completed
```

### Location

File:
- [/src/core/perf/operators/empty.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/empty.js)

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
- [`RxJS-Complete`](http://www.nuget.org/packages/RxJS-Complete)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [/tests/observable/empty.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/empty.js)
