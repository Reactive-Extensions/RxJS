### `Rx.Observable.concat(...args)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/concat.js "View in source")

Concatenates all of the specified observable sequences, as long as the previous observable sequence terminated successfully.

#### Arguments
1. `args` *(`Array` | `arguments`)*: Observable sequences or Promises to concatenate.

#### Returns
*(`Observable`)*: An observable sequence that contains the elements of each given sequence, in sequential order.

#### Example
```js
/* Using Observable sequences */
var source1 = Rx.Observable.return(42);
var source2 = Rx.Observable.return(56);

var source = Rx.Observable.concat(source1, source2);

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
// => Next: 56
// => Completed

/* Using Promises and Observable sequences */
var source1 = Rx.Observable.return(42);
var source2 = RSVP.Promise.resolve(56);

var source = Rx.Observable.concat(source1, source2);

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
// => Next: 56
// => Completed
```

### Location

File:
- [`/src/core/perf/operators/concat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/concat.js)

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
- [`/tests/observable/concatproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/concatproto.js)
