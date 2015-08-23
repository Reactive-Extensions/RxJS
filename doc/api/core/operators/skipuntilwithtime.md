### `Rx.Observable.prototype.skipUntilWithTime(startTime, [scheduler])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/skipuntilwithtime.js "View in source")

Skips elements from the observable source sequence until the specified start time, using the specified scheduler to run timers.

Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the start time.

#### Arguments
1. `startTime` *(`Date` | `Number`)*: Time to start taking elements from the source sequence. If this value is less than or equal to current time, no elements will be skipped.
2. [`scheduler = Rx.Scheduler.timeout`] *(`Scheduler`)*: Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.

#### Returns
*(`Observable`)*: An observable sequence with the elements skipped until the specified start time.

#### Example
```js
// Using relative time
var source = Rx.Observable.timer(0, 1000)
    .skipUntilWithTime(5000);

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

// => Next: 6
// => Next: 7
// => Next: 8
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/skipuntilwithtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/skipuntilwithtime.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.time.js)

Prerequisites:
- If using `rx.time.js`
  - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)

Unit Tests:
- [`/tests/observable/skipuntilwithtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/skipuntilwithtime.js)
