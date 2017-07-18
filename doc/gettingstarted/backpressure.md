# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
# Backpressure #

When it comes to streaming data, streams can be overly chatty in which the consumer cannot keep up with the producer.  To that end, we need mechanisms to control the source so that the consumer does not get overwhelmed.  These mechanisms can come in either the form of lossy or loss-less operations, each of which depends on the requirements.  For example, if you miss a few mouse movements, it may not be a problem, however, if you miss a few bank transactions, that could be a definite problem.  This section covers which techniques you can use to handle backpressure in either lossy or loss-less ways.

For example, imagine using the [`zip`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/zip.md) operator to zip together two infinite Observables, one of which emits items twice as frequently as the other. A naive implementation of the zip operator would have to maintain an ever-expanding buffer of items emitted by the faster Observable to eventually combine with items emitted by the slower one. This could cause RxJS to seize an unwieldy amount of system resources.

## Hot and Cold Observables and Multicast ##

A cold Observable emits a particular sequence of items, but can begin emitting this sequence when its Observer finds it to be convenient, and at whatever rate the Observer desires, without disrupting the integrity of the sequence. For example if you convert a iterable such as array, Map, Set, or generator into an Observable, that Observable will emit the same sequence of items no matter when it is later subscribed to or how frequently those items are observed. Examples of items emitted by a cold Observable might include the results of a database query, file retrieval, or web request.

A hot Observable begins generating items to emit immediately when it is created. Subscribers typically begin observing the sequence of items emitted by a hot Observable from somewhere in the middle of the sequence, beginning with the first item emitted by the Observable subsequent to the establishment of the subscription. Such an Observable emits items at its own pace, and it is up to its observers to keep up. Examples of items emitted by a hot Observable might include mouse & keyboard events, system events, or stock prices.

When a cold Observable is multi-cast (when it is converted into a `ConnectableObservable` and its [`connect`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/connect.md) method is called), it effectively becomes hot and for the purposes of backpressure and flow-control it should be treated as a hot Observable.

Cold Observables are ideal subjects for the reactive pull model of backpressure described below. Hot observables are typically not designed to cope well with a reactive pull model, and are better candidates for some of the other flow control strategies discussed on this page, such as the use of the `pausableBuffered` or `pausable` operators, throttling, buffers, or windows.

## Lossy Backpressure ##

There are a number of ways that an observable sequence can be controlled so that the consumer does not get overwhelmed through lossy operations, meaning that packets will be dropped in between pause and resume actions.

### Debounce ###

The first technique for lossy backpressure is called [`debounce`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/debounce.md) which only emits an item from the source Observable after a particular timespan has passed without the Observable emitting any other items.  This is useful in scenarios such as if the user is typing too fast and you do not want to yield every keystroke, and instead wait half a second after the person stopped typing before yielding the value.

```js
var debounced = Rx.Observable.fromEvent(input, 'keyup')
  .map(function (e) { return e.target.value; })
  .debounce(500 /* ms */);

debounced.subscribeOnNext(function (value) {
  console.log('Input value: %s', value);
});
```

### Throttling ###

Another technique to deal with an observable sequence which is producing too much for the consumer is through throttling with the use of the [`throttle`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/throttle.md) method which emits the first items emitted by an Observable within periodic time intervals.  Throttling can be especially useful for rate limiting execution of handlers on events like resize and scroll.

```js
var throttled = Rx.Observable.fromEvent(window, 'resize')
  .throttle(250 /* ms */);

throttled.subscribeOnNext(function (e) {
  console.log('Window inner height: %d', window.innerHeight);
  console.log('Window inner width: %d', window.innerWidth);
});
```

### Sampling Observables ###

You can also at certain intervals extract values from the observable sequence using the [`sample`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/sample.md) method.  This is useful if you want values from say a stock ticker every five seconds or so without having to consume the entire observable sequence.

```js
var sampled = getStockData()
  .sample(5000 /* ms */);

sampled.subscribeOnNext(function (data) {
  console.log('Stock data: %o', data);
});
```

### Pausable Observables ###

The ability to pause and resume is also a powerful concept which is offered in RxJS in both lossy and loss-less versions.  In the case of lossy backpressure, the [`pausable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/pausable.md) operator can be used to stop listening and then resume listening at a later time by calling `pause` and `resume` respectively on the observable sequence.  For example we can take some observable sequence and call `pausable`, then call `pause` to pause the sequence and `resume` within 5 seconds.  Note that any data that comes in between the pause and resume are lost.  Note that this only works for hot observables and is unsuitable for cold observables as they will restart upon resume.

```js
var pausable = getSomeObservableSource()
  .pausable();

pausable.subscribeOnNext(function (data) {
  console.log('Data: %o', data);
});

pausable.pause();

// Resume in five seconds
setTimeout(function () {
  pausable.resume();
}, 5000);
```

## Loss-less Backpressure ##

In addition to supporting lossy backpressure mechanisms, RxJS also supports ways of getting the data in such a way that it is able to be fully consumed by the consumer at its own pace.  There are a number of strategies at work including using buffers that work with timespans, count or both, pausable buffers, reactive pull, etc.

### Buffers and Windows ###

The first strategy of dealing with an overly chatty producer is through the use of buffers.  This allows the consumer to set either the number of items they wish to wait for at a time, or a particular timespan, or both, whichever comes first.  This is useful in a number of cases, for example if you want some data within a window for comparison purposes in addition to chunking up data as you need it.

The [`bufferWithCount`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/bufferwithcount.md) method allows us to specify the number of items that you wish to capture in a buffer array before yielding it to the consumer.  An impractical yet fun use of this is to calculate whether the user has input the Konami Code for example.

```js
var codes = [
  38, // up
  38, // up
  40, // down
  40, // down
  37, // left
  39, // right
  37, // left
  39, // right
  66, // b
  65  // a
];

function isKonamiCode(buffer) {
  return codes.toString() === buffer.toString();
}

var keys = Rx.Observable.fromEvent(document, 'keyup')
  .map(function (e) { return e.keyCode; })
  .bufferWithCount(10, 1)
  .filter(isKonamiCode)
  .subscribeOnNext(function () {
    console.log('KONAMI!');
  });
```

On the other hand, you can also get the data within a buffer for a given amount of time with the [`bufferWithTime`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/bufferwithtime.md).  This is useful for example if you are tracking volume of data that is coming across the network, which can then be handled uniformly.

```js
var source = getStockData()
  .bufferWithTime(5000, 1000) // time in milliseconds
  .subscribeOnNext(function (data) {
    data.forEach(function (d) {
      console.log('Stock: %o', d);
    });
  });
```

In order to keep buffers from filling too quickly, there is a method to cap the buffer by specifying ceilings for count and timespan, whichever occurs first.  For example, the network could be particularly quick with the data for the specified time, and other times not, so to keep the data levels even, you can specify this threshold via the [`bufferWithTimeOrCount`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/bufferwithtimeorcount.md) method

```js
var source = getStockData()
  .bufferWithTimeOrCount(5000 /* ms */, 100 /* items */)
  .subscribeOnNext(function (data) {

    data.forEach(function (d) {
      console.log('Stock: %o', d);
    });

  });
```

### Pausable Buffers ###

The [`pausable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/pausable.md) method is great at dealing with hot observables where you would want to pause and resume while dropping data, however, you may want to preserve that data between the `pause` and `resume` calls.  To that end, we have introduced the [`pausableBuffered`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/pausablebuffered.md) method which keeps a running buffer between `pause` is called and is drained when `resume` is called.  This then leaves the discretion up to the developer to decide when to pause and resume and in the mean time, no data is lost.

```js
var source = getStockData()
  .pausableBuffered();

source.subscribeOnNext(function (stock) {
  console.log('Stock data: %o', stock);
});

source.pause();

// Resume after five seconds
setTimeout(function () {
  // Drains the buffer and subscribeOnNext is called with the data
  source.resume();
}, 5000);
```

### Controlled Observables ###

In more advanced scenarios, you may want to control the absolute number of items that you receive at a given time, and the rest is buffered via the `controlled` method.  For example, you can pull 10 items, followed by 20 items, and is up to the discretion of the developer.  This is more in-line with the efforts from the [Reactive Streams](http://www.reactive-streams.org/) effort to effectively turn the push stream into a push/pull stream.

```js
var source = getStockData()
  .controlled();

source.subscribeOnNext(function (stock) {
  console.log('Stock data: %o', stock);
});

source.request(2);

// Keep getting more after 5 seconds
setInterval(function () {
  source.request(2);
}, 5000);
```

### Future Work ###

This is of course only the beginning of the work with backpressure as there are many other strategies that can be considered.  In future versions of RxJS, the idea of the controlled observable will be baked into the subscription itself which then allows the backpressure to be an essential part of the contract or requesting n number of items.
