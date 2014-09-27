### `Rx.Observable.prototype.elementAtOrDefault(index, [defaultValue])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/elementatordefault.js "View in source")

Returns the element at a specified index in a sequence.

#### Arguments
1. `index` *(`Number`)*: The zero-based index of the element to retrieve.
2. `[defaultValue = null]` *(`Any`)*: The default value if the index is outside the bounds of the source sequence.

#### Returns
*(`Observable`)*: An observable sequence that produces the element at the specified position in the source sequence, or a default value if the index is outside the bounds of the source sequence.

#### Example
```js
/* Finds an index */
var source = Rx.Observable.fromArray([1,2,3,4])
    .elementAt(1);

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

// => Next: 2
// => Completed

/* Not found */
var source = Rx.Observable.fromArray([1,2,3,4])
    .elementAt(4, 0);

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
// => Completed
```
### Location

File:
- [`/src/core/linq/observable/elementatordefault.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/elementatordefault.js)

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
- [`/tests/observable/elementatordefault.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/elementatordefault.js)
