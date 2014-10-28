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

### 4.1 Consider drawing a Marble-diagram

Draw a marble-diagram of the observable sequence you want to create. By drawing the diagram, you
will get a clearer picture on what operator(s) to use.

A marble-diagram is a diagram that shows event occurring over time. A marble diagram contains both
input and output sequences(s).

<img src="throttleWithSelector.png" alt="throttleWithSelector">
