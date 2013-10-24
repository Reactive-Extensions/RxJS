# RxJS <sup>v2.2</sup>

Reactive Extensions (Rx) is a library for composing asynchronous and event-based programs using observable sequences and LINQ-style query operators.

Data sequences can take many forms, such as a stream of data from a file or web service, web services requests, system notifications, or a series of events such as user input.

Reactive Extensions represents all these data sequences as observable sequences. An application can subscribe to these observable sequences to receive asynchronous notifications as new data arrive. 

RxJS has no dependencies which complements and interoperates smoothly with both synchronous data streams such as iterable objects in JavaScript and single-value asynchronous computations such as Promises as the following diagram shows:
  	
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

There are a number of ways of getting started with RxJS including:
- [Getting Started With RxJS](https://github.com/Reactive-Extensions/RxJS/tree/master/doc#getting-started-with-rxjs)
- [How Do I?](https://github.com/Reactive-Extensions/RxJS/tree/master/doc#how-do-i)
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

## How Do I? ##

There is a large surface area with the Reactive Extensions for JavaScript, so it might be hard to know where to start.  This will serve as a guide to answer some of the more basic questions.

1. [How do I wrap an existing API?](howdoi/wrap.md)

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
