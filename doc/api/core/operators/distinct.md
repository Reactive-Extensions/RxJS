### `Rx.Observable.prototype.distinct([keySelector], [keySerializer])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/distinct.js "View in source") 

Returns an observable sequence that contains only distinct elements according to the keySelector and the comparer. Usage of this operator should be considered carefully due to the maintenance of an internal lookup structure which can grow large. 

#### Arguments
1. `[keySelector]` *(`Function`)*: A function to compute the comparison key for each element.
2. `[comparer]` *(`Function`)*: Used to compare objects for equality. If not provided, defaults to an equality comparer function.

#### Returns
*(`Observable`)*: An observable sequence only containing the distinct elements, based on a computed key value, from the source sequence.

#### Example
```js
/* Without key selector */
var source = Rx.Observable.fromArray([
        42, 24, 42, 24
    ])
    .distinct();

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

// => Next: 42
// => Next: 24
// => Completed 

/* With key selector */
var source = Rx.Observable.fromArray([
        {value: 42}, {value: 24}, {value: 42}, {value: 24}
    ])
    .distinct(function (x) { return x.value; });

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

// => Next: { value: 42 }
// => Next: { value: 24 }
// => Completed 
```
### Location

File:
- [`/src/core/linq/observable/distinct.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/distinct.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/distinct.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/distinct.js)