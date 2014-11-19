### `Rx.Observable.prototype.singleOrDefault(predicate, [defaultValue], [thisArg])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/singleordefault.js "View in source")

Returns the first element of an observable sequence that satisfies the condition in the predicate, or a default value if no such element exists.

#### Arguments
1. `predicate` *(`Function`)*: A predicate function to evaluate for elements in the source sequence. The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[defaultValue]` *(`Any`)*: The default value if no such element exists.  If not specified, defaults to null.
3. `[thisArg]` *(`Any`)*: Object to use as `this` when executing the predicate.

#### Returns
*(`Observable`)*: An observable sequence that contains elements from the input sequence that satisfy the condition.

#### Example
```js
/* Without a predicate but default value */
var source = Rx.Observable.empty()
    .singleOrDefault(null, 42);

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

// => Next: 42
// => Completed

/* With a predicate */
var source = Rx.Observable.range(0, 10)
    .singleOrDefault(function (x, idx, obs) { return x ===  1; }, 0);

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

// => Next: 1
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/singleordefault.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/singleordefault.js)

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
- [`/tests/observable/singleordefault.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/singleordefault.js)
