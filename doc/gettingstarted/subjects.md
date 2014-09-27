# Using Subjects #

The [`Subject`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/subject.md) class inherits both [`Observable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md) and [`Observer`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observer.md), in the sense that it is both an observer and an observable. You can use a subject to subscribe all the observers, and then subscribe the subject to a backend data source. In this way, the subject can act as a proxy for a group of subscribers and a source. You can use subjects to implement a custom observable with caching, buffering and time shifting. In addition, you can use subjects to broadcast data to multiple subscribers.

By default, subjects do not perform any synchronization across threads. They do not take a scheduler but rather assume that all serialization and grammatical correctness are handled by the caller of the subject.  A subject simply broadcasts to all subscribed observers in the thread-safe list of subscribers. Doing so has the advantage of reducing overhead and improving performance.

## Using Subjects ##

In the following example, we create a subject, subscribe to that subject and then use the same subject to publish values to the observer. By doing so, we combine the publication and subscription into the same source.

In addition to taking an `Observer`, the [`subscribe`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypesubscribeobserver--onnext-onerror-oncompleted) method can also take a function for onNext, which means that the action will be executed every time an item is published. In our sample, whenever onNext is invoked, the item will be written to the console.

```js
var subject = new Rx.Subject();

var subscription = subject.subscribe(
	function (x) { console.log('onNext: ' + x); },
	function (e) { console.log('onError: ' + e.message); },
	function () { console.log('onCompleted'); });

subject.onNext(1);
// => onNext: 1

subject.onNext(2);
// => onNext: 2

subject.onCompleted();
// => onCompleted

subscription.dispose();

```

The following example illustrates the proxy and broadcast nature of a `Subject`. We first create a source sequence which produces an integer every 1 second. We then create a `Subject`, and pass it as an observer to the source so that it will receive all the values pushed out by this source sequence. After that, we create another two subscriptions, this time with the subject as the source. The `subSubject1` and `subSubject2` subscriptions will then receive any value passed down (from the source) by the `Subject`.

```js
// Every second
var source = Rx.Observable.interval(1000);

var subject = new Rx.Subject();

var subSource = source.subscribe(subject);

var subSubject1 = subject.subscribe(
	function (x) { console.log('Value published to observer #1: ' + x); },
	function (e) { console.log('onError: ' + e.message); },
	function () { console.log('onCompleted'); });

var subSubject2 = subject.subscribe(
	function (x) { console.log('Value published to observer #2: ' + x); },
	function (e) { console.log('onError: ' + e.message); },
	function () { console.log('onCompleted'); });

setTimeout(function () {
	// Clean up
	subject.onCompleted();
	subSubject1.dispose();
	subSubject2.dispose();
}, 5000);

// => Value published to observer #1: 0
// => Value published to observer #2: 0
// => Value published to observer #1: 1
// => Value published to observer #2: 1
// => Value published to observer #1: 2
// => Value published to observer #2: 2
// => Value published to observer #1: 3
// => Value published to observer #2: 3
// => onCompleted
// => onCompleted

```

## Different types of Subjects ##

The `Subject` object in the RxJS library is a basic implementation, but you can create your own using  the [`Subject.create`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/subject.md#rxsubjectcreateobserver-observable) method. There are other implementations of Subjects that offer different functionalities. All of these types store some (or all of) values pushed to them via onNext, and broadcast it back to its observers. In this way, they convert a Cold Observable into a Hot one. This means that if you Subscribe to any of these more than once (i.e. subscribe -> unsubscribe -> subscribe again), you will see at least one of the same value again. For more information on hot and cold observables, see the last section of the [Creating and Subscribing to Simple Observable Sequences](creating.md) topic.

[`ReplaySubject`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/replaysubject.md) stores all the values that it has published. Therefore, when you subscribe to it, you automatically receive an entire history of values that it has published, even though your subscription might have come in after certain values have been pushed out. [`BehaviourSubject`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/behaviorsubject.md) is similar to `ReplaySubject`, except that it only stored the last value it published. `BehaviourSubject` also requires a default value upon initialization. This value is sent to observers when no other value has been received by the subject yet. This means that all subscribers will receive a value instantly on `subscribe`, unless the `Subject` has already completed. [`AsyncSubject`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/asyncsubject.md) is similar to the Replay and Behavior subjects, however it will only store the last value, and only publish it when the sequence is completed. You can use the `AsyncSubject` type for situations when the source observable is hot and might complete before any observer can subscribe to it. In this case, `AsyncSubject` can still provide the last value and publish it to any future subscribers.
