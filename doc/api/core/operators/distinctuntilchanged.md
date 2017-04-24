### `Rx.Observable.prototype.distinctUntilChanged([keySelector], [comparer])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/distinctuntilchanged.js "View in source")

Returns an observable sequence that contains only distinct contiguous elements according to the keySelector and the comparer.

#### Arguments
1. `[keySelector]` *(`Function`)*: A function to compute the comparison key for each element. If not provided, it projects the value.
2. `[comparer]` *(`Function`)*: Equality comparer for computed key values. If not provided, defaults to an equality comparer function.

#### Returns
*(`Observable`)*: An observable sequence only containing the distinct contiguous elements, based on a computed key value, from the source sequence.

#### Example
```js
/* Without key selector */
var source = Rx.Observable.of(42, 42, 24, 24)
  .distinctUntilChanged();

var subscription = source.subscribe(
  function (x) {
    console.log('Next: %s', x);
  },
  function (err) {
    console.log('Error: %s', err);
  },
  function () {
    console.log('Completed');
  });

// => Next: 42
// => Next: 24
// => Completed

/* With key selector */
var source = Rx.Observable.of({value: 42}, {value: 42}, {value: 24}, {value: 24})
  .distinctUntilChanged(function (x) { return x.value; });

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

/* With comparer */
var source = Rx.Observable.of({value: 42}, {value: 42}, {value: 24}, {value: 24})
  .distinctUntilChanged(function (x) { return x.value; }, function (a,b) { return a !== b; });

var subscription = source.subscribe(
    function (x) {
        console.dir('Next: ' + x.toString());
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
- [`/src/core/perf/operators/distinctuntilchanged.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/distinctuntilchanged.js)

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
- [`/tests/observable/distinctuntilchanged.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/distinctuntilchanged.js)
