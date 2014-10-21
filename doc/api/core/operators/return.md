### `Rx.Observable.return(value, [scheduler])`
### `Rx.Observable.just(value, [scheduler])`
### `Rx.Observable.returnValue(value, [scheduler])` _DEPRECATED_
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/return.js "View in source")

Returns an observable sequence that contains a single element, using the specified scheduler to send out observer messages.

There is an alias called `returnValue` for browsers <IE9 and a regular alias called `just`.

### Arguments
1. `value` *(`Any`)*: Single element in the resulting observable sequence.
2. `[scheduler=Rx.Scheduler.immediate]` *(`Scheduler`)*: Scheduler to send the single element on. If not specified, defaults to Scheduler.immediate.

#### Returns
*(`Observable`)*: An observable sequence that repeats the given element the specified number of times.

#### Example
```js
var source = Rx.Observable.return(42);

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
- [`/src/core/linq/observable/return.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/return.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/return.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/return.js)
