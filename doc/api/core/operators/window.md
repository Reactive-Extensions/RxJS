### `Rx.Observable.prototype.window()`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/window.js "View in source")

The `window` method periodically subdivide items from an Observable into Observable windows and emit these windows rather than emitting the items one at a time.

Window is similar to `buffer`, but rather than emitting packets of items from the original `Observable`, it emits Observables, each one of which emits a subset of items from the original `Observable` and then terminates with an `onCompleted` call.

Like `buffer`, `window` has many varieties, each with its own way of subdividing the original `Observable` into the resulting `Observable` emissions, each one of which contains a "window" onto the original emitted items. In the terminology of the `window` method, when a window "opens," this means that a new `Observable` is emitted and that `Observable` will begin emitting items emitted by the source `Observable`. When a window "closes," this means that the emitted Observable stops emitting items from the source Observable and calls its Subscribers' `onCompleted` method and terminates.

#### With window closing selector
```js

Rx.Observable.prototype.window(windowClosingSelector);
```

This version of `window` opens its first window immediately. It closes the currently open window and immediately opens a new one each time it observes an object emitted by the `Observable` that is returned from `windowClosingSelector`. In this way, this version of `window` emits a series of non-overlapping windows whose collective `onNext` emissions correspond one-to-one with those of the source Observable.

#### Arguments
1. `windowClosingSelector` *(`Function`)*: A function invoked to define the closing of each produced window.

#### Returns
*(`Observable`)*: An observable sequence of windows.

#### Example
```js
// With closings
var source = Rx.Observable.timer(0, 50)
  .window(function () { return Rx.Observable.timer(125); })
  .take(3)
  .flatMap(function (x) { return x.toArray(); });

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

  // => Next: 0,1,2
  // => Next: 3,4,5
  // => Next: 6,7
  // => Completed
```

#### With window opening and window closing selector
```js
Rx.Observable.prototype.window(windowOpenings, windowClosingSelector);
```

This version of `window` opens a window whenever it observes the `windowOpenings` `Observable` emit an Opening object and at the same time calls `windowClosingSelector` to generate a closing `Observable` associated with that window. When that closing `Observable` emits an object, `window` closes that window. Since the closing of currently open windows and the opening of new windows are activities that are regulated by independent Observables, this version of `window` may create windows that overlap (duplicating items from the source `Observable`) or that leave gaps (discarding items from the source Observable).

#### Arguments
1. `windowOpenings` *(`Observable`)*: Observable sequence whose elements denote the creation of new windows
2. `windowClosingSelector` *(`Function`)*: A function invoked to define the closing of each produced window.

#### Returns
*(`Observable`)*: An observable sequence of windows.

#### Example

```js
/* Using Openings and Closing Selector */
var openings = Rx.Observable.interval(200);

var source = Rx.Observable.interval(50)
  .window(openings, function (x) { return Rx.Observable.timer(x + 100); })
  .take(3);

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

// => Next: 3,4
// => Next: 7,8
// => Next: 11,12
// => Completed
```

#### With boundaries
```js
Rx.Observable.prototype.window(windowBoundaries);
```

This version of `window` returns an `Observable` that emits non-overlapping buffered items from the source `Observable` each time the specified boundary Observable emits an item.

#### Arguments
1. `windowBoundaries` *(`Observable`)*: Sequence of window boundary markers. The current window is closed and a new window is opened upon receiving a boundary marker.

#### Returns
*(`Observable`)*: An observable sequence of windows.

#### Example
```js
/* With window boundaries */
var openings = Rx.Observable.interval(500);

// Convert the window to an array
var source = Rx.Observable.timer(0, 100)
  .window(openings)
  .take(3)
  .flatMap(function (x) { return x.toArray(); });

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

// => Next: 0,1,2,3,4
// => Next: 5,6,7,8,9,10
// => Next: 11,12,13,14,15
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/window.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/window.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.coincidence.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.coincidence.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Coincidence`](http://www.nuget.org/packages/RxJS-Coincidence/)

Unit Tests:
- [`/tests/observable/window.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/window.js)
