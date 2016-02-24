# Testing your Rx application #

Let's face it, testing asynchronous code is a pain.  In JavaScript, with so many asynchronous things to coordinate, testing is too hard for anyone to wrap their minds around.  Luckily the Reactive Extensions for JavaScript makes this easy.

If you have an observable sequence that publishes values over an extended period of time, testing it in real time can be a stretch. The RxJS library provides the [`TestScheduler`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/testing/testscheduler.md) type to assist testing this kind of time-dependent code without actually waiting for time to pass. The `TestScheduler` inherits [`VirtualScheduler`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/schedulers/virtualtimescheduler.md) and allows you to create, publish and subscribe to sequences in emulated time. For example, you can compact a publication which takes 5 days to complete into a 2 minute run, while maintaining the correct scale. You can also take a sequence which actually has happened in the past (e.g., a sequence of stock ticks for a previous year) and compute or subscribe to it as if it is pushing out new values in real time.

The factory methods [`startWithTiming`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/testing/testscheduler.md#rxtestschedulerprototypestartwithtimingcreate-created-subscribed-disposed), [`startWithCreate`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/testing/testscheduler.md#rxtestschedulerprototypestartwithcreatecreate) and [`startWithDispose`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/testing/testscheduler.md#rxtestschedulerprototypestartwithdisposecreate-disposed) executes all scheduled tasks until the queue is empty, or you can specify a time to so that queued-up tasks are only executed to the specified time.

The following example creates a hot observable sequence with specified `onNext` notifications. It then starts the test scheduler and specifies when to subscribe to and dispose of the hot observable sequence. The Start method returns an instance of an `Observer`, which contains a `messages` property that records all notifications in a list.

After the sequence has completed, we can use methods such as `collectionAssert.assertEqual` to compare the `messages` property, together with a list of expected values to see if both are identical (with the same number of items, and items are equal and in the same order). By doing so, we can confirm that we have indeed received the notifications that we expect. In our example, since we only start subscribing at 150, we will miss out the value 'abc'. However, when we compare the values we have received so far at 400, we notice that we have in fact received all the published values after we subscribed to the sequence. And we also verify that the OnCompleted notification was fired at the right time at 500. In addition, subscription information is also captured by the `Observable` type returned by the [`createHotObservable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/testing/testscheduler.md#rxtestschedulerprototypecreatehotobservableargs) method.

In the same way, you can use that same defined method such as our `collectionAssert.assertEqual` below to confirm that subscriptions indeed happened at expected times.  It is easy to wrap this for your favorite unit testing framework whether it is QUnit, Mocha, Jasmine, etc.  In this example, we'll write a quick wrapper for QUnit.

```js
function createMessage(expected, actual) {
  return 'Expected: [' + expected.toString() + ']\r\nActual: [' + actual.toString() + ']';
}

// Using QUnit testing for assertions
var collectionAssert = {
  assertEqual: function (actual, expected) {
    var comparer = Rx.internals.isEqual, isOk = true;

    if (expected.length !== actual.length) {
      ok(false, 'Not equal length. Expected: ' + expected.length + ' Actual: ' + actual.length);
      return;
    }

    for(var i = 0, len = expected.length; i < len; i++) {
      isOk = comparer(expected[i], actual[i]);
      if (!isOk) {
        break;
      }
    }

    ok(isOk, createMessage(expected, actual));
  }
};

var onNext = Rx.ReactiveTest.onNext,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe;

test('buffer should join strings', function () {
  var scheduler = new Rx.TestScheduler();

  var input = scheduler.createHotObservable(
    onNext(100, 'abc'),
    onNext(200, 'def'),
    onNext(250, 'ghi'),
    onNext(300, 'pqr'),
    onNext(450, 'xyz'),
    onCompleted(500)
  );

  var results = scheduler.startScheduler(
    function () {
      return input.buffer(function () {
        return input.debounce(100, scheduler);
      })
      .map(function (b) {
        return b.join(',');
      });
    },
    {
      created: 50,
      subscribed: 150,
      disposed: 600
    }
  );

  collectionAssert.assertEqual(results.messages, [
    onNext(400, 'def,ghi,pqr'),
    onNext(500, 'xyz'),
    onCompleted(500)
  ]);

  collectionAssert.assertEqual(input.subscriptions, [
    subscribe(150, 500),
    subscribe(150, 400),
    subscribe(400, 500)
  ]);
});
```

## Debugging your Rx application ##

You can use the [`do`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypedoobserver--onnext-onerror-oncompleted) operator to debug your Rx application. The `do` operator allows you to specify various actions to be taken for each item of observable sequence (e.g., print or log the item, etc.). This is especially helpful when you are chaining many operators and you want to know what values are produced at each level.

In the following example, we are going to reuse the Buffer example which generates integers every second, while putting them into buffers that can hold 5 items each. In our original example in the [Querying Observable Sequences](querying.md) topic, we subscribe only to the final `Observable` sequence when the buffer is full (and before it is emptied). In this example, however, we will use the `do` operator to print out the values when they are being pushed out by the original sequence (an integer every second). When the buffer is full, we use the `do` operator to print the status, before handing over all this as the final sequence for the observer to subscribe.

```js
var seq1 = Rx.Observable.interval(1000)
  .do(function (x) { console.log(x); })
  .bufferWithCount(5)
  .do(function (x) { console.log('buffer is full'); })
  .subscribe(function (x) { console.log('Sum of the buffer is ' + x.reduce(function (acc, x) { return acc + x; }, 0)); });

// => 0
// => 1
// => 2
// => 3
// => 4
// => buffer is full
// => Sum of the buffer is 10
// ...
```

As you can see from this sample, a subscription is on the recipient end of a series of chained observable sequences. At first, we create an observable sequence of integers separate by a second using the Interval operator. Then, we put 5 items into a buffer using the Buffer operator, and send them out as another sequence only when the buffer is full. Lastly, this is handed over to the Subscribe operator. Data propagate down all these intermediate sequences until they are pushed to the observer. In the same way, subscriptions are propagated in the reverse direction to the source sequence. By inserting the `do` operator in the middle of such propagations, you can "spy" on such data flow just like you use console.log  perform debugging.

You can also use the [`timestamp`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypetimestampscheduler) operator to verify the time when an item is pushed out by an observable sequence. This can help you troubleshoot time-based operations to ensure accuracy. Recall the following example from the [Creating and Subscribing to Simple Observable Sequences](creating.md) topic, in which we chain the `timestamp` operator to the query so that each value pushed out by the source sequence will be appended by the time when it is published. By doing so, when we subscribe to this source sequence, we can receive both its value and timestamp.

```js
console.log('Current time: ' + Date.now());

var source = Rx.Observable.timer(5000, 1000)
  .timestamp();

var subscription = source.subscribe(function (x) {
  console.log(x.value + ': ' + x.timestamp);
});

/* Output will look similar to this */
// => Current time: 1382646947400
// => 0: 1382646952400
// => 1: 1382646953400
// => 2: 1382646954400
// => 3: 1382646955400
// => 4: 1382646956400
// => 5: 1382646957400
// => 6: 1382646958400
```

By using the `timestamp` operator, we have verified that the first item is indeed pushed out 5 seconds after the sequence, and each item is published 1 second later.

You can remove any `do` and `map` or `select` calls after you finish debugging.

## Long Stack Traces Support

When dealing with large RxJS applications, debugging and finding where the error occurred can be a difficult operation. As you chain more and more operators together, the longer the stack trace gets, and the harder it is to find out where things went wrong. Inspiration for this feature came from the [Q library](https://github.com/kriskowal/q) from [@kriskowal](https://github.com/kriskowal) which helped us get started.

RxJS comes with optional support for "long stack traces" where the stack property of Error from onError calls is rewritten to be traced along asynchronous jumps instead of stopping at the most recent one. As an example:
```js
var Rx = require('rx');

var source = Rx.Observable.range(0, 100)
  .timestamp()
  .map(function (x) {
    if (x.value > 98) throw new Error();
    return x;
  });

source.subscribeOnError(
  function (err) {
    console.log(err.stack);
  });
```
The error stack easily becomes unreadable and hard to find where the error actually occurred:
```bash
$ node example.js

  Error
  at C:\GitHub\example.js:6:29
  at AnonymousObserver._onNext (C:\GitHub\rxjs\dist\rx.all.js:4013:31)
  at AnonymousObserver.Rx.AnonymousObserver.AnonymousObserver.next (C:\GitHub\rxjs\dist\rx.all.js:1863:12)
  at AnonymousObserver.Rx.internals.AbstractObserver.AbstractObserver.onNext (C:\GitHub\rxjs\dist\rx.all.js:1795:35)
  at AutoDetachObserverPrototype.next (C:\GitHub\rxjs\dist\rx.all.js:9226:23)
  at AutoDetachObserver.Rx.internals.AbstractObserver.AbstractObserver.onNext (C:\GitHub\rxjs\dist\rx.all.js:1795:35)
  at AnonymousObserver._onNext (C:\GitHub\rxjs\dist\rx.all.js:4018:18)
  at AnonymousObserver.Rx.AnonymousObserver.AnonymousObserver.next (C:\GitHub\rxjs\dist\rx.all.js:1863:12)
  at AnonymousObserver.Rx.internals.AbstractObserver.AbstractObserver.onNext (C:\GitHub\rxjs\dist\rx.all.js:1795:35)
  at AutoDetachObserverPrototype.next (C:\GitHub\rxjs\dist\rx.all.js:9226:23)
```
Instead, we can turn on this feature by setting the following flag:
```js
Rx.config.longStackSupport = true;
```
When running the same example again with the flag set at the top, our stack trace looks much nicer and indicates exactly where the error occurred:
```bash
$ node example.js

  Error
  at C:\GitHub\example.js:6:29
  From previous event:
  at Object.<anonymous> (C:\GitHub\example.js:3:28)
  From previous event:
  at Object.<anonymous> (C:\GitHub\example.js:4:4)
  From previous event:
  at Object.<anonymous> (C:\GitHub\example.js:5:4)
```

Now, it is more clear that the error did occur exactly at line 6 with throwing an error and only shows the user code in this point. This is very helpful for debugging, as otherwise you end up getting only the first line, plus a bunch of RxJS internals, with no sign of where the operation started.

This feature does come with a serious performance and memory overhead, however, If you're working with lots of RxJS code, or trying to scale a server to many users, you should probably keep it off. In development, this is perfectly fine for finding those pesky errors!

In a future release, we may also release support for a node.js environment variable so that you can set it and unset it fairly easily.

## See Also ##

**Concepts**
- [Creating and Subscribing to Simple Observable Sequences](creating.md)
- [Querying Observable Sequences](querying.md)
- [Using Schedulers](schedulers.md)
