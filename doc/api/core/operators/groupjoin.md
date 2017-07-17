# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
### `Rx.Observable.prototype.groupJoin(right, leftDurationSelector, rightDurationSelector, resultSelector)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/groupjoin.js "View in source")

Correlates the elements of two sequences based on overlapping durations, and groups the results.

#### Arguments
1. `right` *(`Observable`)*: The right observable sequence to join elements for.
2. `leftDurationSelector` *(`Function`)*: A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
3. `rightDurationSelector` *(`Function`)*: A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
4. `resultSelector` *(`Any`)*: A function invoked to compute a result element for any element of the left sequence with overlapping elements from the right observable sequence. It has the following arguments
    1. *(`Any`)* An element of the left sequence.
    2. *(`Observable`)* An observable sequence with elements from the right sequence that overlap with the left sequence's element.

#### Returns
*(`Observable`)*: An observable sequence that contains result elements computed from source elements that have an overlapping duration.

#### Example
```js
var xs = Rx.Observable.interval(100)
    .map(function (x) { return 'first' + x; });

var ys = Rx.Observable.interval(100)
    .map(function (x) { return 'second' + x; });

var source = xs.groupJoin(
    ys,
    function () { return Rx.Observable.timer(0); },
    function () { return Rx.Observable.timer(0); },
    function (x, yy) {
        return yy.select(function (y) {
            return x + y;
        })
    }).mergeAll().take(5);

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
- [`/src/core/linq/observable/groupjoin.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/groupjoin.js)

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
- [`/tests/observable/groupjoin.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/groupjoin.js)
