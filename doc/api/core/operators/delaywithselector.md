### `Rx.Observable.delayWithSelector.delay([subscriptionDelay], delayDurationSelector)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/delaywithselector.js "View in source")

Time shifts the observable sequence by dueTime. The relative time intervals between the values are preserved.

#### Arguments
1. `[subscriptionDelay]` *(`Observable`)*: Sequence indicating the delay for the subscription to the source.
2. `delayDurationSelector` *(`Function`)*: Selector function to retrieve a sequence indicating the delay for each given element.

#### Returns
*(`Observable`)*: Time-shifted sequence.

#### Example
```js
/* With subscriptionDelay */
var source = Rx.Observable
    .range(0, 3)
    .delayWithSelector(
        Rx.Observable.timer(300),
        function (x) {
            return Rx.Observable.timer(x * 400);
        }
    )
    .timeInterval()
    .map(function (x) { return x.value + ':' + x.interval; });

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

// => Next: 0:300
// => Next: 1:400
// => Next: 2:400
// => Completed

/* Without subscriptionDelay */
var source = Rx.Observable
    .range(0, 3)
    .delayWithSelector(
        function (x) {
            return Rx.Observable.timer(x * 400);
        })
    .timeInterval()
    .map(function (x) { return x.value + ':' + x.interval; });

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

// => Next: 0:0
// => Next: 1:400
// => Next: 2:400
// => Completed
```
### Location

File:
- [`/src/core/linq/observable/delaywithselector.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/delaywithselector.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.time.js)

Prerequisites:
- [`rx`](https://www.npmjs.org/package/rx).time.js
    - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | rx.lite.compat.js

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/delaywithselector.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/delaywithselector.js)
