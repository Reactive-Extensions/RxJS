# RxJS Time Module #

The Reactive Extensions for JavaScript, as it is a library that deals with events over time, naturally has a large number of operators that allow the creation of sequences at given timers, in addition to capturing time stamp and time interval information.  In addition, you can also check for timeouts on your operations.  This also supports windows and buffers with time.

## Details ##

Files:
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.time.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)

File Dependencies:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NuGet Dependencies:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

## Included Observable Operators ##

### `Observable Methods`
- [`generateWithAbsoluteTime`](../api/core/operators/generatewithabsolutetime.md)
- [`generateWithRelativeTime`](../api/core/operators/generatewithrelativetime.md)
- [`interval`](../api/core/operators/generatewithrelativetime.md)
- [`timer`](../api/core/operators/timer.md)


### `Observable Instance Methods`
- [`bufferWithTime`](../api/core/operators/bufferwithtime.md)
- [`bufferWithTimeOrCount`](../api/core/operators/bufferwithtimeorcount.md)
- [`delay`](../api/core/operators/delay.md)
- [`delayWithSelector`](../api/core/operators/delaywithselector.md)
- [`sample`](../api/core/operators/sample.md)
- [`skipLastWithTime`](../api/core/operators/skiplastwithtime.md)
- [`takeLastBufferWithTime`](../api/core/operators/takelastbufferwithtime.md)
- [`takeLastWithTime`](../api/core/operators/takelastwithtime.md)
- [`throttleWithSelector`](../api/core/operators/throttlewithselector.md)
- [`timeInterval`](../api/core/operators/timeinterval.md)
- [`timeout`](../api/core/operators/timeout.md)
- [`timeoutWithSelector`](../api/core/operators/timeoutwithselector.md)
- [`timestamp`](../api/core/operators/timestamp.md)
- [`windowWithTime`](../api/core/operators/windowwithtime.md)
- [`windowWithTimeOrCount`](../api/core/operators/windowwithtimeorcount.md)
