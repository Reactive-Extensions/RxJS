# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
### `Rx.Observable.prototype.let(func)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/let.js "View in source")

Returns an observable sequence that is the result of invoking the selector on the source sequence, without sharing subscriptions.

This operator allows for a fluent style of writing queries that use the same sequence multiple times.  There is an alias of `letBind` for browsers older than IE 9.

#### Arguments
1. `func` *(`Function`)*: Selector function which can use the source sequence as many times as needed, without sharing subscriptions to the source sequence.

#### Returns
*(`Observable`)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.

#### Example
```js
var obs = Rx.Observable.range(1, 3);

var source = obs.let(function (o) { return o.concat(o); });

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

// => Next: 1
// => Next: 2
// => Next: 3
// => Next: 1
// => Next: 2
// => Next: 3
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/let.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/let.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.experimental.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.experimental.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All)
- [`RxJS-Experimental`](http://www.nuget.org/packages/RxJS-Experimental)

Unit Tests:
- [`/tests/observable/let.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/let.js)
