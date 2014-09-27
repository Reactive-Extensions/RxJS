### `Rx.Observable.prototype.isEmpty()`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/isempty.js "View in source")

Determines whether an observable sequence is empty.

#### Returns
*(`Observable`)*: An observable sequence containing a single element determining whether the source sequence is empty.

#### Example
```js
/* Not empty */
var source = Rx.Observable.range(0, 5)
    .isEmpty()

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

// => Next: false
// => Completed

/* Empty */
var source = Rx.Observable.empty()
    .isEmpty()

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

// => Next: true
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/isempty.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/isempty.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.all.js)
- [`rx.aggregates.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

Unit Tests:
- [`/tests/observable/isempty.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/isempty.js)
