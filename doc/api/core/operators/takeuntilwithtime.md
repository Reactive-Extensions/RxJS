### <a id="rxobservableprototypetakeuntilwithtimeendtime-scheduler"></a>`Rx.Observable.prototype.takeUntilWithTime(endTime, [scheduler])`
<a href="#rxobservableprototypetakeuntilwithtimeendtime-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takeuntil.js "View in source")

Returns the values from the source observable sequence until the end time.

#### Arguments
1. `endTime` *(`Date` | `Number`)*: Time to stop taking elements from the source sequence. If this value is less than or equal to the current time, the result stream will complete immediately.
2. [`scheduler`] *(`Scheduler`)*: Scheduler to run the timer on.

#### Returns
*(`Observable`)*: An observable sequence with the elements taken until the specified end time.

#### Example
```js
var source = Rx.Observable.timer(0, 1000)
    .takeUntilWithTime(5000);

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

// => Next: 0
// => Next: 1
// => Next: 2
// => Next: 3
// => Next: 4
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/takeuntilwithtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takeuntilwithtime.js)

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
- [`/tests/observable/takeuntilwithtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/takeuntilwithtime.js)
