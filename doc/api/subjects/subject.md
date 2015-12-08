# `Rx.Subject` class #

Represents an object that is both an observable sequence as well as an observer. Each notification is broadcasted to all subscribed observers.

This class inherits both from the `Rx.Observable` and `Rx.Observer` classes.

## Usage ##

The follow example shows the basic usage of an Rx.Subject.

```js
var subject = new Rx.Subject();

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

subject.onNext(56);

// => Next: 56

subject.onCompleted();

// => Completed
```

### Location

- rx.js

## `Subject Constructor` ##
- [`constructor`](#rxsubject)

## `Subject Class Methods` ##
- [`create`](#rxsubjectcreateobserver-observable)

## `Subject Instance Methods` ##
- [`dispose`](#rxsubjectprototypedispose)
- [`hasObservers`](#rxsubjectprototypehasobservers)

## Inherited Classes ##
- [`Rx.Observable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)
- [`Rx.Observer`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observer.md)

## _Subject Constructor_ ##

### <a id="rxsubject"></a>`Rx.Subject()`
<a href="#rxsubject">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/subject.js#L26-L31 "View in source")

Creates a subject.

#### Example
```js
var subject = new Rx.Subject();

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

subject.onNext(42);
// => Next: 42

subject.onCompleted();
// => Completed
```

### Location

- rx.js

* * *

## _Subject Class Methods_ ##

### <a id="rxsubjectcreateobserver-observable"></a>`Rx.Subject.create(observer, observable)`
<a href="#rxsubjectcreateobserver-observable">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/subject.js#L101-L103 "View in source")

Creates a subject from the specified observer and observable.

#### Arguments
1. `observer` *(Observer)*: The observer used to send messages to the subject.
2. `observable` *(Observable)*: The observable used to subscribe to messages sent from the subject.

#### Returns
*(Subject)*: Subject implemented using the given observer and observable.

#### Example

```js
/* Using a Web Worker to send and receive data via an Rx.Subject */

/* worker.js */

self.onmessage = function(e) {
    self.postMessage(e.data);
};

/* client.js */
var worker = new Worker('worker.js');

// Create observer to handle sending messages
var observer = Rx.Observer.create(
    function (data) {
        worker.postMessage(data);
    });

// Create observable to handle the messages
var observable = Rx.Observable.create(function (obs) {

    worker.onmessage = function (data) {
        obs.onNext(data);
    };

    worker.onerror = function (err) {
        obs.onError(err);
    };

    return function () {
        worker.close();
    };
});

var subject = Rx.Subject.create(observer, observable);

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

subject.onNext(42);
// => Next: 42

```

### Location

- rx.js

* * *

## _Subject Instance Methods_ ##

### <a id="rxsubjectprototypedispose"></a>`Rx.Subject.prototype.dispose()`
<a href="#rxsubjectprototypedispose">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/subject.js#L89-L92 "View in source")

Unsubscribe all observers and release resources.

#### Example
```js
var subject = new Rx.Subject();

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

- rx.js

* * *

### <a id="rxsubjectprototypehasobservers"></a>`Rx.Subject.prototype.hasObservers()`
<a href="#rxsubjectprototypehasobservers">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/subject.js#L38-L40 "View in source")

Indicates whether the subject has observers subscribed to it.

#### Returns
*(Boolean)*: Returns `true` if the Subject has observers, else `false`.

#### Example
```js
var subject = new Rx.Subject();

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
