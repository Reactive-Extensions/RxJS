# `Rx.BehaviorSubject` class #

Represents a value that changes over time.  Observers can subscribe to the subject to receive the last (or initial) value and all subsequent notifications. If you are looking for BehaviorSubject without initial value see [`Rx.ReplaySubject`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/replaysubject.md).

This class inherits both from the `Rx.Observable` and `Rx.Observer` classes.

## Usage ##

The follow example shows the basic usage of an `Rx.BehaviorSubject` class.

```js
/* Initialize with initial value of 42 */
var subject = new Rx.BehaviorSubject(42);

var subscription = subject.subscribe(
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

subject.onNext(56);
// => Next: 56

subject.onCompleted();
// => Completed
```

### Location

- rx.binding.js

## `BehaviorSubject Constructor` ##
- [`constructor`](#rxbehaviorsubjectintialvalue)

## `BehaviorSubject Instance Methods` ##
- [`dispose`](#rxbehaviorsubjectprototypedispose)
- [`getValue`] (#rxbehaviorsubjectprototypegetvalue)
- [`hasObservers`](#rxbehaviorsubjectprototypehasobservers)

## Inherited Classes ##
- [`Rx.Observable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)
- [`Rx.Observer`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observer.md)

## _BehaviorSubject Constructor_ ##

### <a id="rxbehaviorsubjectintialvalue"></a>`Rx.BehaviorSubject(initialValue)`
<a href="#rxbehaviorsubjectintialvalue">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/behaviorsubject.js#L27-L34 "View in source")

Initializes a new instance of the `Rx.BehaviorSubject` class which creates a subject that caches its last value and starts with the specified value.

#### Arguments
1. `initialValue` *(Any)*: Initial value sent to observers when no other value has been received by the subject yet.

#### Example
```js
var subject = new Rx.BehaviorSubject(56);

subject.onCompleted();

var subscription = subject.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

// => Next: 56

subject.onNext(42);
// => Next: 42

subject.onCompleted();
// => Completed
```

### Location

= rx.binding.js

* * *

## _BehaviorSubject Instance Methods_ ##

### <a id="rxbehaviorsubjectprototypedispose"></a>`Rx.BehaviorSubject.prototype.dispose()`
<a href="#rxbehaviorsubjectprototypedispose">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/behaviorsubject.js#L101-L106 "View in source")

Unsubscribe all observers and release resources.

#### Example
```js
var subject = new Rx.BehaviorSubject();

var subscription = subject.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

subject.onNext(42);
// => Next: 42

subject.onCompleted();
// => Completed

subject.dispose();

try {
	subject.onNext(56);
} catch (e) {
	console.log(e.message);
}

// => Object has been disposed
```

### Location

= rx.binding.js

* * *

### <a id="rxbehaviorsubjectprototypegetvalue"></a>`Rx.BehaviorSubject.prototype.getValue()`
<a href="#rxbehaviorsubjectprototypegetvalue">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/behaviorsubject.js#L44-L50 "View in source")

Gets the current value or throws an exception.
Value is frozen after `onCompleted` is called.
After `onError` is called always throws the specified exception.
An exception is always thrown after `dispose` is called.

#### Returns
*(Mixed)*: The initial `value` passed to the constructor until `onNext` is called; after which, the last value passed to `onNext`.

#### Example
```js
var subject = new Rx.BehaviorSubject(56);

console.log('Value is: ' + subject.getValue());

// => Value is: 56

subject.onNext(42);

console.log('Value is: ' + subject.getValue());

// => Value is: 42

subject.onCompleted();

subject.onNext(100);

console.log('Value is frozen: ' + subject.getValue());

// => Value is frozen: 42

subject.dispose();

try {
    subject.getValue();
} catch (e) {
    console.log(e.message);
}

// => Object has been disposed
```

### Location

= rx.binding.js

* * *

### <a id="rxbehaviorsubjectprototypehasobservers"></a>`Rx.BehaviorSubject.prototype.hasObservers()`
<a href="#rxbehaviorsubjectprototypehasobservers">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/behaviorsubject.js#L55 "View in source")

Indicates whether the subject has observers subscribed to it.

#### Returns
*(Boolean)*: Returns `true` if the Subject has observers, else `false`.

#### Example
```js
var subject = new Rx.BehaviorSubject();

console.log(subject.hasObservers());

// => false

var subscription = subject.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

console.log(subject.hasObservers());

// => true
```

### Location

= rx.binding.js

* * *
