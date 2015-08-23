# RxJS Virtual Time Module #

The Reactive Extensions for JavaScript supports a notion of virtual time, which allows you to mock time easily, or even run through historical data through the `HistoricalScheduler`.

## Details ##

Files:
- [`rx.virtualtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.virtualtime.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-VirtualTime`](http://www.nuget.org/packages/RxJS-VirtualTime/)

File Dependencies:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NuGet Dependencies:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)

## Included Classes ##

### Schedulers

- [`Rx.HistoricalScheduler`](../../api/schedulers/historicalscheduler.md)
- [`Rx.VirtualTimeScheduler`](../../api/schedulers/virtualtimescheduler.md)
