# RxJS Design Guidelines #

<img style="display: block; margin: 0 auto; clear: right;"
  src="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/designguidelines/images/984368.png"
  alt="RxJS Logo">

1. [Introduction](#1-introduction)
2. [When to use RxJS](#2-when-to-use-rxjs)
  1. [Use RxJS for orchestrating asynchronous and event-based computations](#21-use-rxjs-for-orchestrating-asynchronous-and-event-based-computations)
  2. [Use RxJS to deal with asynchronous sequences of data](#22-use-rxjs-to-deal-with-asynchronous-sequences-of-data)
3. [The RxJS contract](#3-the-rxjs-contract)
  1. [Assume the RxJS Grammar](#31-the-rxjs-grammar)
  2. [Assume resources are cleaned up after an `onError` or `onCompleted` messages](#32-assume-resources-are-cleaned-up-after-an-onerror-or-oncompleted-message)
  3. [Assume a best effort to stop all outstanding work on Unsubscribe](#33-assume-a-best-effort-to-stop-all-outstanding-work-on-unsubscribe)
4. [Using RxJS](#4-using-rx)
  1. [Consider drawing a Marble-diagram](#41-consider-drawing-a-marble-diagram)
  2. [Consider passing multiple arguments to `subscribe`](#42-consider-passing-multiple-arguments-to-subscribe)
  3. [Consider passing a specific scheduler to concurrency introducing operators](#43-consider-passing-a-specific-scheduler-to-concurrency-introducing-operators)
  4. [Call the `observeOn` operator as late and in as few places as possible](#44-call-the-observeon-operator-as-late-and-in-as-few-places-as-possible)
  5. [Consider limiting buffers](#45-consider-limiting-buffers)
  6. [Make side-effects explicit using the `do`/`tap` operator](#46-make-side-effects-explicit-using-the-dotap-operator)
  7. [Assume messages can come through until unsubscribe has completed](#47-assume-messages-can-come-through-until-unsubscribe-has-completed)
  8. [Use the `publish` operator to share side-effects](#48-use-the-publish-operator-to-share-side-effects)
5. [Operator implementations](#5-operator-implementations)
  1. [Implement new operators by composing existing operators](#51-implement-new-operators-by-composing-existing-operators)
  2. [Implement custom operators using `Observable.create`](#52-implement-custom-operators-using-observablecreate)
  3. [Protect calls to user code from within an operator](#53-protect-calls-to-user-code-from-within-an-operator)
  4. [`subscribe` implementations should not throw](#54-subscribe-implementations-should-not-throw)
  5. [`onError` messages should have abort semantics](#55-onerror-messages-should-have-abort-semantics)
  6. [Parameterize concurrency by providing a scheduler argument](#56-parameterize-concurrency-by-providing-a-scheduler-argument)
  7. [Provide a default scheduler](#57-provide-a-default-scheduler)
  8. [The scheduler should be the last argument to the operator](#58-the-scheduler-should-be-the-last-argument-to-the-operator)
  9. [Avoid introducing concurrency](#59-avoid-introducing-concurrency)
  10. [Hand out all disposables instances created inside the operator to consumers](#510-hand-out-all-disposables-instances-created-inside-the-operator-to-consumers)
  11. [Operators should not block](#511-operators-should-not-block)
  12. [Avoid deep stacks caused by recursion in operators](#512-avoid-deep-stacks-caused-by-recursion-in-operators)
  13. [Argument validation should occur outside `Observable.create`](#513-argument-validation-should-occur-outside-observablecreate)
  14. [Unsubscription should be idempotent](#514-unsubscription-should-be-idempotent)
  15. [Unsubscription should not throw](#515-unsubscription-should-not-throw)
  16. [Custom Observable implementations should follow the RxJS contract](#516-custom-observable-implementations-should-follow-the-rxjs-contract)
  17. [Operator implementations should follow guidelines for RxJS usage](#517-operator-implementations-should-follow-guidelines-for-rxjs-usage)

## 1. Introduction ##

This document describes guidelines that aid in developing applications and libraries that use the Reactive Extensions for RxJS library.

The guidelines listed in this document have evolved over time by the Rx team during the development of the RxJS library.

As RxJS continues to evolve, these guidelines will continue to evolve with it. Make sure you have the latest version of this document.

All information described in this document is merely a set of guidelines to aid development. These guidelines do not constitute an absolute truth. They are patterns that the team found helpful; not rules that should be followed blindly. There are situations where certain guidelines do not apply. The team has tried to list known situations where this is the case. It is up to each individual developer to decide if a certain guideline makes sense in each specific situation.

The guidelines in this document are listed in no particular order. There is neither total nor partial ordering in these guidelines.

Please contact us through the [RxJS Issues](https://github.com/Reactive-Extensions/RxJS) for feedback on the guidelines, as well as questions on whether certain guidelines are applicable in specific situations.

## 2. When to Use RxJS ##

### 2.1 Use RxJS for orchestrating asynchronous and event-based computations ###

Code that deals with more than one event or asynchronous computation gets complicated quickly as it needs to build a state-machine to deal with ordering issues. Next to this, the code needs to deal with successful and failure termination of each separate computation. This leads to code that doesn’t follow normal control-flow, is hard to understand and hard to maintain.

RxJS makes these computations first-class citizens. This provides a model that allows for readable and composable APIs to deal with these asynchronous computations.

#### Sample ####
```js
var input = document.getElementById('input');
var dictionarySuggest = Rx.Observable.fromEvent(input, 'keyup')
  .map(function () { return input.value; })
  .filter(function (text) { return !!text; })
  .distinctUntilChanged()
  .debounce(250)
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

Next it makes sure the event only gets fired after 250 milliseconds of activity by using the `debounce` operator. (If the user is still typing characters, this saves a potentially expensive lookup that will be ignored immediately).

In traditionally written programs, this debouncing would introduce separate callbacks through a timer. This timer could potentially throw exceptions (certain timers have a maximum amount of operations in flight).

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

### 2.2 Use RxJS to deal with asynchronous sequences of data ###

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

By drawing the diagram we can see that we will need some kind of delay after the user input, before firing of another asynchronous call. The delay in this sample maps to the `debounce` operator. To create another observable sequence from an observable sequence we will use the `flatMap` or `selectMany` operator. This
will lead to the following code:

```js
var dictionarySuggest = userInput
  .debounce(250)
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
var result = xs.debounce(1000)
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

As many observable sequences are cold [\(see cold vs. hot on Channel 9\)](http://channel9.msdn.com/Blogs/J.Van.Gogh/Rx-API-in-depth-Hot-and-Cold-observables), each subscription will have a
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
  sharedXs.subscribe(console.log.bind(console));
  sharedXs.subscribe(console.log.bind(console));
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

### 5.3 Protect calls to user code from within an operator ###

When user code is called from within an operator, this is potentially happening outside of the execution context of the call to the operator (asynchronously). Any exception that happens here will cause the program to terminate unexpectedly. Instead it should be fed through to the subscribed observer instance so that the exception can be dealt with by the subscribers.

Common kinds of user code that should be protected:
- Selector functions passed in to the operator.
- Comparer functions passed into the operator.

**Note:** calls to `Scheduler` implementations are not considered for this guideline. The reason for this is that only a small set of issues would be caught as most schedulers deal with asynchronous calls. Instead, protect the arguments passed to schedulers inside each scheduler implementation.

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

This sample invokes a selector function which is user code. It catches any exception resulting from this call and transfers the exception to the subscribed observer instance through the `onError` call.

#### When to ignore this guideline ####

Ignore this guideline for calls to user code that are made before creating the observable sequence (outside of the `Observable.create` call). These calls are on the current execution context and are allowed to follow normal control flow.

**Note:** do not protect calls to `subscribe`, `dispose`, `onNext`, `onError` and `onCompleted` methods. These calls are on the edge of the monad. Calling the `onError` method from these places will lead to unexpected behavior.

### 5.4 `subscribe` implementations should not throw ###

As multiple observable sequences are composed, subscribe to a specific observable sequence might not happen at the time the user calls `subscribe` (e.g. Within the `concat` operator, the second observable sequence argument to `concat` will only be subscribed to once the first observable sequence has completed). Throwing an exception would bring down the program. Instead exceptions in subscribe should be tunneled to the `onError` method.

#### Sample ####

```js
var CLOSED = 3;

function readWebSocket(socket) {
  return Rx.Observable.create(function (observer) {
    if (socket.readyState === CLOSED) {
      observer.onError(new Error('The websocket is no longer open.'));
      return;
    }
    // Rest of the implementation goes here
  });
}
```

In this sample, an error condition is detected in the subscribe method implementation. An error is raised by calling the `onError` method instead of throwing the exception. This allows for proper handling of the exception if `subscribe` is called outside of the execution context of the original call to Subscribe by the user.

#### When to ignore this guideline ####

When a catastrophic error occurs that should bring down the whole program anyway.

### 5.5 `onError` messages should have abort semantics

As normal control flow in JavaScript uses abort semantics for exceptions (the stack is unwound, current code path is interrupted), RxJS mimics this behavior. To ensure this behavior, no messages should be sent out by an operator once one of it sources has an error message or an exception is thrown within the operator.

#### Sample ####

```js
Rx.Observable.prototype.minimumBuffer = function (bufferSize) {
  var source = this;
  return Rx.Observable.create(function (observer) {
    var data = [];

    return source.subscribe(
      function (value) {
        data = data.concat(value);
        if (data.length > bufferSize) {
          observer.onNext(data.slice(0));
          data = [];
        }
      },
      observer.onError.bind(observer),
      function () {
        if (data.length > 0) {
          observer.onNext(data.slice(0));
        }
        observer.onCompleted();
      }
    );
  });
};
```

In this sample, a buffering operator will abandon the observable sequence as soon as the subscription to source encounters an error. The current buffer is not sent to any subscribers, maintain abort semantics.

#### When to ignore this guideline ####

There are currently no known cases where to ignore this guideline.

### 5.6 Parameterize concurrency by providing a scheduler argument ###

As there are many different notions of concurrency, and no scenario fits all, it is best to parameterize the concurrency an operator introduces. The notion of parameterizing concurrency in RxJS is abstracted through the `Scheduler` class.

#### Sample ####

```js
Rx.Observable.just = function (value, scheduler) {
  return Rx.Observable.create(function (observer) {
    return scheduler.schedule(function () {
      observer.onNext(value);
      observer.onCompleted();
    });
  });
};
```

In this sample, the `just` operator parameterizes the level of concurrency the operator has by providing a scheduler argument. It then uses this scheduler to schedule the firing of the `onNext` and `onCompleted` messages.

#### When to ignore this guideline ####

- The operator is not in control of creating the concurrency (e.g. in an operator that converts an event into an observable sequence, the source event is in control of firing the messages, not the operator).
- The operator is in control, but needs to use a specific scheduler for introducing concurrency.

### 5.7 Provide a default scheduler ###

In most cases there is a good default that can be chosen for an operator that has parameterized concurrency through guideline 5.6. This will make the code that uses this operator more succinct.

**Note:** Follow guideline 5.9 when choosing the default scheduler, using the immediate scheduler where possible, only choosing a scheduler with more concurrency when needed.

#### Sample ####

```js
Rx.Observable.just = function (value, scheduler) {
  // Pick a default scheduler, in this case, immediately
  Rx.helpers.isScheduler(scheduler) || (scheduler = Rx.Scheduler.immediate);

  return Rx.Observable.create(function (observer) {
    return scheduler.schedule(function () {
      observer.onNext(value);
      observer.onCompleted();
    });
  });
};
```

In this sample, we provided a default scheduler if not provided by the caller.

#### When to ignore this guideline ####

Ignore this guideline when no good default can be chosen.

### 5.8 The scheduler should be the last argument to the operator ###

Adding the scheduler as the last argument is a must for all operators introducing concurrency.  This is to ensure that the schedulers are optional, and a default one can be chosen.  This also makes the programming experience much more predictable.

#### Sample ####

```js
Rx.Observable.just = function (value, scheduler) {
  // Pick a default scheduler, in this case, immediately
  Rx.helpers.isScheduler(scheduler) || (scheduler = Rx.Scheduler.immediate);

  return Rx.Observable.create(function (observer) {
    return scheduler.schedule(function () {
      observer.onNext(value);
      observer.onCompleted();
    });
  });
};
```

In this sample the `return` operator has two parameters, and the scheduler parameter defaults to the immediate scheduler if not provided. As the scheduler argument is the last argument, adding or omitting the argument is clearly visible.

#### When to ignore this guideline ####

JavaScript supports rest arguments syntax. With this syntax, the rest arguments has to be the last argument. Make the scheduler the final to last argument in this case.

### 5.9 Avoid introducing concurrency ###

By adding concurrency, we change the timeliness of an observable sequence. Messages will be scheduled to arrive later. The time it takes to deliver a message is data itself, by adding concurrency we skew that data.  This includes not using such mechanisms as `setTimeout`, `setImmediate`, `requestAnimationFrame`, `process.nextTick`, etc which should be avoided directly in your code, and instead be wrapped by a `Scheduler` class.

#### Sample 1 ####

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

In this sample, the select operator does not use a scheduler to send out the `onNext` message. Instead it uses the source observable sequence call to `onNext` to process the message, hence staying in the same time-window.

#### Sample 2 ####

```js
Rx.Observable.just = function (value, scheduler) {
  // Pick a default scheduler, in this case, immediately
  Rx.helpers.isScheduler(scheduler) || (scheduler = Rx.Scheduler.immediate);

  return Rx.Observable.create(function (observer) {
    return scheduler.schedule(function () {
      observer.onNext(value);
      observer.onCompleted();
    });
  });
};
```

In this case, the default scheduler for the `just` operator is the immediate scheduler. This scheduler does not introduce concurrency.

#### When to ignore this guideline ####

Ignore this guideline in situations where introduction of concurrency is an essential part of what the operator does.

**NOTE:** When we use the Immediate scheduler or call the observer directly from within the call to `subscribe`, we make the `subscribe` call blocking. Any expensive computation in this situation would indicate a candidate for introducing concurrency.

### 5.10 Hand out all disposables instances created inside the operator to consumers ###

`Disposable` instances control lifetime of subscriptions as well as cancelation of scheduled actions. RxJS gives users an opportunity to unsubscribe from a subscription to the observable sequence using disposable instances.

After a subscription has ended, no more messages are allowed through. At this point, leaving any state alive inside the observable sequence is inefficient and can lead to unexpected semantics.

To aid composition of multiple disposable instances, RxJS provides a set of classes implementing `Disposable` such as:

Name                       | Description
-------------------------- | ---------------------------------------------------------------
CompositeDisposable        | Composes and disposes a group of disposable instances together.
SerialDisposable           | A place holder for changing instances of disposable instances. Once new disposable instance is placed, the old disposable instance is disposed.
SingleAssignmentDisposable | A place holder for a single instance of a disposable.
ScheduledDisposable        | Uses a scheduler to dispose an underlying disposable instance.

#### Sample ####

```js
Observable.prototype.zip = function () {
  var parent = this,
      sources = slice.call(arguments),
      resultSelector = sources.pop();

  sources.unshift(parent);
  return new AnonymousObservable(function (observer) {
    var n = sources.length,
      queues = arrayInitialize(n, function () { return []; }),
      isDone = arrayInitialize(n, function () { return false; });

    function next(i) {
      var res, queuedValues;
      if (queues.every(function (x) { return x.length > 0; })) {
        try {
          queuedValues = queues.map(function (x) { return x.shift(); });
          res = resultSelector.apply(parent, queuedValues);
        } catch (ex) {
          observer.onError(ex);
          return;
        }
        observer.onNext(res);
      } else if (isDone.filter(function (x, j) { return j !== i; }).every(identity)) {
        observer.onCompleted();
      }
    };

    function done(i) {
      isDone[i] = true;
      if (isDone.every(function (x) { return x; })) {
        observer.onCompleted();
      }
    }

    var subscriptions = new Array(n);
    for (var idx = 0; idx < n; idx++) {
      (function (i) {
        var source = sources[i], sad = new SingleAssignmentDisposable();
        Rx.helpers.isPromise(source) && (source = Rx.Observable.fromPromise(source));
        sad.setDisposable(source.subscribe(function (x) {
          queues[i].push(x);
          next(i);
        }, observer.onError.bind(observer), function () {
          done(i);
        }));
        subscriptions[i] = sad;
      })(idx);
    }

    return new CompositeDisposable(subscriptions);
  });
};
```

In this sample, the operator groups all disposable instances controlling the various subscriptions together and returns the group as the result of subscribing to the outer observable sequence. When a user of this operator subscribes to the resulting observable sequence, he/she will get back a disposable instance that controls subscription to all underlying observable sequences.

#### When to ignore this guideline ####

There are currently no known instances where this guideline should be ignored.

### 5.11 Operators should not block ###

RxJS is a library for composing asynchronous and event-based programs using observable collections.  

By making an operator blocking we lose these asynchronous characteristics. We also potentially lose composability (e.g. by returning a value typed as `T` instead of `Observable<T>`).  This is in contrast to the Array#extras such as `sum`, `reduce`, `some` and `every` which return a single value.

#### Sample ####

```js
Rx.Observable.prototype.sum = function () {
  return this.reduce(function (acc, x) { return acc + x; }, 0);
};
```

In this sample, the `sum` operator has a return type of `Observable<Number>` instead of `Number`. By doing this, the operator does not block. It also allows the result value to be used in further composition.

#### When to ignore this guideline ####

There are currently no known instances where this guideline should be ignored.

### 5.12 Avoid deep stacks caused by recursion in operators ###

As code inside Rx operators can be called from different execution context in many different scenarios, it is nearly impossible to establish how deep the stack is before the code is called. If the operator itself has a deep stack (e.g. because of recursion), the operator could trigger a stack overflow quicker than one might expect.

There are two recommended ways to avoid this issue:

- Use the recursive `scheduleRecursive` methods on the `Scheduler`
- Implement an infinite looping generator using the yield iterator pattern, convert it to an observable sequence using the `from` operator.

#### Sample 1 ####

```js
Rx.Observable.repeat = function (value, scheduler) {
  return Rx.Observable.create(function (observer) {
    return scheduler.scheduleRecursive(function (self) {
      observer.onNext(value);
      self();
    });
  });
};
```

In this sample, the recursive `scheduleRecursive` method is used to allow the scheduler to schedule the next iteration of the recursive function. Schedulers such as the current thread scheduler do not rely on stack semantics. Using such a scheduler with this pattern will avoid stack overflow issues.

#### Sample 2 ####

```js
Rx.Observable.repeat = function (value) {
  return Rx.Observable.from(
    function* () {
      while(true) { yield value; }
    }());
};
```

The yield iterator pattern ensures that the stack depth does not increase drastically. By returning an infinite generator with the `from` operator can build an infinite observable sequence.

#### When to ignore this guideline ####

There are currently no known instances where this guideline should be ignored.

### 5.13 Argument validation should occur outside `Observable.create`

As guideline 5.3 specifies that the `Observable.create` operator should not throw, any argument validation that potentially throws exceptions should be done outside the `Observable.create` operator.

#### Sample ####

```js
Rx.Observable.prototype.map = function (selector, thisArg) {
  if (this == null) {
    throw new TypeError('Must be an instance of an Observable');
  }
  if (selector == null) {
    throw new TypeError('selector cannot be null/undefined');
  }
  var selectorFn = typeof selector !== 'function' ?
    function () { return selector; } :
    selector;
  var source = this;
  return Rx.Observable.create(function (observer) {
    var idx = 0;
    return source.subscribe(
      function (x) {
        var result;
        try {
          result = selectorFn.call(thisArg, x, idx++, source);
        } catch (e) {
          observer.onError(e);
          return;
        }

        observer.onNext(result);
      },
      observer.onError.bind(observer),
      observer.onCompleted.bind(observer)
    );
  };
};
```

In this sample, the arguments are checked for null values before the `Observable.create` operator is called.

#### When to ignore this guideline ####

Ignore this guideline if some aspect of the argument cannot be checked until the subscription is active.

### 5.14 Unsubscription should be idempotent ###

The observable `subscribe` method returns a `Disposable` instance that can be used to clean up the subscription. The `Disposable` instance doesn’t give any information about what the state of the subscription is. As consumers do not know the state of the subscription, calling the `dispose` method multiple times should be allowed. Only the first call the side-effect of cleaning up the subscription should occur.

#### Sample ####

```js
var subscription = xs.subscribe(function (x) { console.log(x); });
subscription.dispose();
subscription.dispose();
```

In this sample, the subscription is disposed twice, the first time the subscription will be cleaned up and the second call will be a no-op.

### 5.15 Unsubscription should not throw ###

As the RxJS’s composition makes that subscriptions are chained, so are unsubscriptions. Because of this, any operator can call an unsubscription at any time. Because of this, just throwing an exception will lead to the application crashing unexpectedly. As the observer instance is already unsubscribed, it cannot be used for receiving the exception either. Because of this, exceptions in unsubscriptions should be avoided.

#### When to ignore this guideline ####

There are currently no known cases where to ignore this guideline.

### 5.16 Custom `Observable` implementations should follow the RxJS contract ###

When it is not possible to follow guideline 5.1, the custom implementation of the `Observable` class should still follow the RxJS contract in order to get the right behavior from the RxJS operators.

#### When to ignore this guideline ####

Only ignore this guideline when writing observable sequences that need to break the contract on purpose (e.g. for testing).

### 5.17 Operator implementations should follow guidelines for RxJS usage ###

As Rx is a composable API, operator implementations often use other operators for their implementation (see paragraph 5.1). RxJS usage guidelines should be strongly considered when implementing these operators.

#### When to ignore this guideline ####

As described in the introduction, only follow a guideline if it makes sense in that specific situation.
