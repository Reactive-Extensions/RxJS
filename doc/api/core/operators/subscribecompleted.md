### `Rx.Observable.prototype.subscribeCompleted(onCompleted, [thisArg])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/observable.js "View in source") 

Subscribes a function to invoke upon graceful termination of the observable sequence.

#### Arguments
1. `onCompleted` *(`Function`)*: Function to invoke upon graceful termination of the observable sequence.
2. `[thisArg]` *(`Any`)*: Object to use as this when executing callback.

#### Returns
*(Disposable)*: The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler. 

#### Example
```js
/* Using functions */
var source = Rx.Observable.range(0, 3);

var subscription = source.subscribeError(
  function () {
    console.log('Completed');
  });

// => Completed

/* With a thisArg */
var source = Rx.Observable.range(0, 3);

var subscription = source.subscribeCompleted(
  function (err) {
    this.log('Completed');
  }}, console);

// => Completed
```

### Location

File:
- [`/src/core/observable.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/observable.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/core/observable.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/core/observable.js)