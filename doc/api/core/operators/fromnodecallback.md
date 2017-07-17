# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
### `Rx.Observable.fromNodeCallback(func, [context], [selector])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/fromnodecallback.js "View in source")

Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.

#### Arguments
1. `func` *(`Function`)*: Function with a callback as the last parameter to convert to an Observable sequence.
2. `[context]` *(`Any`)*: The context for the func parameter to be executed.  If not specified, defaults to undefined.
3. `[selector]` *(`Function`)*: A selector which takes the arguments from callback sans the error to produce a single item to yield on next.

#### Returns
*(`Function`)*: A function which when applied, returns an observable sequence with the callback arguments as an array if no selector given, else the object created by the selector function on success, or an error if the first parameter is not falsy.

#### Example
```js
var fs = require('fs'),
    Rx = require('rx');

// Wrap fs.rename
var rename = Rx.Observable.fromNodeCallback(fs.rename);

// Rename file which returns no parameters except an error
var source = rename('file1.txt', 'file2.txt');

var subscription = source.subscribe(
    function () {
        console.log('Next: success!');
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

// => Next: success!
// => Completed
```

### Location

File:
- [/src/core/perf/operators/fromnodecallback.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/fromnodecallback.js)

Dist:
- [`rx.async.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.async.js)
- [`rx.async.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.async.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- If using `rx.async.js` | `rx.async.compat.js`
    - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
    - [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.binding.js)
- [`rx`](https://www.npmjs.org/package/rx).lite.js | rx.lite.compat.js

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Async`](http://www.nuget.org/packages/RxJS-Async)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [/tests/observable/fromnodecallback.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/fromnodecallback.js)
