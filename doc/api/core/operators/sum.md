### `Rx.Observable.prototype.sum([keySelector], [thisArg])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/sum.js "View in source")

Computes the sum of a sequence of values that are obtained by invoking an optional transform function on each element of the input sequence, else if not specified computes the sum on each item in the sequence.

#### Arguments
1. `[keySelector]` *(`Scheduler`)*:  A transform function to apply to each element.  The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed

#### Returns
*(`Observable`)*: An observable sequence containing a single element with the sum of the values in the source sequence.

#### Example
```js
/* Without a selector */
var source = Rx.Observable.range(1, 10)
    .sum();

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

// => Next: 55
// => Completed

/* With a selector */
var array = [
    { value: 1 },
    { value: 2 },
    { value: 3 }
];

var source = Rx.Observable
    .fromArray(array)
    .sum(function (x, idx, obs) {
        return x.value;
    });

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

// => Next: 6
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/sum.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/sum.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.aggregates.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.aggregates.js)

Prerequisites:
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

Unit Tests:
- [`/tests/observable/sum.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/sum.js)
