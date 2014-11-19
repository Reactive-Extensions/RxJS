### `Rx.Observable.prototype.window([windowOpenings], [windowBoundaries], windowClosingSelector)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/window.js "View in source")

Projects each element of an observable sequence into zero or more windows.

```js
// With window closing selector
Rx.Observable.prototype.window(windowClosingSelector);

// With window opening and window closing selector
Rx.Observable.prototype.window(windowOpenings, windowClosingSelector);

// With boundaries
Rx.Observable.prototype.window(windowBoundaries);
```

#### Arguments
1. `[windowOpenings]` *(`Observable`)*: Observable sequence whose elements denote the creation of new windows
2.`[windowBoundaries]` *(`Observable`)*: Sequence of window boundary markers. The current window is closed and a new window is opened upon receiving a boundary marker.
3. `windowClosingSelector` *(`Function`)*: A function invoked to define the closing of each produced window.

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
    .selectMany(function (x) { return x.toArray(); });

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

// => Next: 0,1,2,3,4
// => Next: 5,6,7,8,9,10
// => Next: 11,12,13,14,15
// => Completed

/* With window opening and window closing selector */
var win = 0;

var source = Rx.Observable.timer(0, 50)
    .window(function () { return Rx.Observable.timer((++win) * 100); })
    .take(3)
    .selectMany(function (x) { return x.toArray(); });

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

// => Next: 0,1,2
// => Next: 3,4,5,6
// => Next: 7,8,9,10,11,12
// => Completed

/* With openings and closings */
var openings = Rx.Observable.timer(0, 200);

var source = Rx.Observable.timer(0, 50)
    .window(openings, function (x) { return Rx.Observable.timer(x + 100); })
    .take(3)
    .selectMany(function (x) { return x.toArray(); });

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

// => Next: 0,1,2
// => Next: 4,5
// => Next: 8,9
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
