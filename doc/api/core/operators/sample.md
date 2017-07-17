# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
### `Rx.Observable.prototype.sample(interval | sampleObservable)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/sample.js "View in source")

Samples the observable sequence at each interval.

#### Arguments
1. `[interval]` *(`Number`)*: Interval at which to sample (specified as an integer denoting milliseconds)
2. `[sampleObservable]` *(`Observable`)*: Sampler Observable.
3. `[scheduler=Rx.Scheduler.timeout]` *(`Scheduler`)*: Scheduler to run the sampling timer on. If not specified, the timeout scheduler is used.

#### Returns
*(`Observable`)*: Sampled observable sequence.

#### Example
```js
/* With an interval time */
var source = Rx.Observable.interval(1000)
    .sample(5000)
    .take(2);

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

// => Next: 4
// => Next: 9
// => Completed

/* With a sampler */
var source = Rx.Observable.interval(1000)
    .sample(Rx.Observable.interval(5000))
    .take(2);

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

// => Next: 4
// => Next: 9
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/sample.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/sample.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.time.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- If using `rx.time.js`
    - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/sample.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/sample.js)
