### `Rx.Observable.prototype.toWeakMap(keySelector, [elementSelector])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/toweakmap.js "View in source") 

Converts the observable sequence to a WeakMap if it exists.  Note that this only works in an ES6 environment.

#### Arguments
1. `keySelector` *(`Function`)*: A function which produces the key for the WeakMap.
2. `[elementSelector]` *(`Function`)*: An optional function which produces the element for the WeakMap. If not present, defaults to the value from the observable sequence.

#### Returns
*(`Observable`)*: An observable sequence with a single value of a WeakMap containing the values from the observable sequence.

#### Example
```js
var source = Rx.Observable.timer(0, 1000)
    .take(5)
    .toWeakMap(function (x) { return x * 2; }, function (x) { return x * 4; });
    
var subscription = source.subscribe(
    function (x) {
        var arr = [];
        x.forEach(function (value, key) { arr.push(value, key); })
        console.log('Next: ' + arr);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: [0,0,2,4,4,8,6,12,8,16]
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/toweakmap.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/toweakmap.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.aggregates.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.aggregates.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

Unit Tests:
- [`/tests/observable/toweakmap.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/toweakmap.js)
