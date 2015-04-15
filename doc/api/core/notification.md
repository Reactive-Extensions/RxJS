# Notification object #

Represents a notification to an observer.

## `Notification Methods`
- [`createOnCompleted`](#rxnotificationcreateoncompleted)
- [`createOnError`](#rxnotificationcreateonerrorexception)
- [`createOnNext`](#rxnotificationcreateonnextvalue)

## `Notification Instance Methods`
- [`accept`](#rxnotificationprototypeacceptobserver--onnext-onerror-oncompleted)
- [`toObservable`](#rxnotificationprototypetoobservablescheduler)

## `Notification Properties`
- [`exception`](#exception)
- [`hasValue`](#hasvalue)
- [`kind`](#kind)
- [`value`](#value)

## _Notification Methods_ ##

### <a id="rxnotificationcreateoncompleted"></a>`Rx.Notification.createOnCompleted()`
<a href="#createOnCompleted">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/notification.js#L113-L134 "View in source")

Creates an object that represents an OnCompleted notification to an observer.

#### Returns
*(Notification)*: The OnCompleted notification.

#### Example
```js
var source = Rx.Observable
    .from([
        Rx.Notification.createOnCompleted()
    ])
    .dematerialize();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

// => Completed
```

### Location

- rx.js

* * *

### <a id="rxnotificationcreateonerrorexception"></a>`Rx.Notification.createOnError(exception)`
<a href="#rxnotificationcreateonerrorexception">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/notification.js#L85-L107 "View in source")

Creates an object that represents an OnError notification to an observer.

### Arguments
1. `exception` *(Any)*: The exception contained in the notification.

#### Returns
*(Notification)*: The OnError notification containing the exception.

#### Example
```js
var source = Rx.Observable
    .from([
        Rx.Notification.createOnError(new Error('woops'))
    ])
    .dematerialize();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

// => Error: Error: woops
```

### Location

- rx.js

* * *

### <a id="rxnotificationcreateonnextvalue"></a>`Rx.Notification.createOnNext(value)`
<a href="#rxnotificationcreateonnextvalue">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/notification.js#L56-L178 "View in source")

Creates an object that represents an OnNext notification to an observer.

### Arguments
1. `value` *(Any)*: The value contained in the notification.

#### Returns
*(Notification)*: The OnNext notification containing the value.

#### Example
```js
var source = Rx.Observable
    .from([
        Rx.Notification.createOnNext(42),
        Rx.Notification.createOnCompleted()
    ])
    .dematerialize();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

// => Next: 42
// => Completed
```

### Location

- rx.js

* * *

## _Notification Instance Methods_ ##

### <a id="rxnotificationprototypeacceptobserver--onnext-onerror-oncompleted"></a>`Rx.Notification.prototype.accept([observer] | [onNext], [onError], [onCompleted])`
<a href="#rxnotificationprototypeacceptobserver--onnext-onerror-oncompleted">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/notification.js#L21-L26 "View in source")

Invokes the delegate corresponding to the notification or the observer's method corresponding to the notification and returns the produced result.

### Arguments
1. `[observer]` *(Observer)*: Observer to invoke the notification on.
1. `[onNext]` *(Function)*: Function to invoke for an OnNext notification.
2. `[onError]` *(Function)*: Function to invoke for an OnError notification.
3. `[OnCompleted]` *(Function)*: Function to invoke for an OnCompleted notification.

#### Returns
*(Any)*: Result produced by the observation.

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

### Location

- rx.js

* * *

### <a id="rxnotificationprototypetoobservablescheduler"></a>`Rx.Notification.prototype.toObservable([scheduler])`
<a href="#rxnotificationprototypetoobservablescheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/notification.js#L35-L46 "View in source")

Returns an observable sequence with a single notification.

### Arguments
1. `[scheduler = Rx.Scheduler.immediate]` *(Scheduler)*: Scheduler to send out the notification calls on.

#### Returns
*(Observable)*: The observable sequence that surfaces the behavior of the notification upon subscription.

#### Example
```js
/* Without a scheduler */
var source = Rx.Notification.createOnNext(42)
    .toObservable();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

// => Next: 42
// => Completed

/* With a scheduler */
var source = Rx.Notification.createOnError(new Error('error!'))
    .toObservable(Rx.Scheduler.immediate);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

// => Error: Error: error!
```

### Location

- rx.js

* * *

## _Notification Properties_ ##

### <a id="exception"></a>`exception`
<a href="#exception">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/notification.js#L101 "View in source")

Gets the exception from the OnError notification.

#### Returns
*(Any)*: The Exception from the OnError notification.

#### Example
```js
var notification = Rx.Notification.createOnError(new Error('invalid'));
console.log(notification.exception);

// => Error: invalid
```

### Location

- rx.js

* * *

### <a id="hasvalue"></a>`hasValue`
<a href="#hasvalue">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/notification.js#L6 "View in source")

Determines whether the Notification has a value.  Returns `true` for OnNext Notifications, and `false` for OnError and OnCompleted Notifications.

#### Returns
*(Bool)*: Returns `true` for OnNext Notifications, and `false` for OnError and OnCompleted Notifications.

#### Example
```js
var onNext = Rx.Notification.createOnNext(42);
console.log(onNext.hasValue);

// => true

var onCompleted = Rx.Notification.createOnCompleted();
console.log(onCompleted.hasValue);

// => false
```

### Location

- rx.js

* * *

### <a id="kind"></a>`kind`
<a href="#kind">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/notification.js#L7 "View in source")

Gets the kind from the notification which denotes 'N' for OnNext, 'E' for OnError and 'C' for OnCompleted.

#### Returns
*(String)*: The kind from the notification which denotes 'N' for OnNext, 'E' for OnError and 'C' for OnCompleted.

#### Example
```js
var notification = Rx.Notification.createOnCompleted();
console.log(notification.kind);

// => C
```

### Location

- rx.js

* * *

### <a id="value"></a>`value`
<a href="#kind">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/notification.js#L72 "View in source")

Gets the value from the OnNext notification.

#### Returns
*(Any)*: The value from the OnNext notification.

#### Example
```js
var notification = Rx.Notification.createOnNext(42);
console.log(notification.value);

// => 42
```

### Location

- rx.js

* * *
