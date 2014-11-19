### `Rx.Observable.fromCallback(func, [context], [selector])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/fromcallback.js "View in source")

Converts a callback function to an observable sequence.

#### Arguments
1. `func` *(`Function`)*: Function with a callback as the last parameter to convert to an Observable sequence.
2. `[context]` *(`Any`)*: The context for the func parameter to be executed.  If not specified, defaults to undefined.
3. `[selector]` *(`Function`)*: A selector which takes the arguments from the callback to produce a single item to yield on next.

#### Returns
*(`Function`)*: A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array if no selector given, else the object created by the selector function.

#### Example
```js
var fs = require('fs'),
    Rx = require('rx');

// Wrap fs.exists
var exists = Rx.Observable.fromCallback(fs.exists);

// Check if file.txt exists
var source = exists('file.txt');

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + result);
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

// => Next: true
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/fromcallback.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/fromcallback.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
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
- [`RxJS-Complete`](http://www.nuget.org/packages/RxJS-Complete)
- [`RxJS-Async`](http://www.nuget.org/packages/RxJS-Async)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [/tests/observable/fromcallback.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/fromcallback.js)
