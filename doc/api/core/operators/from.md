### `Rx.Observable.from(iterable, [mapFn], [thisArg], [scheduler])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/from.js 'View in source')

This method creates a new Observable sequence from an array-like or iterable object.

#### Arguments
1. `iterable` *(`Array` | `Arguments` | `Iterable`)*: An array-like or iterable object to convert to an Observable sequence.
2. `[mapFn]` *(`Function`)*: Map function to call on every element of the array.
3. `[thisArg]` *(`Any`)*: The context to use calling the mapFn if provided.
4. `[scheduler=Rx.Scheduler.currentThread]` *(`Scheduler`)*: Scheduler to run the enumeration of the input sequence on.

#### Returns
*(`Observable`)*: The observable sequence whose elements are pulled from the given iterable sequence.

#### Example
```js
// Array-like object (arguments) to Observable
function f() {
  return Rx.Observable.from(arguments);
}

f(1, 2, 3).subscribe(
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
// => Next: 2
// => Next: 3
// => Completed

// Any iterable object...
// Set
var s = new Set(['foo', window]);
Rx.Observable.from(s).subscribe(
  function (x) {
    console.log('Next: ' + x);
  },
  function (err) {
    console.log('Error: ' + err);
  },
  function () {
    console.log('Completed');
  });
// => Next: foo
// => Next: window
// => Completed

// Map
var m = new Map([[1, 2], [2, 4], [4, 8]]);
Rx.Observable.from(m).subscribe(
  function (x) {
    console.log('Next: ' + x);
  },
  function (err) {
    console.log('Error: ' + err);
  },
  function () {
    console.log('Completed');
  });
// => Next: [1, 2]
// => Next: [2, 4]
// => Next: [4, 8]
// => Completed

// String
Rx.Observable.from('foo').subscribe(
  function (x) {
    console.log('Next: ' + x);
  },
  function (err) {
    console.log('Error: ' + err);
  },
  function () {
    console.log('Completed');
  });
// => Next: f
// => Next: o
// => Next: o
// => Completed

// Using an arrow function as the map function to
// manipulate the elements
Rx.Observable.from([1, 2, 3], function (x) { return x + x; }).subscribe(
  function (x) {
    console.log('Next: ' + x);
  },
  function (err) {
    console.log('Error: ' + err);
  },
  function () {
    console.log('Completed');
  });
// => Next: 2
// => Next: 4
// => Next: 6
// => Completed

// Generate a sequence of numbers
Rx.Observable.from({length: 5}, function(v, k) { return k; }).subscribe(
  function (x) {
    console.log('Next: ' + x);
  },
  function (err) {
    console.log('Error: ' + err);
  },
  function () {
    console.log('Completed');
  });
// => Next: 0
// => Next: 1
// => Next: 2
// => Next: 3
// => Next: 4
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/from.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/from.js)

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
- [`/tests/observable/from.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/from.js)
