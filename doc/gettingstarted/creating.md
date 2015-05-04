# Creating and Subscribing to Simple Observable Sequences #

You do not need to implement the `Observable` class manually to create an observable sequence. Similarly, you do not need to implement `Observer` either to subscribe to a sequence. By installing the Reactive Extension libraries, you can take advantage of the `Observable` type which provides many operators for you to create a simple sequence with zero, one or more elements. In addition, RxJS provides an overloaded `subscribe` method which allows you to pass in `onNext`, `onError` and `onCompleted` function handlers.

## Creating a sequence from scratch ##

Before getting into many operators, let's look at how to create an `Observable` from scratch using the [`Rx.Observable.create`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/create.md) method.

First, we need to ensure we reference the core `rx.js` file.

```html
<script src="rx.js"></script>
```

Or if we're using [Node.js](http://node.js), we can reference it as such:

```js
var Rx = require('rx');
```

In this example, we will simply yield a single value of 42 and then mark it as completed.  The return value is completely optional if no cleanup is required.

```js
var source = Rx.Observable.create(function (observer) {
  // Yield a single value and complete
  observer.onNext(42);
  observer.onCompleted();

  // Any cleanup logic might go here
  return function () {
    console.log('disposed');
  }
});

var subscription = source.subscribe(
  function (x) { console.log('onNext: %s', x); },
  function (e) { console.log('onError: %s', e); },
  function () { console.log('onCompleted'); });

// => onNext: 42
// => onCompleted

subscription.dispose();
// => disposed
```

For most operations, this is completely overkill, but shows the very basics of how most RxJS operators work.

## Creating and subscribing to a simple sequence ##

The following sample uses the [`range`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/range.md) operator of the `Observable` type to create a simple observable collection of numbers. The observer subscribes to this collection using the Subscribe method of the Observable class, and provides actions that are delegates which handle `onNext`, `onError` and `onCompleted`.  In our example, it creates a sequence of integers that starts with x and produces y sequential numbers afterwards.

As soon as the subscription happens, the values are sent to the observer. The `onNext` function then prints out the values.

```js
// Creates an observable sequence of 5 integers, starting from 1
var source = Rx.Observable.range(1, 5);

// Prints out each item
var subscription = source.subscribe(
  function (x) { console.log('onNext: %s', x); },
  function (e) { console.log('onError: %s', e); },
  function () { console.log('onCompleted'); });

// => onNext: 1
// => onNext: 2
// => onNext: 3
// => onNext: 4
// => onNext: 5
// => onCompleted
```

When an observer subscribes to an observable sequence, the `subscribe` method may be using asynchronous behavior behind the scenes depending on the operator. Therefore, the `subscribe` call is asynchronous in that the caller is not blocked until the observation of the sequence completes. This will be covered in more details in the [Using Schedulers](schedulers.md) topic.

Notice that the [`subscribe`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/susbcribe.md) method returns a `Disposable`, so that you can unsubscribe to a sequence and dispose of it easily. When you invoke the `dispose` method on the observable sequence, the observer will stop listening to the observable for data.  Normally, you do not need to explicitly call `dispose` unless you need to unsubscribe early, or when the source observable sequence has a longer life span than the observer. Subscriptions in Rx are designed for fire-and-forget scenarios without the usage of a finalizer. Note that the default behavior of the Observable operators is to dispose of the subscription as soon as possible (i.e, when an `onCompleted` or `onError` messages is published). For example, the code will subscribe x to both sequences a and b. If a throws an error, x will immediately be unsubscribed from b.

```js
var x = Rx.Observable.zip(a, b, function (a1, b1) { return a1 + b1; }).subscribe();
```

You can also tweak the code sample to use the Create operator of the Observer type, which creates and returns an observer from specified OnNext, OnError, and OnCompleted action delegates. You can then pass this observer to the Subscribe method of the Observable type. The following sample shows how to do this.

```js
// Creates an observable sequence of 5 integers, starting from 1
var source = Rx.Observable.range(1, 5);

// Create observer
var observer = Rx.Observer.create(
  function (x) { console.log('onNext: %s', x); },
  function (e) { console.log('onError: %s', e); },
  function () { console.log('onCompleted'); });

// Prints out each item
var subscription = source.subscribe(observer);

// => onNext: 1
// => onNext: 2
// => onNext: 3
// => onNext: 4
// => onNext: 5
// => onCompleted
```

In addition to creating an observable sequence from scratch, you can convert existing Arrays,  events, callbacks and promises into observable sequences. The other topics in this section will show you how to do this.

Notice that this topic only shows you a few operators that can create an observable sequence from scratch. To learn more about other LINQ operators, see Querying Observable Sequences using LINQ Operators.

## Using a timer ##

The following sample uses the [`timer`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/timer.md) operator to create a sequence. The sequence will push out the first value after 5 second has elapsed, then it will push out subsequent values every 1 second. For illustration purpose, we chain the [`timestamp`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/timestamp.md) operator to the query so that each value pushed out will be appended by the time when it is published. By doing so, when we subscribe to this source sequence, we can receive both its value and timestamp.

First, we need to ensure we reference the proper files if in the browser.  Note that the RxJS NPM Package already includes all operators by default.

```html
<script src="rx.js"></script>
<script src="rx.time.js"></script>
```

Now on to our example

```js
console.log('Current time: ' + Date.now());

var source = Rx.Observable.timer(
  5000, /* 5 seconds */
  1000 /* 1 second */)
   .timestamp();

var subscription = source.subscribe(
  function (x) {
    console.log(x.value + ': ' + x.timestamp);
  });

/* Output may be similar to this */
// Current time: 1382560697820
// 0: 1382560702820
// 1: 1382560703820
// 2: 1382560704820
```

By using the `timestamp` operator, we have verified that the first item is indeed pushed out 5 seconds after the sequence has started, and each item is published 1 second later.

## Converting Arrays and Iterables to an Observable Sequence ##

Using the [`Rx.Observable.from`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/from.md) operator, you can convert an array to observable sequence.

```js
var array = [1,2,3,4,5];

// Converts an array to an observable sequence
var source = Rx.Observable.from(array);

// Prints out each item
var subscription = source.subscribe(
  function (x) { console.log('onNext: %s', x); },
  function (e) { console.log('onError: %s', e); },
  function () { console.log('onCompleted'); });

// => onNext: 1
// => onNext: 2
// => onNext: 3
// => onNext: 4
// => onNext: 5
// => onCompleted
```

You can also convert array-like objects such as objects with a length property and indexed with numbers.  In this case, we'll simply have an object with a length of 5.
```js
var arrayLike = { length: 5 };

// Converts an array to an observable sequence
var source = Rx.Observable.from(arrayLike, function (v, k) { return k; });

// Prints out each item
var subscription = source.subscribe(
  function (x) { console.log('onNext: %s', x); },
  function (e) { console.log('onError: %s', e); },
  function () { console.log('onCompleted'); });

// => onNext: 1
// => onNext: 2
// => onNext: 3
// => onNext: 4
// => onNext: 5
// => onCompleted

```


In addition, we can also use ES6 Iterable objects such as `Map` and `Set` using `from` to an observable sequence.  In this example, we can take a `Set` and convert it to an observable sequence.

```js
var set = new Set([1,2,3,4,5]);

// Converts a Set to an observable sequence
var source = Rx.Observable.from(set);

// Prints out each item
var subscription = source.subscribe(
  function (x) { console.log('onNext: %s', x); },
  function (e) { console.log('onError: %s', e); },
  function () { console.log('onCompleted'); });

// => onNext: 1
// => onNext: 2
// => onNext: 3
// => onNext: 4
// => onNext: 5
// => onCompleted
```

We can also do a `Map` as well by applying the same technique.

```js
var set = new Map([['key1', 1], ['key2', 2]]);

// Converts a Set to an observable sequence
var source = Rx.Observable.from(set);

// Prints out each item
var subscription = source.subscribe(
  function (x) { console.log('onNext: %s', x); },
  function (e) { console.log('onError: %s', e); },
  function () { console.log('onCompleted'); });

// => onNext: key1, 1
// => onNext: key2, 2
// => onCompleted
```

The `from` method can also support ES6 generators which may already be in your browser, or coming to a browser near you.  This allows us to do such things as Fibonacci sequences and so forth and convert them to an observable sequence.

```js
function* fibonacci () {
  var fn1 = 1;
  var fn2 = 1;
  while (1){
    var current = fn2;
    fn2 = fn1;
    fn1 = fn1 + current;
    yield current;
  }
}

// Converts a generator to an observable sequence
var source = Rx.Observable.from(fibonacci()).take(5);

// Prints out each item
var subscription = source.subscribe(
  function (x) { console.log('onNext: %s', x); },
  function (e) { console.log('onError: %s', e); },
  function () { console.log('onCompleted'); });

// => onNext: 1
// => onNext: 1
// => onNext: 2
// => onNext: 3
// => onNext: 5
// => onCompleted
```

## Cold vs. Hot Observables ##

Cold observables start running upon subscription, i.e., the observable sequence only starts pushing values to the observers when Subscribe is called. Values are also not shared among subscribers. This is different from hot observables such as mouse move events or stock tickers which are already producing values even before a subscription is active. When an observer subscribes to a hot observable sequence, it will get the current value in the stream. The hot observable sequence is shared among all subscribers, and each subscriber is pushed the next value in the sequence. For example, even if no one has subscribed to a particular stock ticker, the ticker will continue to update its value based on market movement. When a subscriber registers interest in this ticker, it will automatically get the latest tick.

The following example demonstrates a cold observable sequence. In this example, we use the Interval operator to create a simple observable sequence of numbers pumped out at specific intervals, in this case, every 1 second.

Two observers then subscribe to this sequence and print out its values. You will notice that the sequence is reset for each subscriber, in which the second subscription will restart the sequence from the first value.

First, we need to ensure we reference the proper files if in the browser.  Note that the RxJS NPM Package already includes all operators by default.

```html
<script src="rx.lite.js"></script>
```

And now to the example.

```js
var source = Rx.Observable.interval(1000);

var subscription1 = source.subscribe(
  function (x) { console.log('Observer 1: onNext: ' + x); },
  function (e) { console.log('Observer 1: onError: ' + e.message); },
  function () { console.log('Observer 1: onCompleted'); });

var subscription2 = source.subscribe(
  function (x) { console.log('Observer 2: onNext: ' + x); },
  function (e) { console.log('Observer 2: onError: ' + e.message); },
  function () { console.log('Observer 2: onCompleted'); });

setTimeout(function () {
  subscription1.dispose();
  subscription2.dispose();
}, 5000);

// => Observer 1: onNext: 0
// => Observer 2: onNext: 0
// => Observer 1: onNext: 1
// => Observer 2: onNext: 1
// => Observer 1: onNext: 2
// => Observer 2: onNext: 2
// => Observer 1: onNext: 3
// => Observer 2: onNext: 3
```

In the following example, we convert the previous cold observable sequence source to a hot one using the [`publish`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/publish.md) operator, which returns a `ConnectableObservable` instance we name `hot`. The [`publish`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/publish.md) operator provides a mechanism to share subscriptions by broadcasting a single subscription to multiple subscribers. The `hot` variable acts as a proxy by subscribing to `source` and, as it receives values from `source`, pushing them to its own subscribers. To establish a subscription to the backing source and start receiving values, we use the [`ConnectableObservable.prototype.connect`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/connect.md) method. Since `ConnectableObservable` inherits `Observable`, we can use `subscribe` to subscribe to this hot sequence even before it starts running. Notice that in the example, the hot sequence has not been started when `subscription1` subscribes to it. Therefore, no value is pushed to the subscriber. After calling Connect, values are then pushed to `subscription1`. After a delay of 3 seconds, `subscription2` subscribes to `hot` and starts receiving the values immediately from the current position (3 in this case) until the end. The output looks like this:

```
// => Current time: 1382562433256
// => Current Time after 1st subscription: 1382562433260
// => Current Time after connect: 1382562436261
// => Observer 1: onNext: 0
// => Observer 1: onNext: 1
// => Current Time after 2nd subscription: 1382562439262
// => Observer 1: onNext: 2
// => Observer 2: onNext: 2
// => Observer 1: onNext: 3
// => Observer 2: onNext: 3
// => Observer 1: onNext: 4
// => Observer 2: onNext: 4
```

First, we need to ensure we reference the proper files if in the browser.  Note that the RxJS NPM Package already includes all operators by default.

```html
<script src="rx.lite.js"></script>
```

Now onto the example!

```js
console.log('Current time: ' + Date.now());

// Creates a sequence
var source = Rx.Observable.interval(1000);

// Convert the sequence into a hot sequence
var hot = source.publish();

// No value is pushed to 1st subscription at this point
var subscription1 = hot.subscribe(
  function (x) { console.log('Observer 1: onNext: %s', x); },
  function (e) { console.log('Observer 1: onError: %s', e); },
  function () { console.log('Observer 1: onCompleted'); });

console.log('Current Time after 1st subscription: ' + Date.now());

// Idle for 3 seconds
setTimeout(function () {

  // Hot is connected to source and starts pushing value to subscribers
  hot.connect();

  console.log('Current Time after connect: ' + Date.now());

  // Idle for another 3 seconds
  setTimeout(function () {

    console.log('Current Time after 2nd subscription: ' + Date.now());

    var subscription2 = hot.subscribe(
      function (x) { console.log('Observer 2: onNext: %s', x); },
      function (e) { console.log('Observer 2: onError: %s', e); },
      function () { console.log('Observer 2: onCompleted'); });

  }, 3000);
}, 3000);
```

**Analogies** 

It helps to think of cold and hot Observables as movies or performances that one can watch ("subscribe").

- Cold Observables: movies.
- Hot Observables: live performances.
- Hot Observables replayed: live performances recorded on video.

Whenever you watch a movie, your run of the movie is independent of anyone else's run, even though all movie watchers see the same effects. On the other hand, a live performance is shared to multiple viewers. If you arrive late to a live performance, you will simply miss some of it. However, if it was recorded on video (in RxJS this would happen with a BehaviorSubject or a ReplaySubject), you can watch a "movie" of the live performance. A [`.publish().refCount()`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/refcount.md) live performance is one where the artists quit playing when no one is watching, and start playing again when there is at least one person in the audience. 
