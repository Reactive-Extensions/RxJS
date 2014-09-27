# `Rx.BehaviorSubject` class #

Represents a value that changes over time.  Observers can subscribe to the subject to receive the last (or initial) value and all subsequent notifications.

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
- [`hasObservers`](#rxbehaviorsubjectprototypehasobservers)

## Inherited Classes ##
- [`Rx.Observable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/core/observable.md)
- [`Rx.Observer`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/core/observer.md)

## _BehaviorSubject Constructor_ ##

### <a id="rxbehaviorsubjectintialvalue"></a>`Rx.BehaviorSubject(initialValue)`
<a href="#rxbehaviorsubjectintialvalue">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/behaviorsubject.js#L30-L37 "View in source")

Initializes a new instance of the `Rx.BehaviorSubject` class which creates a subject that caches its last value and starts with the specified value.

#### Arguments
1. `initialValue` *(Any)*: Initial value sent to observers when no other value has been received by the subject yet.

#### Example
```js
var subject = new Rx.BehaviorSubject(56);

subject.onCompleted();

var subscription = source.subscribe(
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
<a href="#rxbehaviorsubjectprototypedispose">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/behaviorsubject.js#L97-L102 "View in source")

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

### <a id="rxbehaviorsubjectprototypehasobservers"></a>`Rx.BehaviorSubject.prototype.hasObservers()`
<a href="#rxbehaviorsubjectprototypehasobservers">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/behaviorsubject.js#L44-L46 "View in source")

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
