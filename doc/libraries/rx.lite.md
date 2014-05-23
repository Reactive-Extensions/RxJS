# RxJS Lite Module #

The Reactive Extensions for JavaScript Lite version is a lightweight version of the Reactive Extensions for JavaScript which covers most of the day to day operators you might use all in a single library.  Functionality such as bridging to events, promises, callbacks, Node.js-style callbacks, time-based operations and more are built right in.

This comes with both `rx.lite.js` which is for use in modern development environments such as > IE9 and server-side environments such as Node.js.  We also have `rx.lite.compat.js` which has backwards compatibility to browsers which do not support all required ES5 features.

## Details ##

Files:
- `rx.lite.js`
- `rx.lite.compat.js`

NPM Packages:
- `rx-lite`

NuGet Packages:
- `RxJS-Lite`

File Dependencies:
- None

NPM Dependencies:
- None

NuGet Dependencies:
- None

## Included Observable Operators ##

### `Observable Methods`
- [`catch | catchException`](../api/core/observable.md#rxobservablecatchargs)
- [`concat`](../api/core/observable.md#rxobservableconcatargs)
- [`create | createWithDisposable`](../api/core/observable.md#rxobservablecreatesubscribe)
- [`defer`](../api/core/observable.md#rxobservabledeferobservablefactory)
- [`empty`](../api/core/observable.md#rxobservableemptyscheduler)
- [`fromArray`](../api/core/observable.md#rxobservablefromarrayarray-scheduler)
- [`fromCallback`](../api/core/observable.md#rxobservablefromcallbackfunc-scheduler-context-selector)
- [`fromEvent`](../api/core/observable.md#rxobservablefromeventelement-eventname-selector)
- [`fromEventPattern`](../api/core/observable.md#rxobservablefromeventpatternaddhandler-removehandler-selector)
- [`fromNodeCallback`](../api/core/observable.md#rxobservablefromnodecallbackfunc-scheduler-context-selector)
- [`fromPromise`](../api/core/observable.md#rxobservablefrompromisepromise)
- [`generate`](../api/core/observable.md#rxobservablegenerateinitialstate-condition-iterate-resultselector-scheduler)
- [`generateWithRelativeTime`](../api/core/observable.md#rxobservablegeneratewithrelativetimeinitialstate-condition-iterate-resultselector-timeselector-scheduler)
- [`interval`](../api/core/observable.md#rxobservableintervalperiod-scheduler)
- [`merge`](../api/core/observable.md#rxobservablemergescheduler-args)
- [`never`](../api/core/observable.md#rxobservablenever)
- [`range`](../api/core/observable.md#rxobservablerangestart-count-scheduler)
- [`repeat`](../api/core/observable.md#rxobservablerepeatvalue-repeatcount-scheduler)
- [`return | returnValue`](../api/core/observable.md#rxobservablereturnvalue-scheduler)
- [`throw | throwException`](../api/core/observable.md#rxobservablethrowexception-scheduler)
- [`timer`](../api/core/observable.md#rxobservabletimerduetime-period-scheduler)
- [`zip`](../api/core/observable.md#rxobservablezipargs)
- [`zipArray`](../api/core/observable.md#rxobservableziparrayargs)

### `Observable Instance Methods`
- [`asObservable`](../api/core/observable.md#rxobservableprototypeasobservable)
- [`catch | catchException`](../api/core/observable.md#rxobservableprototypecatchsecond--handler)
- [`combineLatest`](../api/core/observable.md#rxobservableprototypecombinelatestargs-resultselector)
- [`concat`](../api/core/observable.md#rxobservableprototypeconcatargs)
- [`concatMap`](../api/core/observable.md#rxobservableprototypeconcatmapselector-resultselector)
- [`connect`](../api/core/observable.md#connectableobservableprototypeconnect)
- [`defaultIfEmpty`](../api/core/observable.md#rxobservableprototypedefaultifemptydefaultvalue)
- [`delay`](../api/core/observable.md#rxobservableprototypedelayduetime-scheduler)
- [`delayWithSelector`](../api/core/observable.md#rxobservabledelaywithselectordelaysubscriptiondelay-delaydurationselector)
- [`dematerialize`](../api/core/observable.md#rxobservableprototypedematerialize)
- [`distinctUntilChanged`](../api/core/observable.md#rxobservableprototypedistinctuntilchangedkeyselector-comparer)
- [`do | doAction`](../api/core/observable.md#rxobservableprototypedoobserver--onnext-onerror-oncompleted)
- [`filter`](../api/core/observable.md#rxobservableprototypefilterpredicate-thisarg)
- [`finally | finallyAction`](../api/core/observable.md#rxobservableprototypefinallyaction)
- [`flatMap`](../api/core/observable.md#rxobservableprototypeflatmapselector-resultselector)
- [`flatMapLatest`](../api/core/observable.md#rxobservableprototypeflatmaplatestselector-thisarg)
- [`forkJoin`](../api/core/observable.md#rxobservableprototypeforkjoinsecond-resultselector)
- [`ignoreElements`](../api/core/observable.md#rxobservableprototypeignoreelements)
- [`map`](../api/core/observable.md#rxobservableprototypemapselector-thisarg)
- [`merge`](../api/core/observable.md#rxobservableprototypemergemaxconcurrent--other)
- [`mergeObservable | mergeAll`](../api/core/observable.md#rxobservableprototypemergeobservable)
- [`multicast`](../api/core/observable.md#rxobservableprototypemulticastsubject--subjectselector-selector)
- [`publish`](../api/core/observable.md#rxobservableprototypepublishselector)
- [`publishLast`](../api/core/observable.md#rxobservableprototypepublishlatestselector)
- [`publishValue`](../api/core/observable.md#rxobservableprototypepublishvalueselector)
- [`refCount`](../api/core/observable.md#connectableobservableprototyperefcount)
- [`repeat`](../api/core/observable.md#rxobservableprototyperepeatrepeatcount)
- [`replay`](../api/core/observable.md#rxobservableprototypereplayselector-buffersize-window-scheduler)
- [`retry`](../api/core/observable.md#rxobservableprototyperetryretrycount)
- [`sample`](../api/core/observable.md#rxobservableprototypesampleinterval--sampleobservable)
- [`scan`](../api/core/observable.md#rxobservableprototypescanseed-accumulator)
- [`select`](../api/core/observable.md#rxobservableprototypeselectselector-thisarg)
- [`selectConcat`](../api/core/observable.md#rxobservableprototypeselectconcatselector-resultselector)
- [`selectMany`](../api/core/observable.md#rxobservableprototypeselectmanyselector-resultselector)
- [`selectSwitch`](../api/core/observable.md#rxobservableprototypeselectswitchselector-thisarg)
- [`skip`](../api/core/observable.md#rxobservableprototypeskipcount)
- [`skipLast`](../api/core/observable.md#rxobservableprototypeskiplastcount)
- [`skipLastWithTime`](../api/core/observable.md#rxobservableprototypeskiplastwithtimeduration)
- [`skipUntil`](../api/core/observable.md#rxobservableprototypeskipuntilother)
- [`skipWhile`](../api/core/observable.md#rxobservableprototypeskipwhilepredicate-thisarg)
- [`startWith`](../api/core/observable.md#rxobservableprototypestartwithscheduler-args)
- [`subscribe`](../api/core/observable.md#rxobservableprototypesubscribeobserver--onnext-onerror-oncompleted)
- [`switch | switchLatest`](../api/core/observable.md#rxobservableprototypeswitch)
- [`take`](../api/core/observable.md#rxobservableprototypetakecount-scheduler)
- [`takeLast`](../api/core/observable.md#rxobservableprototypetakelastcount)
- [`takeLastBuffer`](../api/core/observable.md#rxobservableprototypetakelastbuffercount)
- [`takeLastBufferWithTime`](../api/core/observable.md#rxobservableprototypetakelastbufferwithtimeduration-scheduler)
- [`takeLastWithTime`](../api/core/observable.md#rxobservableprototypetakelastwithtimeduration-timescheduler-loopscheduler)
- [`takeUntil`](../api/core/observable.md#rxobservableprototypetakeuntilother)
- [`takeWhile`](../api/core/observable.md#rxobservableprototypetakewhilepredicate-thisarg)
- [`throttle`](../api/core/observable.md#rxobservableprototypethrottleduetime-scheduler)
- [`throttleWithSelector`](../api/core/observable.md#rxobservableprototypethrottlewithselectorthrottleselector)
- [`timeInterval`](../api/core/observable.md#rxobservableprototypetimeintervalscheduler)
- [`timeout`](../api/core/observable.md#rxobservableprototypetimeoutduetime-other-scheduler)
- [`timeoutWithSelector`](../api/core/observable.md#rxobservableprototypetimeoutwithselectorfirsttimeout-timeoutdurationselector-other)
- [`timestamp`](../api/core/observable.md#rxobservableprototypetimestampscheduler)
- [`toArray`](../api/core/observable.md#rxobservableprototypetoarray)
- [`where`](../api/core/observable.md#rxobservableprototypewherepredicate-thisarg)
- [`zip`](../api/core/observable.md#rxobservableprototypezipargs-resultselector)

## Included Classes ##

### Core Objects
- [`Rx.Observer`](../api/core/observer.md)
- [`Rx.Notification`](../api/core/notification.md)

### Subjects

- [`Rx.AsyncSubject`](../api/subjects/asyncsubject.md)
- [`Rx.BehaviorSubject`](../api/subjects/behaviorsubject.md)
- [`Rx.ReplaySubject`](../api/subjects/replaysubject.md)
- [`Rx.Subject`](../api/subjects/subject.md)

### Schedulers

- [`Rx.Scheduler`](../api/schedulers/scheduler.md)

### Disposables

- [`Rx.CompositeDisposable`](../api/disposables/compositedisposable.md)
- [`Rx.Disposable`](../api/disposables/disposable.md)
- [`Rx.RefCountDisposable`](../api/disposables/refcountdisposable.md)
- [`Rx.SerialDisposable`](../api/disposables/serialdisposable.md)
- [`Rx.SingleAssignmentDisposable`](../api/disposables/singleassignmentdisposable.md)
