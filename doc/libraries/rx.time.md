# RxJS Time Module #

The Reactive Extensions for JavaScript, as it is a library that deals with events over time, naturally has a large number of operators that allow the creation of sequences at given timers, in addition to capturing time stamp and time interval information.  In addition, you can also check for timeouts on your operations.  This also supports windows and buffers with time.

## Details ##

Files:
- `rx.time.js`

NPM Packages:
- `rx`

NuGet Packages:
- `RxJS-Time`

File Dependencies:
- `rx.js` | `rx.compat.js` | `rx.lite.js` | `rx.lite.compat.js`

NPM Dependencies:
- <None>

NuGet Dependencies:
- RxJS-Main

## Included Observable Operators ##

### `Observable Methods`
- [`generateWithAbsoluteTime`](../api/core/observable.md#rxobservablegeneratewithabsolutetimeinitialstate-condition-iterate-resultselector-timeselector-scheduler)
- [`generateWithRelativeTime`](../api/core/observable.md#rxobservablegeneratewithrelativetimeinitialstate-condition-iterate-resultselector-timeselector-scheduler)
- [`interval`](../api/core/observable.md#rxobservableintervalperiod-scheduler)
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
