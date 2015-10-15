# Notification object #

Represents a notification to an observer.

## Usage ##

This can be dematerialized into an Observable.
```js
var source = Rx.Observable
  .of(
    Rx.Notification.createOnNext(42),
    Rx.Notification.createOnCompleted()
  )
  .dematerialize();

var subscription = source.subscribe(
  function (x) {
    console.log('Next: %s', x);
  },
  function (err) {
    console.log('Error: %s', err;
  },
  function () {
    console.log('Completed');
  });

// => Next: 42
// => Completed
```

### Location

File:
- [`notification.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/notification.js)

## `Notification Methods`
- [`createOnCompleted`](#rxnotificationcreateoncompleted)
- [`createOnError`](#rxnotificationcreateonerrorexception)
- [`createOnNext`](#rxnotificationcreateonnextvalue)

## `Notification Instance Methods`
- [`accept`](#rxnotificationprototypeacceptobserver--onnext-onerror-oncompleted)
- [`toObservable`](#rxnotificationprototypetoobservablescheduler)

## `Notification Properties`
- [`error`](#error)
- [`kind`](#kind)
- [`value`](#value)

## _Notification Methods_ ##

### <a id="rxnotificationcreateoncompleted"></a>`Rx.Notification.createOnCompleted()`
<a href="#createOnCompleted">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/notification.js#L113-L134 "View in source")

Creates an object that represents an OnCompleted notification to an observer.

#### Returns
`Notification` - The OnCompleted notification.

#### Example
```js
var source = Rx.Observable
  .of(Rx.Notification.createOnCompleted() )
  .dematerialize();

var subscription = source.subscribe(
  function (x) {
    console.log('Next: %s', x);
  },
  function (err) {
    console.log('Error: %s', err;
  },
  function () {
    console.log('Completed');
  });

// => Completed
```

***

### <a id="rxnotificationcreateonerrorexception"></a>`Rx.Notification.createOnError(exception)`
<a href="#rxnotificationcreateonerrorexception">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/notification.js#L85-L107 "View in source")

Creates an object that represents an OnError notification to an observer.

### Arguments
1. `error`: `Any` - The exception contained in the notification.

#### Returns
`Notification` - The OnError notification containing the exception.

#### Example
```js
var source = Rx.Observable
  .of(Rx.Notification.createOnError(new Error('woops')) )
  .dematerialize();

var subscription = source.subscribe(
  function (x) {
    console.log('Next: %s', x);
  },
  function (err) {
    console.log('Error: %s', err;
  },
  function () {
    console.log('Completed');
  });

// => Error: Error: woops
```

### Location

- rx.js

***

### <a id="rxnotificationcreateonnextvalue"></a>`Rx.Notification.createOnNext(value)`
<a href="#rxnotificationcreateonnextvalue">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/notification.js#L56-L178 "View in source")

Creates an object that represents an OnNext notification to an observer.

### Arguments
1. `value`: `Any` - The value contained in the notification.

#### Returns
`Notification`: The onNext notification containing the value.

#### Example
```js
var source = Rx.Observable
  .of(
    Rx.Notification.createOnNext(42),
    Rx.Notification.createOnCompleted()
  )
  .dematerialize();

var subscription = source.subscribe(
  function (x) {
    console.log('Next: %s', x);
  },
  function (err) {
    console.log('Error: %s', err;
  },
  function () {
    console.log('Completed');
  });

// => Next: 42
// => Completed
```

***

## _Notification Instance Methods_ ##

### <a id="rxnotificationprototypeacceptobserver--onnext-onerror-oncompleted"></a>`Rx.Notification.prototype.accept(observer | onNext, onError, onCompleted)`
<a href="#rxnotificationprototypeacceptobserver--onnext-onerror-oncompleted">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/notification.js "View in source")

Invokes the delegate corresponding to the notification or the observer's method corresponding to the notification and returns the produced result or the individual functions given.

### Arguments
1. `[observer]`: `Observer` Observer to invoke the notification on.

OR

1. `onNext`: `Function` -  Function to invoke for an `onNext` notification.
2. `onError`: `Function` - Function to invoke for an `onError` notification.
3. `onCompleted`: `Function` - Function to invoke for an `onCompleted` notification.

#### Returns
`Any`: Result produced by the observation.

#### Example
```js
/* Using an observer */
var observer = Rx.Observer.create(function (x) { return x; });

var notification = Rx.Notification.createOnNext(42);

console.log(notification.accept(observer));

// => 42

/* Using a function */
var notification = Rx.Notification.createOnNext(42);

console.log(notification.accept(function (x) { return x; }))
// => 42
```

***

### <a id="rxnotificationprototypetoobservablescheduler"></a>`Rx.Notification.prototype.toObservable([scheduler])`
<a href="#rxnotificationprototypetoobservablescheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/notification.js "View in source")

Returns an observable sequence with a single notification.

### Arguments
1. `[scheduler = Rx.Scheduler.immediate]` `Scheduler`: Scheduler to send out the notification calls on.

#### Returns
`Observable`: The observable sequence that surfaces the behavior of the notification upon subscription.

#### Example
```js
/* Without a scheduler */
var source = Rx.Notification.createOnNext(42)
  .toObservable();

var subscription = source.subscribe(
  function (x) {
    console.log('Next: %s', x);
  },
  function (err) {
    console.log('Error: %s', err;
  },
  function () {
    console.log('Completed');
  });

// => Next: 42
// => Completed

/* With a scheduler */
var source = Rx.Notification.createOnError(new Error('error!'))
  .toObservable(Rx.Scheduler.default);

var subscription = source.subscribe(
  function (x) {
    console.log('Next: %s', x);
  },
  function (err) {
    console.log('Error: %s', err;
  },
  function () {
    console.log('Completed');
  });

// => Error: Error: error!
```

***

## _Notification Properties_ ##

### <a id="error"></a>`error`
<a href="#error">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/notification.js "View in source")

Gets the exception from the OnError notification.

#### Returns
`Any`: The Error from the `onError` notification.

#### Example
```js
var notification = Rx.Notification.createOnError(new Error('invalid'));
console.log(notification.error);

// => Error: invalid
```

***

### <a id="kind"></a>`kind`
<a href="#kind">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/notification.js "View in source")

Gets the kind from the notification which denotes 'N' for OnNext, 'E' for OnError and 'C' for OnCompleted.

#### Returns
`String`: The kind from the notification which denotes 'N' for OnNext, 'E' for OnError and 'C' for OnCompleted.

#### Example
```js
var notification = Rx.Notification.createOnCompleted();
console.log(notification.kind);

// => C
```

***

### <a id="value"></a>`value`
<a href="#value">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/notification.js "View in source")

Gets the value from the `onNext` notification.

#### Returns
`Any`: The value from the OnNext notification.

#### Example
```js
var notification = Rx.Notification.createOnNext(42);
console.log(notification.value);

// => 42
```

***
