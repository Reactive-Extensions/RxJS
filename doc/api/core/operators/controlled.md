### `Rx.Observable.prototype.controlled([enableQueue])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/backpressure/controlled.js "View in source")

Attaches a controller to the observable sequence with the ability to queue.

#### Arguments
1. `[enableQueue]` *(Boolean)*: Whether to enable queueing.  If not specified, defaults to true.

#### Returns
*(`Observable`)*: An observable sequence which can be used to request values from the sequence.

#### Example
```js
var source = Rx.Observable.range(0, 10).controlled();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

source.request(2);

// => Next: 0
// => Next: 1
```
### Location

File:
- [`/src/core/backpressure/controlled.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/backpressure/controlled.js)

Dist:
- [`rx.backpressure.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.async.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using `rx.backpressure.js`
    - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
    - [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-BackPressure`](http://www.nuget.org/packages/RxJS-BackPressure/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [/tests/observable/controlled.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/controlled.js)
