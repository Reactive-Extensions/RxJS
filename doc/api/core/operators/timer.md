### `Rx.Observable.timer(dueTime, [period], [scheduler])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/timer.js "View in source")

Returns an observable sequence that produces a value after dueTime has elapsed and then after each period.  Note for `rx.lite.js`, only
relative time is supported.

### Arguments
1. `dueTime` *(Date|Number)*: Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) at which to produce the first value.
2. `[period|scheduler=Rx.Scheduler.timeout]` *(Number|Scheduler)*: Period to produce subsequent values (specified as an integer denoting milliseconds), or the scheduler to run the timer on. If not specified, the resulting timer is not recurring.
3. `[scheduler=Rx.Scheduler.timeout]` *(`Scheduler`)*: Scheduler to run the timer on. If not specified, the timeout scheduler is used.

#### Returns
*(`Observable`)*: An observable sequence that produces a value after due time has elapsed and then each period.

#### Example
```js
var source = Rx.Observable.timer(200, 100)
    .timeInterval()
    .pluck('interval')
    .take(3);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

// => Next: 200
// => Next: 100
// => Next: 100
// => Completed
```

### Location

File:
- [/src/core/linq/observable/timer.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/timer.js)
- [/src/core/linq/observable/timer-lite.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/timer-lite.js)

Dist:
- [rx.all.js](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [rx.all.compat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [rx.time.js](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.time.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- [`rx`](https://www.npmjs.org/package/rx).time.js
    - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | rx.lite.compat.js

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [/tests/observable/timer.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/timer.js)
