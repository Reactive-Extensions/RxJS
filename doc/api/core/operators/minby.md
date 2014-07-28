### `Rx.Observable.prototype.minBy(keySelector, [comparer])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/minby.js "View in source") 

Returns the elements in an observable sequence with the minimum key value according to the specified comparer.

#### Arguments
1. `keySelector` *(`Function`)*: Key selector function.
2. `[comparer]` *(`Function`)*:  Comparer used to compare elements.
 
#### Returns
*(`Observable`)*: An observable sequence containing a list of zero or more elements that have a minimum key value.

#### Example
```js
/* Without comparer */
var source = Rx.Observable.fromArray([1,3,5,7,9,2,4,6,8,1])
    .minBy(function (x) { return x; });

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

// => Next: 1,1
// => Completed 
```

### Location

File:
- [`/src/core/observable/minby.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/minby.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.aggregates.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js)

Prerequisites:
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

Unit Tests:
- [`/tests/observable/minby.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/minby.js)