# RxJS Design Guidelines #

1. Introduction
2. When to use RxJS
  1. Use Rx for orchestrating asynchronous and event-based computations
  2. Use Rx to deal with asynchronous sequences of data
3. The Rx contract
  1. Assume the Rx Grammar
  2. Assume resources are cleaned up after an `onError` or `onCompleted` messages
  3. Assume a best effort to stop all outstanding work on Unsubscribe
4. Using RxJS
  1. Consider drawing a Marble-diagram
  2. Consider passing multiple arguments to `subscribe`
  3. Consider passing a specific scheduler to concurrency introducing operators
  4. Call the `observeOn` operator as late and in as few
  5. Consider limiting buffers
  6. Make side-effects explicit using the `do`/`tap` operator
  7. Assume messages can come through until unsubscribe has completed
  8. Use the Publish operator to share side-effects
5. Operator implementations
  1. Implement new operators by composing existing operators
  2. Implement custom operators using `Observable.create`
  3. Implement operators for existing observable sequences as generic extension methods
  4. Protect calls to user code from within an operator
  5. Subscribe implementations should not throw
  6. `onError` messages should have abort semantics
  7. Serialize calls to `Observer` methods within observable sequence implementations
  8. Avoid serializing operators
  9. Parameterize concurrency by providing a scheduler argument
  10. Provide a default scheduler
  11. The scheduler should be the last argument to the operator
  12. Avoid introducing concurrency
  13. Hand out all disposables instances created inside the operator to consumers
  14. Operators should not block
  15. Avoid deep stacks caused by recursion in operators
  16. Argument validation should occur outside `Observable.create`
  17. Unsubscription should be idempotent
  18. Unsubscription should not throw
  19. Custom Observable implementations should follow the Rx contract
  20. Operator implementations should follow guidelines for Rx usage

## 1. Introduction ##

This document describes guidelines that aid in developing applications and libraries that use the Reactive Extensions for RxJS library.

The guidelines listed in this document have evolved over time by the Rx team during the development of the RxJS library.

As Rx continues to evolve, these guidelines will continue to evolve with it. Make sure you have the latest version of this document.

All information described in this document is merely a set of guidelines to aid development. These guidelines do not constitute an absolute truth. They are patterns that the team found helpful; not rules that should be followed blindly. There are situations where certain guidelines do not apply. The team has tried to list known situations where this is the case. It is up to each individual developer to decide if a certain guideline makes sense in each specific situation.

The guidelines in this document are listed in no particular order. There is neither total nor partial ordering in these guidelines.

Please contact us through the [RxJS Issues](https://github.com/Reactive-Extensions/RxJS) for feedback on the guidelines, as well as questions on whether certain guidelines are applicable in specific situations.

## 2. When to Use RxJS ##

### 2.1 Use Rx for orchestrating asynchronous and event-based computations ###

Code that deals with more than one event or asynchronous computation gets complicated quickly as it needs to build a state-machine to deal with ordering issues. Next to this, the code needs to deal with successful and failure termination of each separate computation. This leads to code that doesn’t follow normal control-flow, is hard to understand and hard to maintain.

RxJS makes these computations first-class citizens. This provides a model that allows for readable and composable APIs to deal with these asynchronous computations.

#### Sample ####
```js
var input = document.getElementById('input');
var dictionarySuggest = Rx.Observable.fromEvent(input, 'keyup')
  .map(function () { return input.value; })
  .filter(function (text) { return !!text; })
  .distinctUntilChanged()
  .throttle(250)
  .flatMapLatest(searchWikipedia)
  .subscribe(
    function (results) {
      list = [];
      list.concat(results.map(createItem));
    },
    function (err) {
      logError(err);
    }
  );
```

This sample models a common UI paradigm of receiving completion suggestions while the user is typing input.

RxJS creates an observable sequence that models an existing `keyup` event on the input.

It then places several filters and projections on top of the event to make the event only fire if a unique value has come through. (The `keyup` event fires for every key stroke, so also if the user presses left or right arrow, moving the cursor but not changing the input text).

Next it makes sure the event only gets fired after 250 milliseconds of activity by using the `throttle` operator. (If the user is still typing characters, this saves a potentially expensive lookup that will be ignored immediately).

In traditionally written programs, this throttling would introduce separate callbacks through a timer. This timer could potentially throw exceptions (certain timers have a maximum amount of operations in flight).

Once the user input has been filtered down it is time to perform the dictionary lookup. As this is usually an expensive operation (e.g. a request to a server on the other side of the world), this operation is itself asynchronous as well.

The `flatMap`/`selectMany` operator allows for easy combining of multiple asynchronous operations. It doesn’t only combine success values; it also tracks any exceptions that happen in each individual operation.

In traditionally written programs, this would introduce separate callbacks and a place for exceptions occurring.

If the user types a new character while the dictionary operation is still in progress, we do not want to see the results of that operation anymore. The user has typed more characters leading to a more specific word, seeing old results would be confusing.

The `flatMapLatest` operation makes sure that the dictionary operation is ignored once a new `keyup` has been detected.

Finally we subscribe to the resulting observable sequence. Only at this time our execution plan will be used. We pass two functions to the `subscribe` call:
1. Receives the result from our computation.
2. Receives exceptions in case of a failure occurring anywhere along the computation.

#### When to ignore this guideline ####

If the application/library in question has very few asynchronous/event-based operations or has very few places where these operations need to be composed, the cost of depending on RxJS (redistributing the library as well as the learning curve) might outweigh the cost of manually coding these operations.

### 2.2 Use Rx to deal with asynchronous sequences of data ###

Several other libraries exist to aid asynchronous operations in the JavaScript ecosystem. Even though these libraries are powerful, they usually work best on operations that return a single message. They usually do not support operations that produce multiple messages over the lifetime of the operation.

RxJS follows the following grammar: `onNext`* (`onCompleted`|`onError`)?. This allows for multiple messages to come in over time. This makes RxJS suitable for both operations that produce a single message, as well as operations that produce multiple messages.

```js
var fs = require('fs');
var Rx = require('rx');

// Read/write from stream implementation
function readAsync(fd, chunkSize) { /* impl */ }
function appendAsync(fd, buffer) { /* impl */ }
function encrypt(buffer) { /* impl */}

//open a 4GB file for asynchronous reading in blocks of 64K
var inFile = fs.openSync('4GBfile.txt', 'r+');
var outFile = fs.openSync('Encrypted.txt', 'w+');

readAsync(inFile, 2 << 15)
  .map(encrypt)
  .flatMap(function (data) {
    return appendAsync(outFile, data);
  })
  .subscribe(
    function () { },
    function (err) {
      console.log('An error occurred while encrypting the file: %s', err.message);
      fs.closeSync(inFile);
      fs.closeSync(outFile);
    },
    function () {
      console.log('Successfully encrypted the file.');
      fs.closeSync(inFile);
      fs.closeSync(outFile);
    }
  );
```

In this sample, a 4 GB file is read in its entirety, encrypted and saved out to another file.

Reading the whole file into memory, encrypting it and writing out the whole file would be an expensive operation.

Instead, we rely on the fact that RxJS can produce many messages.

We read the file asynchronously in blocks of 64K. This produces an observable sequence of byte arrays. We then encrypt each block separately (for this sample we assume the encryption operation can work on separate parts of the file). Once the block is encrypted, it is immediately sent further down the pipeline to be saved to the other file.  The `writeAsync` operation is an asynchronous operation that can process multiple messages.

#### When to ignore this guideline ####

If the application/library in question has very few operations with multiple messages, the cost of depending on RxJS (redistributing the library as well as the learning curve) might outweigh the cost of manually coding these operations.

## 3. The RxJS Contract ##

### 3.1 The RxJS Grammar ###

Messages sent to instances of the `Observer` object follow the following grammar:
    onNext* (onCompleted | onError)?

This grammar allows observable sequences to send any amount (0 or more) of `onNext` messages to the subscribed observer instance, optionally followed by a single success (`onCompleted`) or failure (`onError`) message.

The single message indicating that an observable sequence has finished ensures that consumers of the observable sequence can deterministically establish that it is safe to perform cleanup operations.

A single failure further ensures that abort semantics can be maintained for operators that work on multiple observable sequences.

#### Sample ####
```js
var count = 0;
xs.subscribe(
  function () {
    count++;
  },
  function (err) {
    console.log('Error: %s', err.message);
  },
  function () {
    console.log('OnNext has been called %d times', count);
  }
);
```

In this sample we safely assume that the total amount of calls to the OnNext method won’t change once the OnCompleted method is called as the observable sequence follows the Rx grammar.

#### When to ignore this guideline ####

Ignore this guideline only when working with a non-conforming implementation of the Observable object.

### 3.2 Assume resources are cleaned up after an `onError` or `onCompleted` message ###

Paragraph 3.1 states that no more messages should arrive after an `onError` or `onCompleted` message. This makes it possible to cleanup any resource used by the subscription the moment an `onError` or `onCompleted` arrives. Cleaning up resources immediately will make sure that any side-effect occurs in a predictable fashion. It also makes sure that the runtime can reclaim these resources.

#### Sample ####
```js
var fs = require('fs');
var Rx = require('rx');

function appendAsync(fd, buffer) { /* impl */ }

function openFile(path, flags) {
  var fd = fs.openSync(path, flags);
  return Rx.Disposable.create(function () {
    fs.closeSync(fd);
  });
}

Rx.Observable.
  using(
    function () { return openFile('temp.txt', 'w+'); },
    function (fd) {
      return Rx.Observable.range(0, 10000)
        .map(function (v) { return Buffer(v); })
        .flatMap(function (buffer) {
          return appendAsync(fd, buffer);
        });
    }
  )
  .subscribe();
```

In this sample the Using operator creates a resource that will be disposed upon unsubscription. The Rx contract for cleanup ensures that unsubscription will be called automatically once an `onError` or `onCompleted` message is sent.

#### When to ignore this guideline ####

There are currently no known cases where to ignore this guideline.

### 3.3 Assume a best effort to stop all outstanding work on Unsubscribe ###

When unsubscribe is called on an observable subscription, the observable sequence will make a best effort attempt to stop all outstanding work. This means that any queued work that has not been started will not start.

Any work that is already in progress might still complete as it is not always safe to abort work that is in progress. Results from this work will not be signaled to any previously subscribed observer instances.

#### Sample 1
```js
Observable.timer(2000).subscribe(...).dispose()
```

In this sample subscribing to the observable sequence generated by Timer will queue an action on the `Scheduler.timeout` scheduler to send out an `onNext` message in 2 seconds. The subscription then gets canceled immediately. As the scheduled action has not started yet, it will be removed from the scheduler.


#### Sample 2
```js
Rx.Observable.startAsync(function () {
  return Q.delay(2000);
})
.subscribe(...).dispose();
```

In this sample the `startAsync` operator will immediately schedule the execution of the lambda provided as its argument. The subscription registers the observer instance as a listener to this execution. As the lambda is already running once the subscription is disposed, it will keep running and its return value is ignored.

## 4. Using Rx ##

### 4.1 Consider drawing a Marble-diagram ###

Draw a marble-diagram of the observable sequence you want to create. By drawing the diagram, you will get a clearer picture on what operator(s) to use.

A marble-diagram is a diagram that shows event occurring over time. A marble diagram contains both input and output sequences(s).

<img src="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/designguidelines/images/throttleWithTimeout.png" alt="throttleWithSelector">

By drawing the diagram we can see that we will need some kind of delay after the user input, before firing of another asynchronous call. The delay in this sample maps to the `throttle` operator. To create another observable sequence from an observable sequence we will use the `flatMap` or `selectMany` operator. This
will lead to the following code:

```js
var dictionarySuggest = userInput
  .throttle(250)
  .flatMap(function (input) { return serverCall(input); });
```

#### When to ignore this guideline ####

This guideline can be ignored if you feel comfortable enough with the observable sequence you want to write. However, even the Rx team members will still grab the whiteboard to draw a marble-diagram once in a while.

### 4.2 Consider passing multiple arguments to `subscribe` ###

For convenience, Rx provides an overload to the `subscribe` method that takes functions instead of an Observer argument.

The Observer object would require implementing all three methods (`onNext`, `onError` & `onCompleted`). The extensions to the `subscribe` method allow developers to use defaults chosen for each of these methods.

E.g. when calling the `subscribe` method that only has an `onNext` argument, the `onError` behavior will be to rethrow the exception on the thread that the message comes out from the observable sequence. The `onCompleted` behavior in this case is to do nothing.

In many situations, it is important to deal with the exception (either recover or abort the application gracefully).

Often it is also important to know that the observable sequence has completed successfully. For example, the application notifies the user that the operation has completed.

Because of this, it is best to provide all 3 arguments to the subscribe function.

RxJS also provides three convenience methods which only subscribe to the part of the sequence that is desired. The other handlers will default to their original behaviors. There are three of such functions:
- `subscribeOnNext`: for `onNext` messages only
- `subscribeOnError`: for `onError` messages only
- `subscribeOnCompleted`: for `onCompleted` messages only.

#### When to ignore this guideline ####

- When the observable sequence is guaranteed not to complete, e.g. an event such as keyup.
- When the observable sequence is guaranteed not to have `onError` messages (e.g. an event, a  materialized observable sequence etc…).
- When the default behavior is the desirable behavior.

### 4.3 Consider passing a specific scheduler to concurrency introducing operators ###

Rather than using the `observeOn` operator to change the execution context on which the observable sequence produces messages, it is better to create concurrency in the right place to begin with. As operators parameterize introduction of concurrency by providing a scheduler argument overload, passing the right scheduler will lead to fewer places where the ObserveOn operator has to be used.

#### Sample ####

```js
Rx.Observable.range(0, 90000, Rx.Scheduler.requestAnimationFrame)
  .subscribe(draw);
```

In this sample, callbacks from the `range` operator will arrive by calling `window.requestAnimationFrame`.  The default overload of `range` would place the `onNext` call on the `Rx.Scheduler.currentThread` which is used when recursive scheduling is required immediately.  By providing the `Rx.Scheduler.requestAnimationFrame` scheduler, all messages from this observable sequence will originiate on the `window.requestAnimationFrame` callback.

#### When to ignore this guideline ####

When combining several events that originate on different execution contexts, use guideline 4.4 to put  all messages on a specific execution context as late as possible.

### 4.4 Call the `observeOn` operator as late and in as few places as possible ###

By using the `observeOn` operator, an action is scheduled for each message that comes through the original observable sequence. This potentially changes timing information as well as puts additional stress on the system. Placing this operator later in the query will reduce both concerns.

#### Sample ####

```js
var result = xs.throttle(1000)
  .flatMap(function (x) {
    return ys.takeUntil(zs).sample(250).map(function (y) { return x + y });
  })
  .merge(ws)
  .filter(function (x) { return x < 10; })
  .observeOn(Rx.Scheduler.requestAnimationFrame);
```

This sample combines many observable sequences running on many different execution contexts. The query filters out a lot of messages. Placing the `observeOn` operator earlier in the query would do extra work on messages that would be filtered out anyway. Calling the `observeOn` operator at the end of the query will create the least performance impact.

#### When to ignore this guideline ####

Ignore this guideline if your use of the observable sequence is not bound to a specific execution context. In that case do not use the `observeOn` operator.

### 4.5 Consider limiting buffers ###

RxJS comes with several operators and classes that create buffers over observable sequences, e.g. the `replay` operator. As these buffers work on any observable sequence, the size of these buffers will depend on the observable sequence it is operating on. If the buffer is unbounded, this can lead to memory pressure. Many buffering operators provide policies to limit the buffer, either in time or size. Providing this limit will address memory pressure issues.

#### Sample ####

```js
var result = xs.replay(null, 10000, 1000 * 60 /* 1 hr */).refCount();
```

In this sample, the `replay` operator creates a buffer. We have limited that buffer to contain at most 10,000 messages and keep these messages around for a maximum of 1 hour.

#### When to ignore this guideline ####

When the amount of messages created by the observable sequence that populates the buffer is small or when the buffer size is limited.

### 4.6 Make side-effects explicit using the `do`/`tap` operator ###

As many Rx operators take functions as arguments, it is possible to pass any valid user code in these arguments. This code can change global state (e.g. change global variables, write to disk etc...).

The composition in Rx runs through each operator for each subscription (with the exception of the sharing operators, such as `publish`). This will make every side-effect occur for each subscription.

If this behavior is the desired behavior, it is best to make this explicit by putting the side-effecting code
in a `do`/`tap` operator.  There are overloads to this method which call the specified method only, for example `doOnNext`/`tapOnNext`, `doOnError`/`tapOnError`,`doOnCompleted`/`tapOnCompleted`

#### Sample ####

```js
var result = xs
  .filter(function (x) { return x.failed; })
  .tap(function (x) { log(x); });
```

In this sample, messages are filtered for failure. The messages are logged before handing them out to the code subscribed to this observable sequence. The logging is a side-effect (e.g. placing the messages in the computer’s event log) and is explicitly done via a call to the `do`/`tap` operator.

### 4.7 Assume messages can come through until unsubscribe has completed ###

As RxJS uses a push model, messages can be sent from different execution contexts. Messages can be in flight while calling unsubscribe. These messages can still come through while the call to unsubscribe is in progress. After control has returned, no more messages will arrive. The unsubscription process can still be in progress on a different context.

#### When to ignore this guideline ####

Once the `onCompleted` or `onError` method has been received, the RxJS grammar guarantees that the subscription can be considered to be finished.

### 4.8 Use the `publish` operator to share side-effects ###

As many observable sequences are cold (see cold vs. hot on Channel 9), each subscription will have a
separate set of side-effects. Certain situations require that these side-effects occur only once. The `publish` operator provides a mechanism to share subscriptions by broadcasting a single subscription to multiple subscribers.

There are several overloads of the `publish` operator. The most convenient overloads are the ones that provide a function with a wrapped observable sequence argument that shares the side-effects.

#### Sample ####

```js
var xs = Rx.Observable.create(function (observer) {
  console.log('Side effect');
  observer.onNext('hi!');
  observer.onCompleted();
});

xs.publish(function (sharedXs) {
  sharedXs.subscribe(console.log);
  sharedXs.subscribe(console.log);
  return sharedXs;
}).subscribe();
```

In this sample, xs is an observable sequence that has side-effects (writing to the console). Normally each separate subscription will trigger these side-effects. The `publish` operator uses a single subscription to xs for all subscribers to sharedXs.

#### When to ignore this guideline ####

Only use the `publish` operator to share side-effects when sharing is required. In most situations you can create separate subscriptions without any problems: either the subscriptions do not have side-effects or the side effects can execute multiple times without any issues.

## 5. Operator implementations ##

### 5.1 Implement new operators by composing existing operators ###

Many operations can be composed from existing operators. This will lead to smaller, easier to maintain code. The Rx team has put a lot of effort in dealing with all corner cases in the base operators. By reusing these operators you’ll get all that work for free in your operator.

#### Sample ####

```js
Rx.Observable.prototype.flatMap = function (selector) {
  return this.map(selector).mergeAll();
};
```

In this sample, the SelectMany operator uses two existing operators: `map` and `mergeAll`. The `map` operator already deals with any issues around the selector function throwing an exception. The `mergeAll` operator already deals with concurrency issues of multiple observable sequences firing at the same time.

#### When to ignore this guideline ####

- No appropriate set of base operators is available to implement this operator.
- Performance analysis proves that the implementation using existing operators has performance issues.  Such can be caused by `materialize`.

### 5.2 Implement custom operators using `Observable.create` ###

When it is not possible to follow guideline 5.1, use the Observable.Create(WithDisposable) method to create an observable sequence as it provides several protections make the observable sequence follow the RxJS contract.

- When the observable sequence has finished (either by firing `onError` or `onCompleted`), any subscription will automatically be unsubscribed.
- Any subscribed observer instance will only see a single OnError or OnCompleted message. No more messages are sent through. This ensures the Rx grammar of onNext* (onError|onCompleted)?

#### Sample ####

```js
Rx.Observable.prototype.map = function (selector, thisArg) {
  var source = this;
  return Rx.Observable.create(function (observer) {
    var idx = 0;
    return source.subscribe(
      function (x) {
        var result;
        try {
          result = selector.call(thisArg, x, idx++, source);
        } catch (e) {
          observer.onError(e);
          return;
        }

        observer.onNext(result);
      },
      observer.onError.bind(observer),
      observer.onCompleted.bind(observer)
    );
  })
};
```

In this sample, `map` uses the `Observable.create` operator to return a new instance of the Observable class. This ensures that no matter the implementation of the source observable sequence, the output observable sequence follows the Rx contract . It also ensures that the lifetime of subscriptions is a short as possible.

#### When to ignore this guideline ####

- The operator needs to return an observable sequence that doesn’t follow the Rx contract. This should usually be avoided (except when writing tests to see how code behaves when the contract is broken)
- The object returned needs to implement more than the Observable class (e.g. Subject, or a custom class).
