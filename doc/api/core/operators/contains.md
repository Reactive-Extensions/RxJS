### `Rx.Observable.prototype.contains(value, [comparer])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/contains.js "View in source") 

Determines whether an observable sequence contains a specified element with an optional equality comparer.

#### Arguments
1. `value` *(`Any`)*: The value to locate in the source sequence.
2. `[comparer]` *(`Function`)*: An equality comparer function to compare elements.

#### Returns
*(`Observable`)*: An observable sequence containing a single element determining whether the source sequence contains an element that has the specified value.

#### Example
```js
/* Without a comparer */
var source = Rx.Observable.return(42)
    .contains(42);
    
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

// => Next: true
// => Completed 

/* With a comparer */
var source = Rx.Observable.return({ value: 42 })
    .contains(
        { value: 42}, 
        function (x, y) { return x.value === y.value; }
    );
    
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

// => Next: true
// => Completed 
```
### Location

File:
- [`/src/core/observable/contains.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/contains.js)

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
- [`/tests/observable/contains.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/contains.js)
