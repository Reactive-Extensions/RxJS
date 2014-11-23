### `Rx.Observable.prototype.timeoutwithselector([firstTimeout], timeoutDurationSelector, [other])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/timeoutwithselector.js "View in source")

Returns the source observable sequence, switching to the other observable sequence if a timeout is signaled.

#### Arguments
1. `[firstTimeout=Rx.Observable.never()]` *(`Observable`)*: Observable sequence that represents the timeout for the first element. If not provided, this defaults to `Rx.Observable.never()`.
2. `timeoutDurationSelector` *(`Function`)*: Selector to retrieve an observable sequence that represents the timeout between the current element and the next element.
3. `[other=Rx.Observable.throw]` *(`Scheduler`)*:Sequence to return in case of a timeout. If not provided, this is set to `Observable.throw`

#### Returns
*(`Observable`)*: The source sequence switching to the other sequence in case of a timeout.

#### Example
```js
/* without a first timeout */
var array = [
    200,
    300,
    350,
    400
];

var source = Rx.Observable
    .for(array, function (x) {
        return Rx.Observable.timer(x);
    })
    .map(function (x, i) { return i; })
    .timeoutWithSelector(function (x) {
        return Rx.Observable.timer(400);
    });

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
// => Error: Error: Timeout

/* With no other */
var array = [
    200,
    300,
    350,
    400
];

var source = Rx.Observable
    .for(array, function (x) {
        return Rx.Observable.timer(x);
    })
    .map(function (x, i) { return i; })
    .timeoutWithSelector(Rx.Observable.timer(250), function (x) {
        return Rx.Observable.timer(400);
    });

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
// => Error: Error: Timeout

/* With other */
var array = [
    200,
    300,
    350,
    400
];

var source = Rx.Observable
    .for(array, function (x) {
        return Rx.Observable.timer(x);
    })
    .map(function (x, i) { return i; })
    .timeoutWithSelector(Rx.Observable.timer(250), function (x) {
        return Rx.Observable.timer(400);
    }, Rx.Observable.return(42));

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
// => Next: 42
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/timeoutwithselector.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/timeoutwithselector.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.time.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)

Unit Tests:
- [`/tests/observable/timeoutwithselector.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/timeoutwithselector.js)
