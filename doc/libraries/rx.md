# RxJS Core Module #

The Reactive Extensions for JavaScript's core functionality is in the main RxJS file which has many core components including the Schedulers, Disposables, Observable and Observer.

This comes with both `rx.js` which is for use in modern development environments such as > IE9 and server-side environments such as Node.js.  We also have `rx.compat.js` which has backwards compatibility to browsers which do not support all required ES5 features.

## Details ##

Files:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)

## Included Observable Operators ##

### `Observable Methods`
- [`amb`](../api/core/operators/amb.md)
- [`catch | catchException`](../api/core/operators/catch.md)
- [`concat`](../api/core/operators/concat.md)
- [`create | createWithDisposable`](../api/core/operators/create.md)
- [`defer`](../api/core/operators/defer.md)
- [`empty`](../api/core/operators/empty.md)
- [`from`](../api/core/operators/from.md)
- [`fromArray`](../api/core/operators/fromarray.md)
- [`generate`](../api/core/operators/generate.md)
- [`just`](../api/core/operators/return.md)
- [`merge`](../api/core/operators/merge.md)
- [`never`](../api/core/operators/never.md)
- [`of`](../api/core/operators/of.md)
- [`of`](../api/core/operators/ofwithscheduler.md)
- [`onErrorResumeNext`](../api/core/operators/onerrorresumenext.md)
- [`range`](../api/core/operators/range.md)
- [`repeat`](../api/core/operators/repeat.md)
- [`return | returnValue`](../api/core/operators/return.md)
- [`throw | throwError | throwException`](../api/core/operators/throw.md)
- [`zip`](../api/core/operators/zip.md)
- [`zipArray`](../api/core/operators/ziparray.md)

### `Observable Instance Methods`
- [`amb`](../api/core/operators/ambproto.md)
- [`asObservable`](../api/core/operators/asobservable.md)
- [`bufferWithCount`](../api/core/operators/bufferwithcount.md)
- [`catch | catchException`](../api/core/operators/catch.md)
- [`combineLatest`](../api/core/operators/combinelatest.md)
- [`concat`](../api/core/operators/concatproto.md)
- [`concatMap`](../api/core/operators/concatmap.md)
- [`defaultIfEmpty`](../api/core/operators/defaultifempty.md)
- [`distinct`](../api/core/operators/distinct.md)
- [`distinctUntilChanged`](../api/core/operators/distinctuntilchanged.md)
- [`do | doAction`](../api/core/operators/do.md)
- [`doOnNext`](../api/core/operators/doonnext.md)
- [`doOnError`](../api/core/operators/doonerror.md)
- [`doOnCompleted`](../api/core/operators/dooncompleted.md)
- [`filter`](../api/core/operators/where.md)
- [`finally | finallyAction`](../api/core/operators/finally.md)
- [`flatMap`](../api/core/operators/selectmany.md)
- [`flatMapLatest`](../api/core/operators/flatmaplatest.md)
- [`flatMapObserver`](../api/core/operators/flatpmapobserver.md)
- [`ignoreElements`](../api/core/operators/ignoreelements.md)
- [`map`](../api/core/operators/select.md)
- [`merge`](../api/core/operators/mergeproto.md)
- [`mergeObservable | mergeAll`](../api/core/operators/mergeall.md)
- [`observeOn`](../api/core/operators/observeon.md)
- [`onErrorResumeNext`](../api/core/operators/onerrorresumenext.md)
- [`repeat`](../api/core/operators/repeatproto.md)
- [`retry`](../api/core/operators/retry.md)
- [`scan`](../api/core/operators/scan.md)
- [`select`](../api/core/operators/select.md)
- [`selectConcat`](../api/core/operators/concatmap.md)
- [`selectMany`](../api/core/operators/selectmany.md)
- [`selectManyObserver`](../api/core/operators/flatpmapobserver.md)
- [`selectSwitch`](../api/core/operators/flatmaplatest.md)
- [`single`](../api/core/operators/single.md)
- [`singleOrDefault`](../api/core/operators/singleordefault.md)
- [`skip`](../api/core/operators/skip.md)
- [`skipLast`](../api/core/operators/skiplast.md)
- [`skipUntil`](../api/core/operators/skipuntil.md)
- [`skipWhile`](../api/core/operators/skipwhile.md)
- [`startWith`](../api/core/operators/startwith.md)
- [`subscribe`](../api/core/operators/subscribe.md)
- [`subscribeOnNext`](../api/core/operators/subscribeonnext.md)
- [`subscribeOnError`](../api/core/operators/subscribeonerror.md)
- [`subscribeOnCompleted`](../api/core/operators/subscribeoncompleted.md)
- [`subscribeOn`](../api/core/operators/subscribeon.md)
- [`switch | switchLatest`](../api/core/operators/switch.md)
- [`take`](../api/core/operators/take.md)
- [`takeLast`](../api/core/operators/takelast.md)
- [`takeLastBuffer`](../api/core/operators/takelastbuffer.md)
- [`takeUntil`](../api/core/operators/takeuntil.md)
- [`takeWhile`](../api/core/operators/takewhile.md)
- [`toArray`](../api/core/operators/toarray.md)
- [`transduce`](../api/core/operators/transduce.md)
- [`where`](../api/core/operators/where.md)
- [`windowWithCount`](../api/core/operators/windowwithcount.md)
- [`zip`](../api/core/operators/zipproto.md)

## Included Classes ##

### Core Objects

- [`Rx.Observer`](../api/core/observer.md)
- [`Rx.Notification`](../api/core/notification.md)

### Subjects

- [`Rx.AsyncSubject`](../api/subjects/asyncsubject.md)
- [`Rx.Subject`](../api/subjects/subject.md)

### Schedulers

- [`Rx.Scheduler`](../api/schedulers/scheduler.md)

### Disposables

- [`Rx.CompositeDisposable`](../api/disposables/compositedisposable.md)
- [`Rx.Disposable`](../api/disposables/disposable.md)
- [`Rx.RefCountDisposable`](../api/disposables/refcountdisposable.md)
- [`Rx.SerialDisposable`](../api/disposables/serialdisposable.md)
- [`Rx.SingleAssignmentDisposable`](../api/disposables/singleassignmentdisposable.md)
