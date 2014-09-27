# `Rx.ReplaySubject` class #

Represents an object that is both an observable sequence as well as an observer.  Each notification is broadcasted to all subscribed and future observers, subject to buffer trimming policies.

This class inherits both from the `Rx.Observable` and `Rx.Observer` classes.

## Usage ##

The follow example shows the basic usage of an `Rx.ReplaySubject` class.  Note that this only holds the past two items in the cache.

```js
var subject = new Rx.ReplaySubject(2 /* buffer size */);

subject.onNext('a');
subject.onNext('b');
subject.onNext('c');

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

// => Next: b
// => Next: c

subject.onNext('d');
// => Next: d
```

### Location

- rx.binding.js

## `ReplaySubject Constructor` ##
- [`constructor`](#rx)

## `ReplaySubject Instance Methods` ##
- [`dispose`](#rxreplaysubjectprototypedispose)
- [`hasObservers`](#rxreplaysubjectprototypehasobservers)

## Inherited Classes ##
- [`Rx.Observable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/core/observable.md)
- [`Rx.Observer`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/core/observer.md)

## _ReplaySubject Constructor_ ##

### <a id="rxreplaysubjectbuffersize-windowSize-scheduler"></a>`Rx.ReplaySubject([bufferSize], [windowSize], [scheduler])`
<a href="#rxreplaysubjectintialvalue">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/replaysubject.js#L53-L64 "View in source")

Initializes a new instance of the `Rx.ReplaySubject` class with the specified buffer size, window and scheduler.

#### Arguments
1. `[bufferSize = Number.MAX_VALUE]` *(Number)*: Maximum element count of the replay buffer.
2. `[windowSize = NUMBER.MAX_VALUE]` *(Number)*: Maximum time length of the replay buffer.
3. `[scheduler = Rx.Scheduler.currentThread]` *(Scheduler)*: Scheduler the observers are invoked on.

#### Example
```js
var subject = new Rx.ReplaySubject(
    2 /* buffer size */,
    null /* unlimited time buffer */,
    Rx.Scheduler.timeout);

subject.onNext('a');
subject.onNext('b');
subject.onNext('c');

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

// => Next: b
// => Next: c

subject.onNext('d');
// => Next: d
```

### Location

- rx.binding.js

* * *

## _ReplaySubject Instance Methods_ ##

### <a id="rxreplaysubjectprototypedispose"></a>`Rx.ReplaySubject.prototype.dispose()`
<a href="#rxreplaysubjectprototypedispose">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/ReplaySubject.js#L147-L150 "View in source")

Unsubscribe all observers and release resources.

#### Example
```js
var subject = new Rx.ReplaySubject();

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

- rx.binding.js

* * *

### <a id="rxreplaysubjectprototypehasobservers"></a>`Rx.ReplaySubject.prototype.hasObservers()`
<a href="#rxreplaysubjectprototypehasobservers">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/ReplaySubject.js#L71-L73 "View in source")

Indicates whether the subject has observers subscribed to it.

#### Returns
*(Boolean)*: Returns `true` if the Subject has observers, else `false`.

#### Example
```js
var subject = new Rx.ReplaySubject();

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

- rx.binding.js

* * *
