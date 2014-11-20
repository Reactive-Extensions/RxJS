### `Rx.Observable.prototype.doWhile(condition)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/dowhile.js "View in source")

Repeats source as long as condition holds emulating a do while loop.

#### Arguments
1. `condition` *(`Function`)*: The condition which determines if the source will be repeated.

#### Returns
*(`Observable`)*: An observable sequence whose observers trigger an invocation of the given observable factory function.

#### Example
```js
var i = 0;

var source = Rx.Observable.return(42).doWhile(
    function (x) { return ++i < 2; });

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
// => Next: 42
// => Completed
```
### Location

File:
- [`/src/core/linq/observable/dowhile.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/dowhile.js)

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
- [`/tests/observable/dowhile.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/dowhile.js)
