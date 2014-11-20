### `Rx.Observable.prototype.select(selector, [thisArg])`
### `Rx.Observable.prototype.map(selector, [thisArg])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/select.js "View in source")

Projects each element of an observable sequence into a new form by incorporating the element's index.  This is an alias for the `select` method.

#### Arguments
1. `selector` *(`Function` | `Object`)*:  Transform function to apply to each source element or an element to yield.  If selector is a function, it is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(`Any`)*: Object to use as `this` when executing the predicate.

#### Returns
*(`Observable`)*: An observable sequence which results from the comonadic bind operation.

#### Example
```js
// Using a value
var md = Rx.Observable.fromEvent(document, 'mousedown').map(true);
var mu = Rx.Observable.fromEvent(document, 'mouseup').map(false);

// Using a function
var source = Rx.Observable.range(1, 3)
    .select(function (x, idx, obs) {
        return x * x;
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

// => Next: 1
// => Next: 4
// => Next: 9
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/select.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/select.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/select.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/select.js)
