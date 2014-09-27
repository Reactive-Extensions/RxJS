### `Rx.Observable.start(func, [scheduler], [context])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/start.js "View in source")

Invokes the specified function asynchronously on the specified scheduler, surfacing the result through an observable sequence.

### Arguments
1. `func` *(`Function`)*: Function to run asynchronously.
2. `[scheduler=Rx.Scheduler.timeout]` *(`Scheduler`)*: Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
3. `[context]` *(`Any`)*: The context for the func parameter to be executed.  If not specified, defaults to undefined.

#### Returns
*(`Observable`)*: An observable sequence exposing the function's result value, or an exception.

#### Example
```js
var context = { value: 42 };

var source = Rx.Observable.start(
    function () {
        return this.value;
    },
    Rx.Scheduler.timeout,
    context
);

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

// => Next: 42
// => Completed
```

### Location

File:
- [/src/core/linq/observable/start.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/start.js)

Dist:
- [`rx.async.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.async.js)
- [`rx.async.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.async.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using rx.async.js | rx.async.compat.js
    - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
    - [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All)
- [`RxJS-Async`](http://www.nuget.org/packages/RxJS-Async)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [/tests/observable/start.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/start.js)
