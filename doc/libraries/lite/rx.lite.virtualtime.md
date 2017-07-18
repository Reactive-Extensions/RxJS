# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
# RxJS Virtual Time Module #

The Reactive Extensions for JavaScript supports a notion of virtual time, which allows you to mock time easily, or even run through historical data through the `HistoricalScheduler`. This module is designed to work with the `rx-lite` NPM module for both the standards-compliant version as well as compat for older browsers.

## Details ##

Files:
- [`rx.lite.virtualtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/modules/rx-lite-virtualtime/rx.lite.virtualtime.js)
- [`rx.lite.virtualtime.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/modules/rx-lite-virtualtime-compat/rx.lite.virtualtime.compat.js)

NPM Packages:
- [`rx-lite-virtualtime`](https://www.npmjs.org/package/rx-lite-virtualtime)
- [`rx-lite-virtualtime-compat`](https://www.npmjs.org/package/rx-lite-virtualtime-compat)

File Dependencies:
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

## Included Classes ##

### Schedulers

- [`Rx.HistoricalScheduler`](../../api/schedulers/historicalscheduler.md)
- [`Rx.VirtualTimeScheduler`](../../api/schedulers/virtualtimescheduler.md)
