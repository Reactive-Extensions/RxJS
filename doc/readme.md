# RxJS <sup>v4.0</sup>

Reactive Extensions (Rx) is a library for composing asynchronous and event-based programs using observable sequences and LINQ-style query operators.

Data sequences can take many forms, such as a stream of data from a file or web service, web services requests, system notifications, or a series of events such as user input.

Reactive Extensions represents all these data sequences as observable sequences. An application can subscribe to these observable sequences to receive asynchronous notifications as new data arrive.

RxJS has no dependencies which complements and interoperates smoothly with both synchronous data streams such as iterable objects in JavaScript and single-value asynchronous computations such as Promises as the following diagram shows:

<center>
<table>
   <th></th><th>Single return value</th><th>Mutiple return values</th>
   <tr>
      <td>Pull/Synchronous/Interactive</td>
      <td>Object</td>
      <td>Iterables(Array | Set | Map)</td>
   </tr>
   <tr>
      <td>Push/Asynchronous/Reactive</td>
      <td>Promise</td>
      <td>Observable</td>
   </tr>
</table>
</center>

To put it more concretely, if you know how to program against Arrays using the Array#extras, then you already know how to use RxJS!

<center><table>
 <thead>
  <tr><th colspan="2">Example code showing how similar high-order functions can be applied to an Array and an Observable</th></tr>
  <tr><th>Iterable</th><th>Observable</th></tr>
 </thead>
 <tbody>
  <tr><td><pre><code>getDataFromLocalMemory()
  .filter (s => s != null)
  .map(s => s + 'transformed')
  .forEach(s => console.log(\`next => ${s}\`))</code></pre></td>
  <td><pre><code>getDataFromNetwork()
  .filter (s => s != null)
  .map(s => s + 'transformed')
  .subscribe(s => console.log(\`next => ${s}\`))</code></pre></td></tr>
 </tbody>
</table></center>

There are a number of ways of getting started with RxJS including:
- [Getting Started With RxJS](#getting-started-with-rxjs)
- [RxJS Guidelines](#rxjs-guidlines)
- [Getting to Know RxJS Libraries](#getting-to-know-rxjs-libraries)
- [How Do I?](#how-do-i)
- [Mapping RxJS from Different Libraries](#mapping-rxjs-from-different-libraries)
- [API Documentation](#reactive-extensions-class-library)

## Getting Started With RxJS

Getting started with the Reactive Extensions for JavaScript is easy.  Let's start with the basics here:

- [What are the Reactive Extensions?](gettingstarted/what.md)
- [Exploring Major Concepts in RxJS](gettingstarted/exploring.md)
- [Creating and Querying Observable Sequences](gettingstarted/creatingquerying.md)
   1. [Creating and Subscribing to Simple Observable Sequences](gettingstarted/creating.md)
   2. [Bridging to Events](gettingstarted/events.md)
   3. [Bridging to Callbacks](gettingstarted/callbacks.md)
   4. [Bridging to Promises](gettingstarted/promises.md)  
   5. [Generators and Observable Sequences](gettingstarted/generators.md)  
   6. [Querying Observable Sequences](gettingstarted/querying.md)
   7. [Error Handling With Observable Sequences](gettingstarted/errors.md)
   8. [Transducers with Observable Sequences](gettingstarted/transducers.md)
   9. [Backpressure with Observable Sequences](gettingstarted/backpressure.md)
   10. [Operators by Category](gettingstarted/categories.md)
   11. Which Operator do I use?
      - [Creation Operators](gettingstarted/which-static.md)
      - [Instance Operators](gettingstarted/which-instance.md)
- [Subjects](gettingstarted/subjects.md)
- [Scheduling and Concurrency](gettingstarted/schedulers.md)
- [Testing and Debugging](gettingstarted/testing.md)
- [Implementing Your Own Operators](gettingstarted/operators.md)

## RxJS Guidelines ##

Curious on how we designed RxJS? This is covered along with overall guidelines of how your RxJS code should operate.  In addition, we have contribution guidelines which set the bar for which we accept contributions.

- [RxJS Code of Conduct](https://github.com/Reactive-Extensions/RxJS/tree/master/code-of-conduct.md)
- [RxJS Design Guidelines](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/designguidelines)
- [RxJS Contribution Guidelines](https://github.com/Reactive-Extensions/RxJS/tree/master/contributing.md)

## Getting to Know RxJS Libraries ##

There are many libraries that make up the Reactive Extensions for JavaScript, so it may be a little daunting at first to know which ones to include.  This will serve as a guide for which libraries you might need.  For most operations you'll only need [`rx.lite.js`](libraries/lite/rx.lite.md), but you may find you need more operators, so you start with [`rx.js`](libraries/main/rx.md) and add additional files to mix in functionality as you need it.

### The complete library:
- [`rx.all.js`](libraries/main/rx.complete.md)

### Main Libraries:
- [`rx.js`](libraries/main/rx.md)
- [`rx.aggregates.js`](libraries/main/rx.aggregates.md)
- [`rx.async.js`](libraries/main/rx.async.md)
- [`rx.binding.js`](libraries/main/rx.binding.md)
- [`rx.coincidence.js`](libraries/main/rx.coincidence.md)
- [`rx.experimental.js`](libraries/main/rx.experimental.md)
- [`rx.joinpatterns.js`](libraries/main/rx.joinpatterns.md)
- [`rx.testing.js`](libraries/main/rx.testing.md)
- [`rx.time.js`](libraries/main/rx.time.md)
- [`rx.virtualtime.js`](libraries/main/rx.virtualtime.md)

### Lite Libraries:
- [`rx.lite.js`](libraries/lite/rx.lite.md)
- [`rx.lite.extras.js`](libraries/lite/rx.lite.extras.md)
- [`rx.lite.aggregates.js`](libraries/lite/rx.lite.aggregates.md)
- [`rx.lite.async.js`](libraries/lite/rx.lite.async.md)
- [`rx.lite.coincidence.js`](libraries/lite/rx.lite.coincidence.md)
- [`rx.lite.experimental.js`](libraries/lite/rx.lite.experimental.md)
- [`rx.lite.joinpatterns.js`](libraries/lite/rx.lite.joinpatterns.md)
- [`rx.lite.testing.js`](libraries/lite/rx.lite.testing.md)
- [`rx.lite.time.js`](libraries/lite/rx.lite.time.md)
- [`rx.lite.virtualtime.js`](libraries/lite/rx.lite.virtualtime.md)

### Core Libraries:
- [`rx.core.js`](libraries/core/rx.core.md)
- [`rx.core.binding.js`](libraries/core/rx.core.binding.md)
- [`rx.core.testing.js`](libraries/core/rx.core.testing.md)

## How Do I? ##

There is a large surface area with the Reactive Extensions for JavaScript, so it might be hard to know where to start.  This will serve as a guide to answer some of the more basic questions.

1. [How do I wrap an existing API?](howdoi/wrap.md)
2. [How do I integrate jQuery with RxJS?](howdoi/jquery.md)
3. [How do I integrate Angular.js with RxJS?](howdoi/angular.md)
4. [How do I create a simple event emitter?](howdoi/eventemitter.md)

## Mapping RxJS from Different Libraries ##

Converting your existing code from other libraries can be easy.  Many of the concepts you already know from popular libraries such as [Bacon.js](https://github.com/baconjs/bacon.js) and [Async.js](https://github.com/caolan/async)

1. For Bacon.js Users
    - [Why RxJS versus Bacon.js](mapping/bacon.js/whyrx.md)
    - [Comparing RxJS and Bacon.js](mapping/bacon.js/comparing.md)
2. For Async.js Users
    - [Why RxJS versus Async.js](mapping/async/whyrx.md)
    - [Comparing RxJS and Async.js](mapping/async/comparing.md)
3. For Highland.js Users
    - [Why RxJS versus Highland.js](mapping/highland/whyrx.md)
    - [Comparing RxJS and Highland.js](mapping/highland/comparing.md)

## Reactive Extensions Class Library

This section contains the reference documentation for the Reactive Extensions class library.

### Helpers

- [`Rx.config`](api/config/readme.md)
- [`Rx.helpers`](api/helpers/readme.md)

### Core
- [`Rx.Observable`](api/core/observable.md)
- [`Rx.Observer`](api/core/observer.md)
- [`Rx.Notification`](api/core/notification.md)

### Subjects

- [`Rx.AsyncSubject`](api/subjects/asyncsubject.md)
- [`Rx.BehaviorSubject`](api/subjects/behaviorsubject.md)
- [`Rx.ReplaySubject`](api/subjects/replaysubject.md)
- [`Rx.Subject`](api/subjects/subject.md)

### Schedulers

- [`Rx.HistoricalScheduler`](api/schedulers/historicalscheduler.md)
- [`Rx.Scheduler`](api/schedulers/scheduler.md)
- [`Rx.VirtualTimeScheduler`](api/schedulers/virtualtimescheduler.md)

### Disposables

- [`Rx.CompositeDisposable`](api/disposables/compositedisposable.md)
- [`Rx.Disposable`](api/disposables/disposable.md)
- [`Rx.RefCountDisposable`](api/disposables/refcountdisposable.md)
- [`Rx.SerialDisposable`](api/disposables/serialdisposable.md)
- [`Rx.SingleAssignmentDisposable`](api/disposables/singleassignmentdisposable.md)

### Testing

- [`Rx.ReactiveTest`](api/testing/reactivetest.md)
- [`Rx.Recorded`](api/testing/recorded.md)
- [`Rx.Subscription`](api/testing/subscription.md)
- [`Rx.TestScheduler`](api/testing/testscheduler.md)
