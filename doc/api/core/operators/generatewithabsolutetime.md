### `Rx.Observable.generateWithAbsoluteTime(initialState, condition, iterate, resultSelector, timeSelector, [scheduler])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/generatewithabsolutetime.js "View in source")

Generates an observable sequence by iterating a state from an initial state until the condition fails.

#### Arguments
1. `initialState` *(`Any`)*: Initial state.
2. `condition` *(`Function`)*: Condition to terminate generation (upon returning false).
3. `iterate` *(`Function`)*: Iteration step function.
4. `resultSelector` *(`Function`)*: Selector function for results produced in the sequence.
5. `timeSelector` *(`Function`)*: Time selector function to control the speed of values being produced each iteration, returning Date values.
6. `[scheduler=Rx.Scheduler.timeout]` *(`Scheduler`)*: Scheduler on which to run the generator loop. If not provided, defaults to Scheduler.timeout.

#### Returns
*(`Observable`)*: The generated sequence.

#### Example
```js
// Generate a value with an absolute time with an offset of 100ms multipled by value
var source = Rx.Observable.generate(
    1,
    function (x) { return x < 4; },
    function (x) { return x + 1; },
    function (x) { return x; },
    function (x) { return Date.now() + (100 * x); }
).timeInterval();

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

// => Next: {value: 1, interval: 100}
// => Next: {value: 2, interval: 200}
// => Next: {value: 3, interval: 300}
// => Completed
```

### Location

File:
- [/src/core/linq/observable/generatewithabsolutetime.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/generatewithabsolutetime.js)

Dist:
- [rx.time.js](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.time.js)

Prerequisites:
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.time.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](https://www.npmjs.org/package/RxJS-All)
- [`RxJS-Time`](https://www.npmjs.org/package/RxJS-Time)

Unit Tests:
- [/tests/observable/generatewithabsolutetime.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/generatewithabsolutetime.js)
