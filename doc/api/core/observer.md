# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
# Observer object #

The Observer object provides support for push-style iteration over an observable sequence.

The Observer and Objects interfaces provide a generalized mechanism for push-based notification, also known as the observer design pattern. The Observable object represents the object that sends notifications (the provider); the Observer object represents the class that receives them (the observer).

<!-- div -->

## `Observer Methods`
- [`create`](#rxobservercreateonnext-onerror-oncompleted)
- [`fromNotifier`](#rxobserverfromotifierhandler)

## `Observer Instance Methods`
- [`asObserver`](#rxobserverprototypeasobserver)
- [`checked`](#rxobserverprototypechecked)
- [`notifyOn`](#rxobserverprototypenotifyonscheduler)
- [`onCompleted`](#rxobserverprototypeoncompleted)
- [`onError`](#rxobserverprototypeonerrorerror)
- [`onNext`](#rxobserverprototypeonnextvalue)
- [`toNotifier`](#rxobserverprototypetonotifier)

## _Observer Methods_ ##

### <a id="rxobservercreateonnext-onerror-oncompleted"></a>`Rx.Observer.create([onNext], [onError], [onCompleted])`
<a href="#rxobservercreateonnext-onerror-oncompleted">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js#L1828-L1833 "View in source") [&#x24C9;][1]

Creates an observer from the specified `onNext`, `onError`, and `onCompleted` actions.

#### Arguments
1. `[onNext]` *(Function)*: Observer's onNext action implementation.
2. `[onError]` *(Function)*: Observer's onError action implementation.
3. `[onCompleted]` *(Function)*: Observer's onCompleted action implementation.

#### Returns
*(Observer)*: The observer object implemented using the given actions.

#### Example
```js
var source = Rx.Observable.return(42);

var observer = Rx.Observer.create(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    }
);

var subscription = source.subscribe(observer);

// => Next: 42
// => Completed
```

### Location

- rx.js

* * *

### <a id="rxobserverfromotifierhandler"></a>`Rx.Observer.fromNotifier(handler, [thisArg])`
<a href="#rxobserverfromotifierhandler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js#L1843-L1851 "View in source") [&#x24C9;][1]

Creates an observer from a notification callback.

#### Arguments
1. `handler` *(Function)*: Function that handles a notification.
2. `[thisArg]` *(`Any`)*: Object to use as `this` when executing `handler`.

#### Returns
*(Observer)*: The observer object that invokes the specified handler using a notification corresponding to each message it receives.

#### Example
```js
function handler(n) {
	// Handle next calls
	if (n.kind === 'N') {
		console.log('Next: ' + n.value);
	}

	// Handle error calls
	if (n.kind === 'E') {
		console.log('Error: ' + n.exception);
	}

	// Handle completed
	if (n.kind === 'C') {
		console.log('Completed')
	}
}

Rx.Observer.fromNotifier(handler).onNext(42);
// => Next: 42

Rx.Observer.fromNotifier(handler).onError(new Error('error!!!'));
// => Error: Error: error!!!

Rx.Observer.fromNotifier(handler).onCompleted();
// => false
```

### Location

- rx.js

* * *

## _Observer Instance Methods_ ##

### <a id="rxobserverprototypeasobserver"></a>`Rx.Observer.prototype.asObserver()`
<a href="#rxobserverprototypeasobserver">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js#L1810-L1812 "View in source") [&#x24C9;][1]

Hides the identity of an observer.

#### Returns
*(Observer)*: An observer that hides the identity of the specified observer.

#### Example
```js
function SampleObserver () {
    Rx.Observer.call(this);
    this.isStopped = false;
}

SampleObserver.prototype = Object.create(Rx.Observer.prototype);
SampleObserver.prototype.constructor = SampleObserver;

Object.defineProperties(SampleObserver.prototype, {
    onNext: {
        value: function (x) {
            if (!this.isStopped) {
                console.log('Next: ' + x);
            }
        }
    },
    onError: {
        value: function (err) {
            if (!this.isStopped) {
                this.isStopped = true;
                console.log('Error: ' + err);
            }
        }
    },
    onCompleted: {
        value: function () {
            if (!this.isStopped) {
                this.isStopped = true;
                console.log('Completed');
            }
        }
    }
});

var sampleObserver = new SampleObserver();

var source = sampleObserver.asObserver();

console.log(source === sampleObserver);
// => false
```

### Location

- rx.js

* * *

### <a id="rxobserverprototypechecked"></a>`Rx.Observer.prototype.checked()`
<a href="#rxobserverprototypechecked">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js#L1819 "View in source") [&#x24C9;][1]

Checks access to the observer for grammar violations. This includes checking for multiple `onError` or `onCompleted` calls, as well as reentrancy in any of the observer methods.

If a violation is detected, an Error is thrown from the offending observer method call.

#### Returns
*(Observer)*: An observer that checks callbacks invocations against the observer grammar and, if the checks pass, forwards those to the specified observer.

#### Example
```js
var observer = Rx.Observer.create(
    function (x) {
        console.log('Next: ' + x)
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    }
);

var checked = observer.checked();

checked.onNext(42);
// => Next: 42

checked.onCompleted();
// => Completed

// Throws Error('Observer completed')
checked.onNext(42);
```

### Location

- rx.js

* * *

### <a id="rxobserverprototypenotifyonscheduler"></a>`Rx.Observer.prototype.notifyOn(scheduler)`
<a href="#rxobserverprototypenotifyonscheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js#L1858-1860 "View in source") [&#x24C9;][1]

Schedules the invocation of observer methods on the given scheduler.

#### Arguments
1. `scheduler` *(Scheduler)*: Scheduler to schedule observer messages on.

#### Returns
*(Observer)*: Observer whose messages are scheduled on the given scheduler.

#### Example
```js
var observer = Rx.Observer.create(
    function (x) {
        console.log('Next: ' + x)
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    }
);

// Notify on timeout scheduler
var timeoutObserver = observer.notifyOn(Rx.Scheduler.timeout);

timeoutObserver.onNext(42);
// => Next: 42
```

### Location

- rx.js

* * *

### <a id="rxobserverprototypeoncompleted"></a>`Rx.Observer.prototype.onCompleted()`
<a href="#rxobserverprototypeoncompleted">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js#L1899-L1904 "View in source") [&#x24C9;][1]

Notifies the observer of the end of the sequence.

#### Example
```js
var observer = Rx.Observer.create(
    function (x) {
        console.log('Next: ' + x)
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    }
);

observer.onCompleted();
// => Completed
```

### Location

- rx.js

* * *

### <a id="rxobserverprototypeonerrorerror"></a>`Rx.Observer.prototype.onError(error)`
<a href="#rxobserverprototypeonerrorerror">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js#L1889-L1894 "View in source") [&#x24C9;][1]

Notifies the observer that an exception has occurred.

#### Arguments
1. `error` *(Any)*: The error that has occurred.

#### Example
```js
var observer = Rx.Observer.create(
    function (x) {
        console.log('Next: ' + x)
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    }
);

observer.onError(new Error('error!!'));
// => Error: Error: error!!
```

### Location

- rx.js

* * *

### <a id="rxobserverprototypeonnextvalue"></a>`Rx.Observer.prototype.onNext(value)`
<a href="#rxobserverprototypeonnextvalue">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js#L1881-L1883 "View in source") [&#x24C9;][1]

Notifies the observer of a new element in the sequence.

#### Arguments
1. `value` *(Any)*: Next element in the sequence.

#### Example
```js
var observer = Rx.Observer.create(
    function (x) {
        console.log('Next: ' + x)
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    }
);

observer.onNext(42);
// => Next: 42
```

### Location

- rx.js

* * *

### <a id="rxobserverprototypetonotifier"></a>`Rx.Observer.prototype.toNotifier()`
<a href="#rxobserverprototypetonotifier">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js#L1801-L1804 "View in source") [&#x24C9;][1]

Creates a notification callback from an observer.

#### Returns
*(Function)*: The function that forwards its input notification to the underlying observer.

#### Example
```js
var observer = Rx.Observer.create(
    function (x) {
        console.log('Next: ' + x)
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    }
);

var notifier = observer.toNotifier();

// Invoke with onNext
notifier(Rx.Notification.createOnNext(42));
// => Next: 42

// Invoke with onCompleted
notifier(Rx.Notification.createOnCompleted());
// => Completed
```

### Location

- rx.js

* * *
