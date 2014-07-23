### `Rx.Observable.generateWithRelativeTime(initialState, condition, iterate, resultSelector, timeSelector, [scheduler])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/generatewithrelativetime.js "View in source") 

Generates an observable sequence by iterating a state from an initial state until the condition fails.

#### Arguments
1. `initialState` *(`Any`)*: Initial state.
2. `condition` *(`Function`)*: Condition to terminate generation (upon returning false).
3. `iterate` *(`Function`)*: Iteration step function.
4. `resultSelector` *(`Function`)*: Selector function for results produced in the sequence.
5. `timeSelector` *(`Function`)*: Time selector function to control the speed of values being produced each iteration, returning integer values denoting milliseconds.
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
    function (x) { return 100 * x; }
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
- [/src/core/observable/generatewithrelativetime.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/generatewithrelativetime.js)

Dist:
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)
- [rx.time.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js)

Prerequisites:
- if `rx.time.js`
    - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js) 

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](https://www.npmjs.org/package/RxJS-All)
- [`RxJS-Lite`](https://www.npmjs.org/package/RxJS-Lite)
- [`RxJS-Time`](https://www.npmjs.org/package/RxJS-Time)

Unit Tests:
- [/tests/observable/generatewithrelativetime.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/generatewithrelativetime.js)