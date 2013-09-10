# Observer object #

The Observer object provides support for push-style iteration over an observable sequence.

The Observer and Objects interfaces provide a generalized mechanism for push-based notification, also known as the observer design pattern. The Observable object represents the object that sends notifications (the provider); the Observer object represents the class that receives them (the observer). 

<!-- div -->

## `Observer Methods`
- [`create`](#rxobservercreateonnext-onerror-oncompleted)
- [`fromNotifier`](#rxobserverfromotifierhandler)

## `Observer Instance Methods`
- [`asObserver`](#asObserver)
- [`checked`](#checked)
- [`notifyOn`](#notifyOn)
- [`onCompleted`](#onCompleted)
- [`onError`](#onError)
- [`onNext`](#onNext)
- [`toNotifier`](#toNotifier)

## _Observer Methods_ ##

### <a id="rxobservercreateonnext-onerror-oncompleted"></a>`Rx.Observer.create([onNext], [onError], [onCompleted])`
<a href="#rxobservercreateonnext-onerror-oncompleted">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2862-L2872 "View in source") [&#x24C9;][1]

Creates an observer from the specified `onNext`, `onError`, and `onCompleted` actions.

#### Arguments
1. `[onNext]` *(Function)*: Observer's onNext action implementation.
1. `[onError]` *(Function)*: Observer's onError action implementation.
1. `[onCompleted]` *(Function)*: Observer's onCompleted action implementation.

#### Returns
*(Observer)*: The observer object implemented using the given actions.

#### Example
```js
var source = Rx.Observable.return(42);

var observer = Rx.Observable.create(
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

### <a id="rxobserverfromotifierhandler"></a>`Rx.Observer.fromNotifier(handler)`
<a href="#rxobserverfromotifierhandler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2862-L2872 "View in source") [&#x24C9;][1]

Creates an observer from a notification callback.

#### Arguments
1. `handler` *(Function)*: Function that handles a notification.

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

Observer.fromNotifier(next).onNext(42);

// => Next: 42

Observer.fromNotifier(error).onError(new Error('error!!!'));

// => Error: Error: error!!!

Observer.fromNotifier(completed).onCompleted();

// => false
```

### Location

- rx.js

* * *

## _Observer Instance Methods_ ##
