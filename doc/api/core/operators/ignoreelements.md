### `Rx.Observable.prototype.ignoreElements()`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/ignoreelements.js "View in source")

Ignores all elements in an observable sequence leaving only the termination messages.

#### Returns
*(`Observable`)*: An empty observable sequence that signals termination, successful or exceptional, of the source sequence.

#### Example
```js
var source = Rx.Observable.range(0, 10)
    .ignoreElements();

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

// => Completed
```

### Location

File:
- [`/src/core/perf/operators/ignoreelements.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/ignoreelements.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/ignoreelements.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/ignoreelements.js)
