# `Rx.TestScheduler` class #

Virtual time scheduler used for testing applications and libraries built using Reactive Extensions.  This inherits from the `Rx.VirtualTimeScheduler` class.

## Usage ##

The following shows an example of using the `Rx.TestScheduler`.  In order to make the end comparisons work, you must implement a collection assert, for example here using QUnit.

```js
function createMessage(expected, actual) {
  return 'Expected: [' + expected.toString() + ']\r\nActual: [' + actual.toString() + ']';
}

// Using QUnit testing for assertions
var collectionAssert = {
  assertEqual: function (actual, expected) {
    var comparer = Rx.internals.isEqual, isOk = true;

    if (expected.length !== actual.length) {
      ok(false, 'Not equal length. Expected: ' + expected.length + ' Actual: ' + actual.length);
      return;
    }

    for(var i = 0, len = expected.length; i < len; i++) {
      isOk = comparer(expected[i], actual[i]);
      if (!isOk) {
        break;
      }
    }

    ok(isOk, createMessage(expected, actual));
  }
};

var onNext = Rx.ReactiveTest.onNext,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe;

var scheduler = new Rx.TestScheduler();

// Create hot observable which will start firing
var xs = scheduler.createHotObservable(
  onNext(150, 1),
  onNext(210, 2),
  onNext(220, 3),
  onCompleted(230)
);

// Note we'll start at 200 for subscribe, hence missing the 150 mark
var res = scheduler.startScheduler(function () {
  return xs.map(function (x) { return x * x });
});

// Implement collection assertion
collectionAssert.assertEqual(res.messages, [
  onNext(210, 4),
  onNext(220, 9),
  onCompleted(230)
]);

// Check for subscribe/unsubscribe
collectionAssert.assertEqual(xs.subscriptions, [
  subscribe(200, 230)
]);
```

### Location

- rx.testing.js

## `TestScheduler Constructor` ##
- [`constructor`](#rxtestscheduler)

## `TestScheduler Instance Methods` ##
- [`createColdObservable`](#rxtestschedulerprototypecreatecoldobservableargs)
- [`createHotObservable`](#rxtestschedulerprototypecreatehotobservableargs)
- [`createObserver`](#rxtestschedulerprototypecreateobserver)
- [`createRejectedPromise`](#rxtestschedulerprototypecreaterejectedpromiseticks-reason)
- [`createResolvedPromise`](#rxtestschedulerprototypecreateresolvedpromiseticks-value)
- [`startScheduler`](#rxtestschedulerprototypestartschedulercreate-settings)

## Inherited Classes ##

- [`Rx.VirtualTimeScheduler`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/virtualtimescheduler.md)

## **TestScheduler Constructor** ##

### <a id="rxtestscheduler"></a>`Rx.TestScheduler()`
<a href="#rxtestscheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/testscheduler.js "View in source")

Creates a new virtual time test scheduler.

#### Example
```js
var onNext = Rx.ReactiveTest.onNext,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe;

var scheduler = new Rx.TestScheduler();

// Create hot observable which will start firing
var xs = scheduler.createHotObservable(
  onNext(150, 1),
  onNext(210, 2),
  onNext(220, 3),
  onCompleted(230)
);

// Note we'll start at 200 for subscribe, hence missing the 150 mark
var res = scheduler.startScheduler(function () {
  return xs.map(function (x) { return x * x });
});

// Implement collection assertion
collectionAssert.assertEqual(res.messages, [
  onNext(210, 4),
  onNext(220, 9),
  onCompleted(230)
]);

// Check for subscribe/unsubscribe
collectionAssert.assertEqual(xs.subscriptions, [
  subscribe(200, 230)
]);
```

### Location

File:
- [`/src/core/testing/testscheduler.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/testscheduler.js)

Dist:
- [`rx.testing.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.texting.js)

Prerequisites:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js) |
[`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js) |
[`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Testing`](http://www.nuget.org/packages/RxJS-Testing/)

* * *

## **TestScheduler Instance Methods** ##

### <a id="rxtestschedulerprototypecreatecoldobservableargs"></a>`Rx.TestScheduler.prototype.createColdObservable(...args)`
<a href="#rxtestschedulerprototypecreatecoldobservableargs">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/testscheduler.js#L118-L121 "View in source")

Creates a cold observable using the specified timestamped notification messages.

### Arguments
1. `args` *(Arguments)*: An arguments array of Recorded objects from `Rx.ReactiveTest.onNext`, `Rx.ReactiveTest.onError`, and `Rx.ReactiveTest.onCompleted` methods.

#### Returns
*(Observable)*: Cold observable sequence that can be used to assert the timing of subscriptions and notifications.

#### Example
```js
var onNext = Rx.ReactiveTest.onNext,
  onCompleted = Rx.ReactiveTest.onCompleted
  subscribe = Rx.ReactiveTest.subscribe;

var scheduler = new Rx.TestScheduler();

// Create cold observable with offset from subscribe time
var xs = scheduler.createColdObservable(
  onNext(150, 1),
  onNext(200, 2),
  onNext(250, 3),
  onCompleted(300)
);

// Note we'll start at 200 for subscribe
var res = scheduler.startScheduler(function () {
  return xs.filter(function (x) { return x % 2 === 0; });
});

// Implement collection assertion
collectionAssert.assertEqual(res.messages, [
  onNext(400, 2),
  onCompleted(500)
]);

// Check for subscribe/unsubscribe
collectionAssert.assertEqual(xs.subscriptions, [
  subscribe(200, 500)
]);
```

### Location

File:
- [`/src/core/testing/testscheduler.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/testscheduler.js)

Dist:
- [`rx.testing.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.texting.js)

Prerequisites:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js) |
[`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js) |
[`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Testing`](http://www.nuget.org/packages/RxJS-Testing/)

* * *

### <a id="rxtestschedulerprototypecreatehotobservableargs"></a>`Rx.TestScheduler.prototype.createHotObservable(...args)`
<a href="#rxtestschedulerprototypecreatehotobservableargs">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/testscheduler.js#L108-L111 "View in source")

Creates a hot observable using the specified timestamped notification messages.

### Arguments
1. `args` *(Arguments)*: An arguments array of Recorded objects from `Rx.ReactiveTest.onNext`, `Rx.ReactiveTest.onError`, and `Rx.ReactiveTest.onCompleted` methods.

#### Returns
*(Observable)*: Hot observable sequence that can be used to assert the timing of subscriptions and notifications.

#### Example
```js
var onNext = Rx.ReactiveTest.onNext,
  onCompleted = Rx.ReactiveTest.onCompleted;

var scheduler = new Rx.TestScheduler();

// Create hot observable which will start firing
var xs = scheduler.createHotObservable(
  onNext(150, 1),
  onNext(210, 2),
  onNext(220, 3),
  onCompleted(230)
);

// Note we'll start at 200 for subscribe, hence missing the 150 mark
var res = scheduler.startScheduler(function () {
  return xs.map(function (x) { return x * x });
});

// Implement collection assertion
collectionAssert.assertEqual(res.messages, [
  onNext(210, 4),
  onNext(220, 9),
  onCompleted(230)
]);

// Check for subscribe/unsubscribe
collectionAssert.assertEqual(xs.subscriptions, [
  subscribe(200, 230)
]);
```

### Location

File:
- [`/src/core/testing/testscheduler.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/testscheduler.js)

Dist:
- [`rx.testing.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.texting.js)

Prerequisites:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js) |
[`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js) |
[`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Testing`](http://www.nuget.org/packages/RxJS-Testing/)

* * *

### <a id="rxtestschedulerprototypecreateobserver"></a>`Rx.TestScheduler.prototype.createObserver()`
<a href="#rxtestschedulerprototypecreateobserver">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/testscheduler.js#L127-L129 "View in source")

Creates an observer that records received notification messages and timestamps those.

#### Returns
`Observer`: Observer that can be used to assert the timing of received notifications.

#### Example
```js
var onNext = Rx.ReactiveTest.onNext;

var scheduler = new Rx.TestScheduler();

var d = new Rx.SerialDisposable();

var xs = Rx.Observable.return(42, scheduler);

var res = scheduler.createObserver();

scheduler.scheduleAbsolute(null, 100, function () {
  return d.setDisposable(xs.subscribe(
    function (x) {
      d.dispose();
      res.onNext(x);
    },
    res.onError.bind(res),
    res.onCompleted.bind(res)
  ));
});

scheduler.start();

collectionAssert.assertEqual(res.messages, [
  onNext(101, 42)
]);
```

### Location

File:
- [`/src/core/testing/testscheduler.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/testscheduler.js)

Dist:
- [`rx.testing.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.texting.js)

Prerequisites:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js) |
[`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js) |
[`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Testing`](http://www.nuget.org/packages/RxJS-Testing/)

* * *

### <a id="rxtestschedulerprototypecreaterejectedpromiseticks-reason"></a>`Rx.TestScheduler.prototype.createRejectedPromise(ticks, value)`
<a href="#rxtestschedulerprototypecreaterejectedpromiseticks-reason">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/testscheduler.js "View in source")

Creates a rejected promise with the given reason and ticks.

### Arguments
1. `ticks` *(Number)*: The absolute time of the resolution.
2. `reason` *(Any)*: The reason for rejection to yield at the given tick.

#### Returns
*(Promise)*: A mock Promise which rejects with the given reason.

#### Example
```js
var onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted;

var scheduler = new Rx.TestScheduler();

// Create rejected promise
var error = new Error();
var xs = scheduler.createRejectedPromise(201, error);

// Note we'll start at 200 for subscribe, hence missing the 150 mark
var res = scheduler.startScheduler(function () {
  // Need to pass test scheduler due to issue #976
  return Rx.Observable.fromPromise(xs, scheduler);
});

// Implement collection assertion
collectionAssert.assertEqual(res.messages, [
  onError(201, error)
]);
```

### Location

File:
- [`/src/core/testing/testscheduler.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/testscheduler.js)

Dist:
- [`rx.testing.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.texting.js)

Prerequisites:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js) |
[`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js) |
[`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Testing`](http://www.nuget.org/packages/RxJS-Testing/)

* * *

### <a id="rxtestschedulerprototypecreateresolvedpromiseticks-value"></a>`Rx.TestScheduler.prototype.createResolvedPromise(ticks, value)`
<a href="#rxtestschedulerprototypecreateresolvedpromiseticks-value">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/testscheduler.js "View in source")

Creates a resolved promise with the given value and ticks.

### Arguments
1. `ticks` *(Number)*: The absolute time of the resolution.
2. `value` *(Any)*: The value to yield at the given tick.

#### Returns
*(Promise)*: A mock Promise which fulfills with the given value.

#### Example
```js
var onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted;

var scheduler = new Rx.TestScheduler();

// Create resolved promise
var xs = scheduler.createResolvedPromise(201, 1);

// Note we'll start at 200 for subscribe, hence missing the 150 mark
var res = scheduler.startScheduler(function () {
  // Need to pass test scheduler due to issue #976
  return Rx.Observable.fromPromise(xs, scheduler);
});

// Implement collection assertion
collectionAssert.assertEqual(res.messages, [
  onNext(201, 1),
  onCompleted(201)
]);
```

### Location

File:
- [`/src/core/testing/testscheduler.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/testscheduler.js)

Dist:
- [`rx.testing.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.texting.js)

Prerequisites:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js) |
[`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js) |
[`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Testing`](http://www.nuget.org/packages/RxJS-Testing/)

* * *

### <a id="rxtestschedulerprototypestartschedulercreate-settings"></a>`Rx.TestScheduler.prototype.startScheduler(create, settings)`
<a href="#rxtestschedulerprototypestartSchedulercreate">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/testscheduler.js "View in source")

Starts the test scheduler and uses the specified settings for creation, subscription and disposal. If not specified, they will be set to their default timings.

### Arguments
1. `create` : `Function` - Factory method to create an observable sequence.
2. `settings`: `Object` - An object with the following properties:
    - `created`: `Number` - the time to create the Observable sequence. If not specified, will default to 100.
    - `subscribed`: `Number` - the time to subscribe to the Observable sequence. If not specified, will default to 200.
    - `disposed`: `Number` - the time to dispose the Observable sequence. If not specified, will default to 1000.

#### Returns
`Observer`: Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.

#### Example
```js
var onNext = Rx.ReactiveTest.onNext,
    onCompleted = Rx.ReactiveTest.onCompleted;

var scheduler = new Rx.TestScheduler();

// Create cold observable with offset from subscribe time
var xs = scheduler.createColdObservable(
  onNext(150, 1),
  onNext(200, 2),
  onNext(250, 3),
  onCompleted(300)
);

// Note we'll start at 200 for subscribe
var res = scheduler.startScheduler(function () {
  return xs.filter(function (x) { return x % 2 === 0; });
});

// Implement collection assertion
collectionAssert.assertEqual(res.messages, [
  onNext(400, 2),
  onCompleted(500)
]);

// Check for subscribe/unsubscribe
collectionAssert.assertEqual(xs.subscriptions, [
  subscribe(200, 500)
]);
```

### Location

File:
- [`/src/core/testing/testscheduler.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/testscheduler.js)

Dist:
- [`rx.testing.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.texting.js)

Prerequisites:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js) |
[`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js) |
[`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Testing`](http://www.nuget.org/packages/RxJS-Testing/)

* * *
