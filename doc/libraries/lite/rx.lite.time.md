# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
# RxJS Lite Time Module #

The Reactive Extensions for JavaScript, as it is a library that deals with events over time, naturally has a large number of operators that allow the creation of sequences at given timers, in addition to capturing time stamp and time interval information.  In addition, you can also check for timeouts on your operations.  This also supports windows and buffers with time. This module is designed to work with the `rx-lite` NPM module for both the standards-compliant version as well as compat for older browsers.

## Details ##

Files:
- [`rx.lite.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/modules/rx-lite-time/rx.lite.time.js)
- [`rx.lite.time.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/modules/rx-lite-time-compat/rx.lite.time.compat.js)

NPM Packages:
- [`rx-lite-time`](https://www.npmjs.org/package/rx-lite-time)
- [`rx-lite-time-compat`](https://www.npmjs.org/package/rx-lite-time-compat)

File Dependencies:
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

## Included Observable Operators ##

### `Observable Methods`
- [`generateWithAbsoluteTime`](../../api/core/operators/generatewithabsolutetime.md)
- [`generateWithRelativeTime`](../../api/core/operators/generatewithrelativetime.md)

### `Observable Instance Methods`
- [`bufferWithTime`](../../api/core/operators/bufferwithtime.md)
- [`bufferWithTimeOrCount`](../../api/core/operators/bufferwithtimeorcount.md)
- [`delaySubscription`](../../api/core/operators/delaysubscription.md)
- [`sample`](../../api/core/operators/sample.md)
- [`skipLastWithTime`](../../api/core/operators/skiplastwithtime.md)
- [`takeLastBufferWithTime`](../../api/core/operators/takelastbufferwithtime.md)
- [`takeLastWithTime`](../../api/core/operators/takelastwithtime.md)
- [`timeInterval`](../../api/core/operators/timeinterval.md)
- [`timeout`](../../api/core/operators/timeout.md)
- [`timeoutWithSelector`](../../api/core/operators/timeoutwithselector.md)
- [`timestamp`](../../api/core/operators/timestamp.md)
- [`windowWithTime`](../../api/core/operators/windowwithtime.md)
- [`windowWithTimeOrCount`](../../api/core/operators/windowwithtimeorcount.md)
