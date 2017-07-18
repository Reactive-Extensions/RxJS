# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
# RxJS Core Module #

The Reactive Extensions for JavaScript's core functionality for conforming to the RxJS contract can be found here.  This module contains only the bare essentials including Disposables, Schedulers, Observer and Observable.  This is made available with the `rx.core.js` file.  The primary use case for this file is for those who want to implement a minimal implementation of RxJS for their own usage.

## Details ##

Files:
- [`rx.core.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.core.js)

NPM Packages:
- [`rx-core`](https://www.npmjs.com/package/rx-core)

NuGet Packages:
- _None_

## Included Classes ##

### Core Objects

- [`Rx.Observer`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observer.md)
- [`Rx.Observable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)

### `Observable Methods`
- [`create`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/create.md)

### Schedulers

- [`Rx.Scheduler`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/schedulers/scheduler.md)

### Disposables

- [`Rx.CompositeDisposable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/disposables/compositedisposable.md)
- [`Rx.Disposable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/disposables/disposable.md)
- [`Rx.SerialDisposable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/disposables/serialdisposable.md)
- [`Rx.SingleAssignmentDisposable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/disposables/singleassignmentdisposable.md)
