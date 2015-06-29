# RxJS Core Module #

The Reactive Extensions for JavaScript's core functionality for conforming to the RxJS contract can be found here.  This module contains only the bare essentials including Disposables, Schedulers, Observer and Observable.  This is made available with the `rx.core.js` file.  The primary use case for this file is for those who want to implement a minimal implementation of RxJS for their own usage.

## Details ##

Files:
- [`rx.core.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.core.js)

NPM Packages:
- _None_

NuGet Packages:
- _None_

## Included Classes ##

### Core Objects

- [`Rx.Observer`](../api/core/observer.md)
- [`Rx.Observable`](../api/core/observable.md)

### `Observable Methods`
- [`create`](../api/core/operators/create.md)

### Schedulers

- [`Rx.Scheduler`](../api/schedulers/scheduler.md)

### Disposables

- [`Rx.CompositeDisposable`](../api/disposables/compositedisposable.md)
- [`Rx.Disposable`](../api/disposables/disposable.md)
- [`Rx.SerialDisposable`](../api/disposables/serialdisposable.md)
- [`Rx.SingleAssignmentDisposable`](../api/disposables/singleassignmentdisposable.md)
