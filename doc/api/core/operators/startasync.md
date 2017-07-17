# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
### `Rx.Observable.startAsync(functionAsync)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/startasync.js "View in source")

Invokes the asynchronous function, surfacing the result through an observable sequence.

### Arguments
1. `functionAsync` *(`Function`)*: Asynchronous function which returns a Promise to run.

#### Returns
*(`Observable`)*: An observable sequence exposing the function's Promises's value or error.

#### Example
```js
var source = Rx.Observable.startAsync(function () {
    return RSVP.Promise.resolve(42);
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

// => Next: 42
// => Completed
```

### Location

File:
- [/src/core/linq/observable/startasync.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/startasync.js)

Dist:
- [`rx.async.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.async.js)
- [`rx.async.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.async.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- If using `rx.async.js` | `rx.async.compat.js`
    - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
    - [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.binding.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Async`](http://www.nuget.org/packages/RxJS-Async)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [/tests/observable/startasync.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/start.js)
