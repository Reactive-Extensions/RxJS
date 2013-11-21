# RxJS <sup>v2.2</sup>

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
      <td>Iterables (Array | Set | Map | Object)</td>
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
  .filter (function (s) { return s != null; })
  .map( function (s) { return s + 'transformed'; })
  .forEach(function (s) { console.log('next => '' + it); })</code></pre></td>
  <td><pre><code>getDataFromNetwork()
  .filter (function (s) { return s != null; })
  .map( function (s) { return s + 'transformed'; })
  .subscribe(function (s) { console.log('next => '' + it); })</code></pre></td></tr>
 </tbody>
</table></center>

There are a number of ways of getting started with RxJS including:
- [Getting Started With RxJS](https://github.com/Reactive-Extensions/RxJS/tree/master/doc#getting-started-with-rxjs)
- [Getting to Know RxJS Libraries](https://github.com/Reactive-Extensions/RxJS/tree/master/doc#getting-to-know-rxjs-libraries)
- [How Do I?](https://github.com/Reactive-Extensions/RxJS/tree/master/doc#how-do-i)
- [Mapping RxJS from Different Libraries](https://github.com/Reactive-Extensions/RxJS/tree/master/doc#mapping-rxjs-from-different-libraries)
- [API Documentation](https://github.com/Reactive-Extensions/RxJS/tree/master/doc#reactive-extensions-class-library)

## Getting Started With RxJS

Getting started with the Reactive Extensions for JavaScript is easy.  Let's start with the basics here:

- [What are the Reactive Extensions?](gettingstarted/what.md)
- [Exploring Major Concepts in RxJS](gettingstarted/exploring.md)
- [Creating and Querying Observable Sequences](gettingstarted/creatingquerying.md)
   1. [Creating and Subscribing to Simple Observable Sequences](gettingstarted/creating.md)
   2. [Bridging to Events](gettingstarted/events.md)
   3. [Bridging to Callbacks and Promises](gettingstarted/callbacks.md)
   4. [Querying Observable Sequences](gettingstarted/querying.md)
   5. [Operators by Category](gettingstarted/categories.md)
- [Subjects](gettingstarted/subjects.md)
- [Scheduling and Concurrency](gettingstarted/schedulers.md)
- [Testing and Debugging](gettingstarted/testing.md)
- [Implementing Your Own Operators](gettingstarted/operators.md)

## Getting to Know RxJS Libraries ##

There are many libraries that make up the Reactive Extensions for JavaScript, so it may be a little daunting at first to know which ones to include.  This will serve as a guide for which libraries you might need.  For most operations you'll only need the newly defined [RxJS-Lite](libraries/rx.lite.md), but you may find you need more operators, so you start with [RxJS Core](libraries/rx.md) and add additional files to mix in functionality as you need it.

- [rx.lite.js](libraries/rx.lite.md)
- [rx.js](libraries/rx.md)
- [rx.async.js](libraries/rx.async.md)
- [rx.binding.js](libraries/rx.binding.md)
- [rx.coincidence.js](libraries/rx.coincidence.md)
- [rx.experimental.js](libraries/rx.experimental.md)
- [rx.joinpatterns.js](libraries/rx.joinpatterns.md)
- [rx.node.js](libraries/rx.node.md)
- [rx.testing.js](libraries/rx.testing.md)
- [rx.time.js](libraries/rx.time.md)
- [rx.virtualtime.js](libraries/rx.virtualtime.md)

## How Do I? ##

There is a large surface area with the Reactive Extensions for JavaScript, so it might be hard to know where to start.  This will serve as a guide to answer some of the more basic questions.

1. [How do I wrap an existing API?](howdoi/wrap.md)
2. [How do I integrate jQuery with RxJS?](howdoi/jquery.md)
3. [How do I integrate Angular.js with RxJS?](howdoi/angular.md)

## Mapping RxJS from Different Libraries ##

Converting your existing code from other libraries can be easy.  Many of the concepts you already know from popular libraries such as [Bacon.js](https://github.com/baconjs/bacon.js) and [Async.js](https://github.com/caolan/async)

1. [For Bacon.js Users](mapping/baconjs.md)
2. [For Async.js Users](mapping/asyncjs.md)

## Reactive Extensions Class Library

This section contains the reference documentation for the Reactive Extensions class library.

### Core Objects

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

### Node.js Interop

- [`Rx.Node`](api/nodejs/nodejs.md)
