### `Rx.Observable.prototype.do([observer] | [onNext], [onError], [onCompleted])` ###
### `Rx.Observable.prototype.tap([observer] | [onNext], [onError], [onCompleted])` ###
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/tap.js "View in source")

Invokes an action for each element in the observable sequence and invokes an action upon graceful or exceptional termination of the observable sequence.

This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.

There is an alias to this method `doAction` for browsers <IE9 and `tap` as well.

#### Arguments
1. `[observer]` *(Observer)*: An observer to invoke for each element in the observable sequence.
1. `[onNext]` *(`Function`)*: Function to invoke for each element in the observable sequence.
2. `[onError]` *(`Function`)*: Function to invoke upon exceptional termination of the observable sequence. Used if only the first parameter is also a function.
3. `[oncompleted]` *(`Function`)*: Function to invoke upon graceful termination of the observable sequence. Used if only the first parameter is also a function.

#### Returns
*(`Observable`)*: The source sequence with the side-effecting behavior applied.

#### Example
```js
/* Using a function */
var source = Rx.Observable.range(0, 3)
  .do(
    function (x)   { console.log('Do Next:', x); },
    function (err) { console.log('Do Error:', err); },
    function ()    { console.log('Do Completed'); }
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

// => Do Next: 0
// => Next: 0
// => Do Next: 1
// => Next: 1
// => Do Next: 2
// => Next: 2
// => Do Completed
// => Completed

/* Using an observer */
var observer = Rx.Observer.create(
  function (x) { console.log('Do Next: %s', x); },
  function (err) { console.log('Do Error: %s', err); },
  function () { console.log('Do Completed'); }
);

var source = Rx.Observable.range(0, 3)
    .do(observer);

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

// => Do Next: 0
// => Next: 0
// => Do Next: 1
// => Next: 1
// => Do Next: 2
// => Next: 2
// => Do Completed
// => Completed
```
### Location

File:
- [`/src/core/perf/operators/tap.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/tap.js)

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
- [`/tests/observable/do.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/do.js)
