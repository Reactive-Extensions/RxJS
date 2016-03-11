### `Rx.Observable.prototype.flatMapWithMaxConcurrent(maxConcurrent, selector, [resultSelector], [thisArg])`
### `Rx.Observable.prototype.selectWithMaxConcurrent(maxConcurrent, selector, [resultSelector], [thisArg])`
[&#x24C8;]((https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/flatmapwithmaxconcurrent.js "View in source")

This is an alias for the `selectWithMaxConcurrent` method.  This can be one of the following:

Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence with the given concurrency limit.

```js
source.flatMapWithMaxConcurrent(10, function (x, i) { return Rx.Observable.range(0, x); });
source.flatMapWithMaxConcurrent(1, function (x, i) { return Promise.resolve(x + 1); });
source.flatMapWithMaxConcurrent(1, function (x, i) { return [x, i]; });
```

Projects each element of an observable sequence or Promise to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence with the given concurrency limit.

```js
source.flatMapWithMaxConcurrent(10, function (x, i) { return Rx.Observable.range(0, x); }, function (x, y, ix, iy) { return x + y + ix + iy; });
source.flatMapWithMaxConcurrent(1, function (x, i) { return Promise.resolve(x + i); }, function (x, y, ix, iy) { return x + y + ix + iy; });
source.flatMapWithMaxConcurrent(1, function (x, i) { return [x, i];  }, function (x, y, ix, iy) { return x + y + ix + iy; });
```

Projects each element of the source observable sequence to the other observable sequence or Promise or array/iterable and merges the resulting observable sequences into one observable sequence with the given max concurrency limit.

 ```js
source.flatMapWithMaxConcurrent(1, Rx.Observable.of(1,2,3));
source.flatMapWithMaxConcurrent(1, Promise.resolve(42));
source.flatMapWithMaxConcurrent(1, [1,2,3]);
 ```

#### Arguments
1. `maxConcurrent` *(`Number`)*: Maximum number of inner observable sequences being subscribed to concurrently.
2. `selector` *(`Function` | `Iterable` | `Promise`)*:  An Object to project to the sequence or a transform function to apply to each element or an observable sequence to project each element from the source sequence onto.  The selector is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed

3. `[resultSelector]` *(`Function`)*: A transform function to apply to each element of the intermediate sequence.  The resultSelector is called with the following information:
    1. the value of the outer element
    2. the value of the inner element
    3. the index of the outer element
    4. the index of the inner element

4. `[thisArg]` *(`Any`)*: If `resultSelector` is not `Function`, Object to use as `this` when executing `selector`.

#### Returns
*(`Observable`)*: An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.

#### Example
```js
var source = Rx.Observable.range(0, 5)
  .flatMapWithMaxConcurrent(2, function (x, i) {
    return Rx.Observable
      .interval(100)
      .take(x).map(function() { return i; });
  });

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

// => Next: 1
// => Next: 2
// => Next: 3
// => Next: 2
// => Next: 3
// => Next: 4
// => Next: 3
// => Next: 4
// => Next: 4
// => Next: 4
// => Completed

/* Using a promise */
var source = Rx.Observable.of(1,2,3,4)
  .flatMapWithMaxConcurrent(1, function (x, i) {
    return Promise.resolve(x + i);
  });

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

// => Next: 1
// => Next: 3
// => Next: 5
// => Next: 7
// => Completed

/* Using an array */
var source = Rx.Observable.of(1,2,3)
  .flatMapWithMaxConcurrent(
    1,
    function (x, i) { return [x,i]; },
    function (x, y, ix, iy) { return x + y + ix + iy; }
  );

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

// => Next: 2
// => Next: 2
// => Next: 5
// => Next: 5
// => Next: 8
// => Next: 8
// => Completed
```

### Location

File:
- [`/src/core/perf/operators/flatmapwithmaxconcurrent.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/flatmapwithmaxconcurrent.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.experimental.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.experimental.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Complete`](http://www.nuget.org/packages/RxJS-Complete/)
- [`RxJS-Experimental`](http://www.nuget.org/packages/RxJS-Experimental/)

Unit Tests:
- [`/tests/observable/flatmapwithmaxconcurrent.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/flatmapwithmaxconcurrent.js)
