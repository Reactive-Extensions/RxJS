# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
### `Rx.Observable.prototype.finally(action)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/finally.js "View in source")

Invokes a specified action after the source observable sequence terminates gracefully or exceptionally.  There is an alias called `finallyAction` for browsers <IE9

#### Arguments
1. `action` *(`Function`)*: A function to invoke after the source observable sequence terminates.

#### Returns
*(`Observable`)*: The source sequence with the side-effecting behavior applied.

#### Example
```js
/* Terminated by error still fires function */
var source = Rx.Observable.throw(new Error())
  .finally(function () { console.log('Finally'); });

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

// => Error: Error
// => Finally
```

### Location

File:
- [`/src/core/perf/operators/finally.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/finally.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/finally.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/finally.js)
