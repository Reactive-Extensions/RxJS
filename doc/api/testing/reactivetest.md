# `Rx.ReactiveTest` class #

This class contains test utility methods such as create notifications for testing purposes.

### Location

- rx.testing.js

## `ReactiveTest Class Methods` ##
- [`onCompleted`](#rxreactivetestoncompletedticks)
- [`onError`](#rxreactivetestonerrorticksexception)
- [`onNext`](#rxreactivetestonnextticksvalue)
- [`subscribe`](#rxasyncsubjectprototypehasobservers)

## `ReactiveTest Class Fields` ##
- [`created`](#rxreactivetestcreated)
- [`disposed`](#rxreactivetestdisposed)
- [`subscribed`](#rxreactivetestsubscribed)

## _ReactiveTest Class Methods_ ##

### <a id="rxreactivetestoncompletedticks"></a>`Rx.ReactiveTest.onCompleted(ticks)`
<a href="#rxreactivetestoncompletedticks">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/reactivetest.js#L89-L91 "View in source")

Factory method for an OnCompleted notification record at a given time.

#### Arguments
1. `ticks` *(Number)*: Recorded virtual time the OnCompleted notification occurs.

#### Returns
*(Recorded)*: OnCompleted notification.

#### Example
```js
var onCompleted = Rx.ReactiveTest.onCompleted;

var scheduler = new Rx.TestScheduler();

var xs = scheduler.createHotObservable(
    onCompleted(260)
);

var res = scheduler.startWithCreate(function () {
    return xs.map(function (x) { return x; });
});

// Write custom assertion
collectionAssert(res, [
    onCompleted(260)
]);
```

### Location

- rx.testing.js

* * *

### <a id="rxreactivetestonerrorticksexception"></a>`Rx.ReactiveTest.onError(ticks, exception)`
<a href="#rxreactivetestonerrorticksexception">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/reactivetest.js#L77-L82 "View in source")

Factory method for an OnError notification record at a given time with a given error.

#### Arguments
1. `ticks` *(Number)*: Recorded virtual time the OnError notification occurs.
2. `exception` *(Error | Function)*: Recorded exception stored in the OnError notification or a predicate

#### Returns
*(Recorded)*: Recorded OnError notification.

#### Example

```js
var ex = new Error('woops');

var onError = Rx.ReactiveTest.onError;

var scheduler = new Rx.TestScheduler();

var xs = scheduler.createHotObservable(
    onError(201, ex)
);

var res = scheduler.startWithCreate(function () {
    return xs.map(function (x) { return x; });
});

// Write custom assertion
collectionAssert(res, [

    // Using a predicate
    onError(201, function (e) { return e.message === 'woops'; })
]);
```

### Location

- rx.testing.js

* * *

### <a id="rxreactivetestonnextticksvalue"></a>`Rx.ReactiveTest.onNext(ticks, value)`
<a href="#rxreactivetestonnextticksvalue">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/reactivetest.js#L61-L66 "View in source")

Factory method for an OnNext notification record at a given time with a given error.

#### Arguments
1. `ticks` *(Number)*: Recorded virtual time the OnNext notification occurs.
2. `value` *(Any | Function)*: Recorded exception stored in the OnNext notification or a predicate

#### Returns
*(Recorded)*: Recorded OnNext notification.

#### Example

```js
var ex = new Error('woops');

var onNext = Rx.ReactiveTest.onNext;

var scheduler = new Rx.TestScheduler();

var xs = scheduler.createHotObservable(
    onNext(201, 42)
);

var res = scheduler.startWithCreate(function () {
    return xs.map(function (x) { return x; });
});

// Write custom assertion
collectionAssert(res, [

    // Using a predicate
    onNext(201, function (x) { return x === 42; })
]);
```

### Location

- rx.testing.js

* * *

## _ReactiveTest Class Fields_ ##

### <a id="rxreactivetestcreated"></a>`Rx.ReactiveTest.created`
<a href="#rxreactivetestcreated">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/reactivetest.js#L45 "View in source")

Default virtual time used for creation of observable sequences in unit tests.  This has a value of `100`.

#### Example

```js
var scheduler = new Rx.TestScheduler();

var xs = scheduler.createHotObservable(
    Rx.ReactiveTest.onNext(201, 42),
    Rx.ReactiveTest.onNext(202, 56),
    Rx.ReactiveTest.onCompleted(203)
);

var res = scheduler.startWithTiming(
    function () { return xs.map(funxtion (x) { return x; })},
    Rx.ReactiveTest.created,
    Rx.ReactiveTest.subscribed,
    Rx.ReactiveTest.disposed
);
```

### Location

- rx.testing.js

* * *

### <a id="rxreactivetestdisposed"></a>`Rx.ReactiveTest.disposed`
<a href="#rxreactivetestdisposed">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/reactivetest.js#L49 "View in source")

Default virtual time used to dispose subscriptions in unit tests.  This has a value of `1000`.

#### Example

```js
var scheduler = new Rx.TestScheduler();

var xs = scheduler.createHotObservable(
    Rx.ReactiveTest.onNext(201, 42),
    Rx.ReactiveTest.onNext(202, 56),
    Rx.ReactiveTest.onCompleted(203)
);

var res = scheduler.startWithTiming(
    function () { return xs.map(funxtion (x) { return x; })},
    Rx.ReactiveTest.created,
    Rx.ReactiveTest.subscribed,
    Rx.ReactiveTest.disposed
);
```

### Location

- rx.testing.js

* * *

### <a id="rxreactivetestsubscribed"></a>`Rx.ReactiveTest.subscribed`
<a href="#rxreactivetestsubscribed">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/reactivetest.js#L47 "View in source")

Default virtual time used to subscribe to observable sequences in unit tests.  This has a value of `200`.

#### Example

```js
var scheduler = new Rx.TestScheduler();

var xs = scheduler.createHotObservable(
    Rx.ReactiveTest.onNext(201, 42),
    Rx.ReactiveTest.onNext(202, 56),
    Rx.ReactiveTest.onCompleted(203)
);

var res = scheduler.startWithTiming(
    function () { return xs.map(funxtion (x) { return x; })},
    Rx.ReactiveTest.created,
    Rx.ReactiveTest.subscribed,
    Rx.ReactiveTest.disposed
);
```

### Location

- rx.testing.js

* * *
