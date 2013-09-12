# RxJS <sup>v2.1</sup>

Reactive Extensions (Rx) is a library for composing asynchronous and event-based programs using observable sequences and LINQ-style query operators.

Data sequences can take many forms, such as a stream of data from a file or web service, web services requests, system notifications, or a series of events such as user input.

Reactive Extensions represents all these data sequences as observable sequences. An application can subscribe to these observable sequences to receive asynchronous notifications as new data arrive. 

## Getting Started With RxJS

- [Creating Observable Sequences](creating.md)
- [Querying Observable Sequences](querying.md)
- [Combining Observable Sequences](combining.md)
- [Error Handling](errors.md)
- [Schedulers and Testability](schedulers.md)

## Reactive Extensions Class Library

This section contains the reference documentation for the Reactive Extensions class library.

### Core Objects

- [`Rx.Observable`](observable.md)
- [`Rx.Observer`](observer.md)
- [`Rx.Notification`](notification.md)

### Subjects

- [`Rx.AsyncSubject`](asyncsubject.md)
- [`Rx.BehaviorSubject`](behaviorsubject.md)
- [`Rx.ReplaySubject`](replaysubject.md)
- [`Rx.Subject`](subject.md)

### Schedulers

- [`Rx.HistoricalScheduler`](historicalscheduler.md)
- [`Rx.Scheduler`](scheduler.md)
- [`Rx.VirtualTimeScheduler`](virtualtimescheduler.md)

### Disposables

- [`Rx.CompositeDisposable`](compositedisposable.md)
- [`Rx.Disposable`](disposable.md)
- [`Rx.RefCountDisposable`](refcountdisposable.md)
- [`Rx.SerialDisposable`](serialdisposable.md)
- [`Rx.SingleAssignmentDisposable`](singleassignmentdisposable.md)

### Testing

- [`Rx.ReactiveTest`](reactivetest.md)
- [`Rx.Recorded`](recorded.md)
- [`Rx.Subscription`](subscription.md)
- [`Rx.TestScheduler`](testscheduler.md)
