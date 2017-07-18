# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
### `Rx.Observable.pairs(obj, [scheduler])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/pairs.js "View in source")

Convert an object into an observable sequence of [key, value] pairs using an optional `Scheduler` to enumerate the object.

#### Arguments
1. `obj` *(Object)*: The object to inspect and turn into an Observable sequence.
2. `[scheduler]` *(`Scheduler`)*: Scheduler to run the enumeration of the input sequence on. If not specified, defaults to `Rx.Scheduler.currentThread`

#### Returns
*(`Observable`)*: An observable sequence of [key, value] pairs from the object.

#### Example
```js
// Using Standard JavaScript
var obj = {
  foo: 42,
  bar: 56,
  baz: 78
};

var source = Rx.Observable.pairs(obj);

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

// => Next: ['foo', 42]
// => Next: ['bar', 56]
// => Next: ['baz', 78]
// => Completed
  ```

ES6 makes for an even nicer experience such as:
```es6
let obj = {
  foo: 42,
  bar: 56,
  baz: 78
};

let source = Rx.Observable.pairs(obj);

let subscription = source.subscribe(
  x => {
    var [key, value] = x;
    console.log('Key:', key, 'Value:', value);
  },
  err => {
    console.log('Error: %s', err);
  },
  => () {
    console.log('Completed');
  });

// => Key: 'foo' Value: 42
// => Key: 'bar' Value: 56
// => Key: 'baz' Value: 78
// => Completed
```

### Location

File:
- [`/src/core/perf/operators/pairs.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/pairs.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Complete`](http://www.nuget.org/packages/RxJS-Complete)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/pairs.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/pairs.js)
