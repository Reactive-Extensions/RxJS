### `Rx.Observable.prototype.subscribe([observer] | [onNext], [onError], [onCompleted], [thisArg])`
### `Rx.Observable.prototype.forEach([observer] | [onNext], [onError], [onCompleted], [thisArg])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/observable.js "View in source")

Subscribes an observer to the observable sequence.

#### Arguments
1. `[observer]` *(Observer)*: The object that is to receive notifications.
1. `[onNext]` *(`Function`)*: Function to invoke for each element in the observable sequence.
2. `[onError]` *(`Function`)*: Function to invoke upon exceptional termination of the observable sequence.
3. `[onCompleted]` *(`Function`)*: Function to invoke upon graceful termination of the observable sequence.
4. `[thisArg]` *(`Any`)*: Object to use as this when executing callback.

#### Returns
*(Disposable)*: The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler.

#### Example
```js
/* With no arguments */
var source = Rx.Observable.range(0, 3)
    .do(function (x) { console.log('Do Next: ' + x); });

var subscription = source.subscribe();

// => Do Next: 0
// => Do Next: 1
// => Do Next: 2

/* With an observer */
var observer = Rx.Observer.create(
  function (x) {
    console.log('Next: %s', x);
  },
  function (err) {
    console.log('Error: %s', err);
  },
  function () {
    console.log('Completed');
  });

var source = Rx.Observable.range(0, 3)

var subscription = source.subscribe(observer);

// => Next: 0
// => Next: 1
// => Next: 2

/* Using functions */
var source = Rx.Observable.range(0, 3)

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

// => Next: 0
// => Next: 1
// => Next: 2

/* With a thisArg */
var source = Rx.Observable.range(0, 3)

var subscription = source.subscribe(
  function (x) {
    this.log('Next: %s', x);
  },
  function (err) {
    this.log('Error: %s', err);
  },
  function () {
    this.log('Completed');
  }, console);

// => Next: 0
// => Next: 1
// => Next: 2
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
