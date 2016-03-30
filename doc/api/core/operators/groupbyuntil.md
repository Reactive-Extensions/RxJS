### `Rx.Observable.prototype.groupByUntil(keySelector, [elementSelector], durationSelector)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/groupbyuntil.js "View in source")

Groups the elements of an observable sequence according to a specified key selector function and comparer and selects the resulting elements by using a specified function.

#### Arguments
1. `keySelector` *(`Function`)*: A function to extract the key for each element.
2. `[elementSelector]` *(`Function`)*: A function to map each source element to an element in an observable group.
3. `durationSelector` *(`Function`)*: A function to signal the expiration of a group.

#### Returns
*(`Observable`)*: A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.

If a group's lifetime expires, a new group with the same key value can be created once an element with such a key value is encountered.

#### Example
```js
var codes = [
    { keyCode: 38}, // up
    { keyCode: 38}, // up
    { keyCode: 40}, // down
    { keyCode: 40}, // down
    { keyCode: 37}, // left
    { keyCode: 39}, // right
    { keyCode: 37}, // left
    { keyCode: 39}, // right
    { keyCode: 66}, // b
    { keyCode: 65}  // a
];

var source = Rx.Observable
    .for(codes, function (x) { return Rx.Observable.return(x).delay(1000); })
    .groupByUntil(
        function (x) { return x.keyCode; },
        function (x) { return x.keyCode; },
        function (x) { return Rx.Observable.timer(2000); });

var subscription = source.subscribe(
    function (obs) {
        // Print the count
        obs.count().subscribe(function (x) { console.log('Count: ' + x); });
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

// => Count: 2
// => Count: 2
// => Count: 1
// => Count: 1
// => Count: 1
// => Count: 1
// => Count: 1
// => Count: 1
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/groupbyuntil.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/groupbyuntil.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.coincidence.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.coincidence.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Coincidence`](http://www.nuget.org/packages/RxJS-Coincidence/)

Unit Tests:
- [`/tests/observable/groupbyuntil.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/groupbyuntil.js)
