# Notification object #

Represents a notification to an observer.

## `Notification Methods`
- [`createOnCompleted`](#rxnotificationcreateoncompleted)
- [`createOnError`](#rxnotificationcreateonerrorexception)
- [`createOnNext`](#rxnotificationcreateonnextvalue)

## `Notification Instance Methods`
- [`accept`](#accept)
- [`toObservable`](#rxobserverprototypeasobserver)
- [`toString`](#toString)

## `Notification Properties`
- [`exception`](#exception)
- [`kind`](#kind)
- [`value`](#value)

## _Notification Methods_ ##

### <a id="rxnotificationcreateoncompleted"></a>`Rx.Notification.createOnCompleted()`
<a href="#createOnCompleted">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2862-L2872 "View in source") [&#x24C9;][1]

Creates an object that represents an OnCompleted notification to an observer.

#### Returns
*(Notification)*: The OnCompleted notification.

#### Example
```js
var source = Rx.Observable
    .fromArray([
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
<a href="#rxnotificationcreateonerrorexception">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2862-L2872 "View in source") [&#x24C9;][1]

Creates an object that represents an OnError notification to an observer.

### Arguments
1. `exception` *(Any)*: The exception contained in the notification.

#### Returns
*(Notification)*: The OnError notification containing the exception.

#### Example
```js
var source = Rx.Observable
    .fromArray([
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
<a href="#rxnotificationcreateonnextvalue">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2862-L2872 "View in source") [&#x24C9;][1]

Creates an object that represents an OnNext notification to an observer.

### Arguments
1. `value` *(Any)*: The value contained in the notification.

#### Returns
*(Notification)*: The OnNext notification containing the value.

#### Example
```js
var source = Rx.Observable
    .fromArray([
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

### <a id="rxnotificationprototypeaccept"></a>`Rx.Notification.prototype.accept([observer] | [onNext], [onError], [onCompleted])`
<a href="#rxnotificationcreateonnextvalue">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2862-L2872 "View in source") [&#x24C9;][1]

Invokes the delegate corresponding to the notification or the observer's method corresponding to the notification and returns the produced result.

### Arguments
1. `[observer]` *(Observer)*: Observer to invoke the notification on.
1. `[onNext]` *(Function)*: Function to invoke for an OnNext notification.
2. `[onError]` *(Function)*: Function to invoke for an OnError notification.
2. `[onError]` *(Function)*: Function to invoke for an OnCompleted notification.

#### Returns
*(Any)*: Result produced by the observation.

#### Example
```js
var source = Rx.Observable
    .fromArray([
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