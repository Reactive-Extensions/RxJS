# Exploring The Major Concepts in RxJS #

This topic describes the major Reactive Extensions for JavaScript (Rx) objects used to represent observable sequences and subscribe to them.

The `Observable` / `Observer` objects are available in the core distribution of RxJS.

## `Observable` / `Observer` ##

Rx exposes asynchronous and event-based data sources as push-based, observable sequences abstracted by the [`Observable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md) object in the core distribution of RxJS. It represents a data source that can be observed, meaning that it can send data to anyone who is interested.

As described in [What is RxJS](what.md), the other half of the push model is represented by the [`Observer`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observer.md) object, which represents an observer who registers an interest through a subscription. Items are subsequently handed to the observer from the observable sequence to which it subscribes.

In order to receive notifications from an observable collection, you use the [`subscribe`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypesubscribeobserver--onnext-onerror-oncompleted) method of `Observable` to hand it an `Observer` object. In return for this observer, the [`subscribe`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypesubscribeobserver--onnext-onerror-oncompleted) method returns a `Disposable` object that acts as a handle for the subscription. This allows you to clean up the subscription after you are done.  Calling `dispose` on this object detaches the observer from the source so that notifications are no longer delivered. As you can infer, in RxJS you do not need to explicitly unsubscribe from an event as in the common JavaScript event model.

Observers support three publication events, reflected by the object's methods. The [`onNext`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observer.md#rxobserverprototypeonnextvalue) can be called zero or more times, when the observable data source has data available. For example, an observable data source used for mouse move events can send out an event object every time the mouse has moved. The other two methods are used to indicate completion or errors.

The following lists the `Observable` / `Observer` objects in addition to the `Disposable` object.

```js
/**
 * Defines a method to release allocated resources.
 */
function Disposable() { }

/**
 * Performs application-defined tasks associated with freeing, releasing, or resetting resources.
 */
Disposable.prototype.dispose = function () { ... }

/**
 * Defines a provider for push-based notification.
 */
function Observable() { }

/**
 * Notifies the provider that an observer is to receive notifications.
 *
 * @param {Observer} observer The object that is to receive notifications.
 * @returns {Disposable} A reference to disposable that allows observers to stop receiving notifications before the provider has finished sending them.
 */
Observable.prototype.subscribe = function (observer) { ... }

/**
 * Provides a mechanism for receiving push-based notifications.
 */
function Observer() { }

/**
 * Provides the observer with new data.
 *
 * @param {Any} value The current notification information.
 */
Observer.prototype.onNext = function (value) { ... };

/**
 * Notifies the observer that the provider has experienced an error condition.
 *
 * @param {Error} error An object that provides additional information about the error.
 */
Observer.prototype.onError = function (error) { ... };

/**
 * Notifies the observer that the provider has finished sending push-based notifications.
 */
Observer.prototype.onCompleted = function () { ... };
```

RxJS also provides `subscribe` capabilities so that you can avoid implementing the `Observer` object yourself. For each publication event (`onNext`, `onError`, `onCompleted`) of an observable sequence, you can specify a function that will be invoked, as shown in the following example. If you do not specify an action for an event, the default behavior will occur.

```js
// Creates an observable sequence of 5 integers, starting from 1
var source = Rx.Observable.range(1, 5);

// Prints out each item
var subscription = source.subscribe(
	function (x) { console.log('onNext: ' + x); },
	function (e) { console.log('onError: ' + e.message); },
	function () { console.log('onCompleted'); });

// => onNext: 1
// => onNext: 2
// => onNext: 3
// => onNext: 4
// => onNext: 5
// => onCompleted
```

You can treat the observable sequence (such as a sequence of mouse-over events) as if it were a normal collection. Thus you can write queries over the collection to do things like filtering, grouping, composing, etc. To make observable sequences more useful, the RxJS libraries provide many factory operators so that you do not need to implement any of these on your own. This will be covered in the [Querying Observable Sequences](querying.md) topic.

### Caution:
You do not need to implement the Observable/Observer objects yourself.  Rx provides internal implementations of these interfaces for you and exposes them through various extension methods provided by the Observable and Observer types.  See the [Creating and Querying Observable Sequences](creatingquerying.md) topic for more information.

### See Also

Concepts
- [Querying Observable Sequences](querying.md)

Other Resources
- [Creating and Querying Observable Sequences](creatingquerying.md)
