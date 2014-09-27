# `Rx.TestScheduler` class #

Virtual time scheduler used for testing applications and libraries built using Reactive Extensions.  This inherits from the `Rx.TestScheduler` class.

## Usage ##

The following shows an example of using the `Rx.TestScheduler`.  In order to make the end comparisons work, you must implement a collection assert, for example here using QUnit.

```js
function createMessage(actual, expected) {
    return 'Expected: [' + expected.toString() + ']\r\nActual: [' + actual.toString() + ']';
}

// Using QUnit testing for assertions
var collectionAssert = {
    assertEqual: function (expected, actual) {
        var comparer = Rx.Internals.isEqual,
            isOk = true;

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
var res = scheduler.startWithCreate(function () {
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
- [`startWithCreate`](#rxtestschedulerprototypestartwithcreatecreate)
- [`startWithDispose`](#rxtestschedulerprototypestartwithdisposecreate-disposed)
- [`startWithTiming`](#rxtestschedulerprototypestartwithtimingcreate-created-subscribed-disposed)

## Inherited Classes ##

- [`Rx.VirtualTimeScheduler`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/virtualtimescheduler.md)

## _TestScheduler Constructor_ ##

### <a id="rxtestscheduler"></a>`Rx.TestScheduler()`
<a href="#rxtestscheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/testscheduler.js#L10-L12 "View in source")

Creates a new virtual time test scheduler.

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
var res = scheduler.startWithCreate(function () {
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

* * *

## _TestScheduler Instance Methods_ ##

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
var res = scheduler.startWithCreate(function () {
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

- rx.testing.js

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
var res = scheduler.startWithCreate(function () {
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

* * *

### <a id="rxtestschedulerprototypecreateobserver"></a>`Rx.TestScheduler.prototype.createObserver()`
<a href="#rxtestschedulerprototypecreateobserver">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/testscheduler.js#L127-L129 "View in source")

Creates an observer that records received notification messages and timestamps those.

#### Returns
*(Observer)*: Observer that can be used to assert the timing of received notifications.

#### Example
```js
var onNext = Rx.ReactiveTest.onNext;

var scheduler = new Rx.TestScheduler();

var d = new Rx.SerialDisposable();

var xs = Rx.Observable.return(42, scheduler);

var res = scheduler.createObserver();

scheduler.scheduleAbsolute(100, function () {
    d.setDisposable(xs.subscribe(
        function (x) {
            d.dispose();
            res.onNext(x);
        },
        res.onError.bind(res),
        res.onCompleted.bind(res)
    );
});

scheduler.start();

collectionAssert.assertEqual(res.messages, [
    onNext(101, 42)
]);
```

### Location

- rx.testing.js

* * *

### <a id="rxtestschedulerprototypestartwithcreatecreate"></a>`Rx.TestScheduler.prototype.startWithCreate(create)`
<a href="#rxtestschedulerprototypestartwithcreatecreate">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/testscheduler.js#L99-L101 "View in source")

Starts the test scheduler and uses default virtual times to invoke the factory function, to subscribe to the resulting sequence, and to dispose the subscription.

### Arguments
1. `create` *(Function)*: Factory method to create an observable sequence.

#### Returns
*(Observer)*: Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.

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
var res = scheduler.startWithCreate(function () {
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

- rx.testing.js

* * *

### <a id="rxtestschedulerprototypestartwithdisposecreate-disposed"></a>`Rx.TestScheduler.prototype.startWithDispose(create, disposed)`
<a href="#rxtestschedulerprototypestartwithdisposecreate-disposed">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/testscheduler.js#L90-L92 "View in source")

Starts the test scheduler and uses the specified virtual time to dispose the subscription to the sequence obtained through the factory function.
Default virtual times are used for factory invocation and sequence subscription.

### Arguments
1. `create` *(Function)*: Factory method to create an observable sequence.
2. `disposed` *(Number)*: Virtual time at which to dispose the subscription.

#### Returns
*(Observer)*: Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.

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
var res = scheduler.startWithDispose(
    function () {
        return xs.map(function (x) { return x * x });
    },
    215 /* Dispose at 215 */
);

// Implement collection assertion
collectionAssert.assertEqual(res.messages, [
    onNext(210, 4),
    onCompleted(215)
]);

// Check for subscribe/unsubscribe
collectionAssert.assertEqual(xs.subscriptions, [
    subscribe(200, 215)
]);
```

### Location

- rx.testing.js

* * *

### <a id="rxtestschedulerprototypestartwithtimingcreate-created-subscribed-disposed"></a>`Rx.TestScheduler.prototype.startWithTiming(create, created, subscribed, disposed)`
<a href="#rxtestschedulerprototypestartwithtimingcreate-created-subscribed-disposed">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/testscheduler.js#L65-L81 "View in source")

Starts the test scheduler and uses the specified virtual times to invoke the factory function, subscribe to the resulting sequence, and dispose the subscription.

### Arguments
1. `create` *(Function)*: Factory method to create an observable sequence.
2. `created` *(Number)*: Virtual time at which to invoke the factory to create an observable sequence.
3. `subscribed` *(Number)*: Virtual time at which to subscribe to the created observable sequence.
4. `disposed` *(Number)*: Virtual time at which to dispose the subscription.

#### Returns
*(Observer)*: Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.

#### Example
```js
var onNext = Rx.ReactiveTest.onNext,
    onCompleted = Rx.ReactiveTest.onCompleted;

var scheduler = new Rx.TestScheduler();

// Create hot observable which will start firing
var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(260, 3),
    onNext(310, 4),
    onCompleted(360)
);

// Note we'll start at 200 for subscribe, hence missing the 150 mark
var res = scheduler.startWithTiming(
    function () {
        return xs.map(function (x) { return x * x });
    },
    100, /* Create at 100    */
    200, /* Subscribe at 200 */
    300  /* Dispose at 300   */
);

// Implement collection assertion
collectionAssert.assertEqual(res.messages, [
    onNext(210, 4),
    onNext(260, 9),
    onCompleted(300)
]);

// Check for subscribe/unsubscribe
collectionAssert.assertEqual(xs.subscriptions, [
    subscribe(200, 300)
]);
```

### Location

- rx.testing.js

* * *
