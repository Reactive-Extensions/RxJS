# RxJS Time Module #

The Reactive Extensions for JavaScript, as it is a library that deals with events over time, naturally has a large number of operators that allow the creation of sequences at given timers, in addition to capturing time stamp and time interval information.  In addition, you can also check for timeouts on your operations.  This also supports windows and buffers with time.

## Details ##

Files:
- `rx.time.js`

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)

File Dependencies:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NuGet Dependencies:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

## Included Observable Operators ##

### `Observable Methods`
- [`generateWithAbsoluteTime`](../api/core/operators/generatewithabsolutetime.md)
- [`generateWithRelativeTime`](../api/core/operators/generatewithrelativetime.md)
- [`interval`](../api/core/operators/generatewithrelativetime.md)
- [`timer`](../api/core/observable.md#rxobservabletimerduetime-period-scheduler)


### `Observable Instance Methods`
- [`bufferWithTime`](../api/core/observable.md#rxobservableprototypebufferwithtimetimespan-timeshift--scheduler-scheduler)
- [`bufferWithTimeOrCount`](../api/core/observable.md#rxobservableprototypebufferwithtimeorcounttimespan-count-scheduler)
- [`delay`](../api/core/observable.md#rxobservableprototypedelayduetime-scheduler)
- [`delayWithSelector`](../api/core/observable.md#rxobservabledelaywithselectordelaysubscriptiondelay-delaydurationselector)
- [`sample`](../api/core/observable.md#rxobservableprototypesampleinterval--sampleobservable)
- [`skipLastWithTime`](../api/core/observable.md#rxobservableprototypeskiplastwithtimeduration)
- [`takeLastBufferWithTime`](../api/core/observable.md#rxobservableprototypetakelastbufferwithtimeduration-scheduler)
- [`takeLastWithTime`](../api/core/observable.md#rxobservableprototypetakelastwithtimeduration-timescheduler-loopscheduler)
- [`throttleWithSelector`](../api/core/observable.md#rxobservableprototypethrottlewithselectorthrottleselector)
- [`timeInterval`](../api/core/observable.md#rxobservableprototypetimeintervalscheduler)
- [`timeout`](../api/core/observable.md#rxobservableprototypetimeoutduetime-other-scheduler)
- [`timeoutWithSelector`](../api/core/observable.md#rxobservableprototypetimeoutwithselectorfirsttimeout-timeoutdurationselector-other)
- [`timestamp`](../api/core/observable.md#rxobservableprototypetimestampscheduler)
- [`windowWithTime`](../api/core/observable.md#rxobservableprototypewindowwithtimetimespan-timeshift--scheduler)
- [`windowWithTimeOrCount`](../api/core/observable.md#rxobservableprototypewindowwithtimeorcounttimespan-count-scheduler)
