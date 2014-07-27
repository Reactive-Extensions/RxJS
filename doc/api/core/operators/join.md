### `Rx.Observable.prototype.join(right, leftDurationSelector, rightDurationSelector, resultSelector)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/observable/join.js "View in source") 

Correlates the elements of two sequences based on overlapping durations.

#### Arguments
1. `right` *(`Observable`)*: The right observable sequence to join elements for.
2. `leftDurationSelector` *(`Function`)*: A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
3. `rightDurationSelector` *(`Function`)*: A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
4. `resultSelector` *(`Any`)*: A function invoked to compute a result element for any two overlapping elements of the left and right observable sequences. The parameters are as follows:
    1. *(`Any`)* Element from the left source for which the overlap occurs.
    2. *(`Any`)* Element from the right source for which the overlap occurs.

#### Returns
*(`Observable`)*: An observable sequence that contains result elements computed from source elements that have an overlapping duration.
 
#### Example
```js
var xs = Rx.Observable.interval(100)
    .map(function (x) { return 'first' + x; });

var ys = Rx.Observable.interval(100)
    .map(function (x) { return 'second' + x; });

var source = xs
    .join(
        ys,
        function () { return Rx.Observable.timer(0); },
        function () { return Rx.Observable.timer(0); },
        function (x, y) { return x + y; }
    )
    .take(5);

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

// => Next: first0second0 
// => Next: first1second1 
// => Next: first2second2 
// => Next: first3second3 
// => Next: first4second4 
// => Completed  
```

### Location

File:
- [`/src/core/observable/join.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/observable/join.js)

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
- [`/tests/observable/join.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/join.js)