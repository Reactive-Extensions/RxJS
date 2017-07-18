# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
### `Rx.Observable.prototype.switch()`
### `Rx.Observable.prototype.switchLatest()` *DEPRECATED*
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/switch.js "View in source")

Transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.  There is an alias for this method called `switchLatest` for browsers <IE9.

#### Returns
*(`Observable`)*: The observable sequence that at any point in time produces the elements of the most recent inner observable sequence that has been received.

#### Example
```js
var source = Rx.Observable.range(0, 3)
    .select(function (x) { return Rx.Observable.range(x, 3); })
    .switch();

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
// => Next: 3
// => Next: 4
// => Completed
```

### Location

File:
- [`/src/core/perf/operators/switch.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/switch.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/switch.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/switch.js)

* * *
