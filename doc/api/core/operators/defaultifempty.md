# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
### `Rx.Observable.prototype.defaultIfEmpty([defaultValue])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/defaultifempty.js "View in source")

Returns the elements of the specified sequence or the specified value in a singleton sequence if the sequence is empty.

#### Arguments
1. `[defaultValue=null]` *(`Any`)*: The value to return if the sequence is empty. If not provided, this defaults to null.

#### Returns
*(`Observable`)*: An observable sequence that contains the specified default value if the source is empty; otherwise, the elements of the source itself.

#### Example
```js
/* Without a default value */
var source = Rx.Observable.empty().defaultIfEmpty();

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

// => Next: null
// => Completed

/* With a defaultValue */
var source = Rx.Observable.empty().defaultIfEmpty(false);

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

// => Next: false
// => Completed
```
### Location

File:
- [`/src/core/linq/observable/defaultifempty.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/defaultifempty.js)

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
- [`/tests/observable/defaultifempty.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/defaultifempty.js)
