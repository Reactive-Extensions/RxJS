# RxJS Core Module #

The Reactive Extensions for JavaScript's core functionality is in the main RxJS file which has many core components including the Schedulers, Disposables, Observable and Observer.

This comes with both `rx.js` which is for use in modern development environments such as > IE9 and server-side environments such as Node.js.  We also have `rx.compat.js` which has backwards compatibility to browsers which do not support all required ES5 features.

## Details ##

Files:
- `rx.js`
- `rx.compat.js`

NPM Packages:
- `rx`

NuGet Packages:
- `RxJS-Main`

File Dependencies:
- <None>

NPM Dependencies:
- <None>

NuGet Dependencies:
- <None>

## Included Observable Operators ##

### `Observable Methods`
- [`amb`](../api/core/observable.md#rxobservableambargs)
- [`catch | catchException`](../api/core/observable.md#rxobservablecatchargs)
- [`concat`](../api/core/observable.md#rxobservableconcatargs)
- [`create | createWithDisposable`](../api/core/observable.md#rxobservablecreatesubscribe)
- [`defer`](../api/core/observable.md#rxobservabledeferobservablefactory)
- [`empty`](../api/core/observable.md#rxobservableemptyscheduler)
- [`fromArray`](../api/core/observable.md#rxobservablefromarrayarray-scheduler)
- [`generate`](../api/core/observable.md#rxobservablegenerateinitialstate-condition-iterate-resultselector-scheduler)
- [`merge`](../api/core/observable.md#rxobservablemergescheduler-args)
- [`never`](../api/core/observable.md#rxobservablenever)
- [`onErrorResumeNext`](../api/core/observable.md#rxobservableonerrorresumenextargs)
- [`range`](../api/core/observable.md#rxobservablerangestart-count-scheduler)
- [`repeat`](../api/core/observable.md#rxobservablerepeatvalue-repeatcount-scheduler)
- [`return | returnValue`](../api/core/observable.md#rxobservablereturnvalue-scheduler)
- [`throw | throwException`](../api/core/observable.md#rxobservablethrowexception-scheduler)
- [`zip`](../api/core/observable.md#rxobservablezipargs)
- [`zipArray`](../api/core/observable.md#rxobservableziparrayargs)

### `Observable Instance Methods`
- [`amb`](../api/core/observable.md#rxobservableprototypeambrightsource)
- [`asObservable`](../api/core/observable.md#rxobservableprototypeasobservable)
- [`bufferWithCount`](../api/core/observable.md#rxobservableprototypebufferwithcountcount-skip)
- [`catch | catchException`](../api/core/observable.md#rxobservableprototypecatchsecond--handler)
- [`combineLatest`](../api/core/observable.md#rxobservableprototypecombinelatestargs-resultselector)
- [`concat`](../api/core/observable.md#rxobservableprototypeconcatargs)
- [`defaultIfEmpty`](../api/core/observable.md#rxobservableprototypedefaultifemptydefaultvalue)
- [`distinct`](../api/core/observable.md#rxobservableprototypedistinctkeyselector-keyserializer)
- [`distinctUntilChanged`](../api/core/observable.md#rxobservableprototypedistinctuntilchangedkeyselector-comparer)
- [`do | doAction`](../api/core/observable.md#rxobservableprototypedoobserver--onnext-onerror-oncompleted)
- [`filter`](../api/core/observable.md#rxobservableprototypefilterpredicate-thisarg)
- [`finally | finallyAction`](../api/core/observable.md#rxobservableprototypefinallyaction)
- [`flatMap`](../api/core/observable.md#rxobservableprototypeflatmapselector-resultselector)
- [`flatMapLatest`](../api/core/observable.md#rxobservableprototypeflatmaplatestselector-thisarg)
- [`groupBy`](../api/core/observable.md#rxobservableprototypegroupbykeyselector-elementselector-keyserializer)
- [`groupByUntil`](../api/core/observable.md#rxobservableprototypegroupbyuntilkeyselector-elementselector-durationselector-keyserializer)
- [`ignoreElements`](../api/core/observable.md#rxobservableprototypeignoreelements)
- [`map`](../api/core/observable.md#rxobservableprototypemapselector-thisarg)
- [`merge`](../api/core/observable.md#rxobservableprototypemergemaxconcurrent--other)
- [`mergeObservable | mergeAll`](../api/core/observable.md#rxobservableprototypemergeobservable)
- [`observeOn`](../api/core/observable.md#rxobservableprototypeobserveonscheduler)
- [`onErrorResumeNext`](../api/core/observable.md#rxobservableprototypeonerrorresumenextsecond)
- [`repeat`](../api/core/observable.md#rxobservableprototyperepeatrepeatcount)
- [`retry`](../api/core/observable.md#rxobservableprototyperetryretrycount)
- [`scan`](../api/core/observable.md#rxobservableprototypescanseed-accumulator)
- [`select`](../api/core/observable.md#rxobservableprototypeselectselector-thisarg)
- [`selectMany`](../api/core/observable.md#rxobservableprototypeselectmanyselector-resultselector)
- [`selectSwitch`](../api/core/observable.md#rxobservableprototypeselectswitchselector-thisarg)
- [`single`](../api/core/observable.md#rxobservableprototypesinglepredicate-thisarg)
- [`singleOrDefault`](../api/core/observable.md#rxobservableprototypesingleordefaultpredicate-defaultvalue-thisarg)
- [`skip`](../api/core/observable.md#rxobservableprototypeskipcount)
- [`skipLast`](../api/core/observable.md#rxobservableprototypeskiplastcount)
- [`skipUntil`](../api/core/observable.md#rxobservableprototypeskipuntilother)
- [`skipWhile`](../api/core/observable.md#rxobservableprototypeskipwhilepredicate-thisarg)
- [`startWith`](../api/core/observable.md#rxobservableprototypestartwithscheduler-args)
- [`subscribe`](../api/core/observable.md#rxobservableprototypesubscribeobserver--onnext-onerror-oncompleted)
- [`subscribeOn`](../api/core/observable.md#rxobservableprototypesubscribeonscheduler)
- [`switch | switchLatest`](../api/core/observable.md#rxobservableprototypeswitch)
- [`take`](../api/core/observable.md#rxobservableprototypetakecount-scheduler)
- [`takeLast`](../api/core/observable.md#rxobservableprototypetakelastcount)
- [`takeLastBuffer`](../api/core/observable.md#rxobservableprototypetakelastbuffercount)
- [`takeUntil`](../api/core/observable.md#rxobservableprototypetakeuntilother)
- [`takeWhile`](../api/core/observable.md#rxobservableprototypetakewhilepredicate-thisarg)
- [`toArray`](../api/core/observable.md#rxobservableprototypetoarray)
- [`where`](../api/core/observable.md#rxobservableprototypewherepredicate-thisarg)
- [`windowWithCount`](../api/core/observable.md#rxobservableprototypewindowwithcountcount-skip)
- [`zip`](../api/core/observable.md#rxobservableprototypezipargs-resultselector)

## Included Classes ##

### Core Objects

- [`Rx.Observer`](../api/core/observable.md../api/core/observable.mdapi/core/observer.md)
- [`Rx.Notification`](../api/core/observable.md../api/core/observable.mdapi/core/notification.md)

### Subjects

- [`Rx.AsyncSubject`](../api/core/observable.md../api/core/observable.mdapi/subjects/asyncsubject.md)
- [`Rx.Subject`](../api/core/observable.md../api/core/observable.mdapi/subjects/subject.md)

### Schedulers

- [`Rx.Scheduler`](../api/core/observable.md../api/core/observable.mdapi/schedulers/scheduler.md)

### Disposables

- [`Rx.CompositeDisposable`](../api/core/observable.md../api/core/observable.mdapi/disposables/compositedisposable.md)
- [`Rx.Disposable`](../api/core/observable.md../api/core/observable.mdapi/disposables/disposable.md)
- [`Rx.RefCountDisposable`](../api/core/observable.md../api/core/observable.mdapi/disposables/refcountdisposable.md)
- [`Rx.SerialDisposable`](../api/core/observable.md../api/core/observable.mdapi/disposables/serialdisposable.md)
- [`Rx.SingleAssignmentDisposable`](../api/core/observable.md../api/core/observable.mdapi/disposables/singleassignmentdisposable.md)
