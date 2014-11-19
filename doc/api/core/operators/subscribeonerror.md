### `Rx.Observable.prototype.subscribeOnError(onError, [thisArg])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/observable.js "View in source")

Subscribes a function to invoke upon exceptional termination of the observable sequence.

#### Arguments
1. `onError` *(`Function`)*: Function to invoke upon exceptional termination of the observable sequence.
2. `[thisArg]` *(`Any`)*: Object to use as this when executing callback.

#### Returns
*(Disposable)*: The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler.

#### Example
```js
/* Using functions */
var source = Rx.Observable.throw(new Error());

var subscription = source.subscribeOnError(
  function (err) {
    console.log('Error: %s', err);
  });

// => Error: Error

/* With a thisArg */
var source = Rx.Observable.throw(new Error());

var subscription = source.subscribeOnError(
  function (err) {
    this.log('Error: %s', err);
  }}, console);

// => Error: Error
```

### Location

File:
- [`/src/core/observable.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/observable.js)

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
- [`/tests/core/observable.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/core/observable.js)
