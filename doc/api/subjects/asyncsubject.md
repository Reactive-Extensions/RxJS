# `Rx.AsyncSubject` class #

Represents the result of an asynchronous operation.  The last value before the OnCompleted notification, or the error received through OnError, is sent to all subscribed observers.

This class inherits both from the `Rx.Observable` and `Rx.Observer` classes.

## Usage ##

The follow example shows caching on the last value produced when followed by an onCompleted notification which makes it available to all subscribers.

```js
var subject = new Rx.AsyncSubject();

var i = 0;
var handle = setInterval(function () {
	subject.onNext(i)
	if (++i > 3) {
		subject.onCompleted();
		clearInterval(handle);
	}
}, 500);

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

// => Next: 3
// => Completed
```

### Location

- rx.js

## `AsyncSubject Constructor` ##
- [`constructor`](#rxasyncsubject)

## `AsyncSubject Instance Methods` ##
- [`dispose`](#rxasyncsubjectprototypedispose)
- [`hasObservers`](#rxasyncsubjectprototypehasobservers)

## Inherited Classes ##
- [`Rx.Observable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/core/observable.md)
- [`Rx.Observer`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/core/observer.md)

## _AsyncSubject Constructor_ ##

### <a id="rxasyncsubject"></a>`Rx.AsyncSubject()`
<a href="#rxasyncsubject">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/asyncsubject.js#L33-L42 "View in source")

Creates a subject that can only receive one value and that value is cached for all future observations.

#### Example
```js
var subject = new Rx.AsyncSubject();

subject.onNext(42);
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

// => 42
// => Completed
```

### Location

- rx.js

* * *

## _AsyncSubject Instance Methods_ ##

### <a id="rxasyncsubjectprototypedispose"></a>`Rx.AsyncSubject.prototype.dispose()`
<a href="#rxasyncsubjectprototypedispose">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/asyncsubject.js#L111-L116 "View in source")

Unsubscribe all observers and release resources.

#### Example
```js
var subject = new Rx.AsyncSubject();

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
subject.onCompleted();

// => Next: 42
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

- rx.js

* * *

### <a id="rxasyncsubjectprototypehasobservers"></a>`Rx.AsyncSubject.prototype.hasObservers()`
<a href="#rxasyncsubjectprototypehasobservers">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/asyncsubject.js#L49-L51 "View in source")

Indicates whether the subject has observers subscribed to it.

#### Returns
*(Boolean)*: Returns `true` if the AsyncSubject has observers, else `false`.

#### Example
```js
var subject = new Rx.AsyncSubject();

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

- rx.js

* * *
