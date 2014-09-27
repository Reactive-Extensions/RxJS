### `Rx.Observable.prototype.takeLastBufferWithTime(duration, [scheduler])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takelastbufferwithtime.js "View in source")

Returns an array with the elements within the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.

This operator accumulates a queue with a length enough to store elements received during the initial duration window. As more elements are received, elements older than the specified duration are taken from the queue and produced on the result sequence. This causes elements to be delayed with duration.

#### Arguments
1. `duration` *(`Number`)*: Duration for taking elements from the end of the sequence.
2. `[scheduler=Rx.Scheduler.timeout]` *(`Scheduler`)*: Scheduler to run the timer on. If not specified, defaults to timeout scheduler.

#### Returns
*(`Observable`)*: An observable sequence containing a single array with the elements taken during the specified duration from the end of the source sequence.

#### Example
```js
var source = Rx.Observable
    .timer(0, 1000)
    .take(10)
    .takeLastBufferWithTime(5000);

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

// => Next: 5,6,7,8,9
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/takelastbufferwithtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takelastbufferwithtime.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-Time/)
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)

Unit Tests:
- [`/tests/observable/takelastbufferwithtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/takelastbufferwithtime.js)

* * *
