### `Rx.Observable.spawn(fn)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/spawn.js "View in source")

Spawns a generator function which allows for Promises, Observable sequences, Arrays, Objects, Generators and functions.

#### Arguments
1. `fn` *(`Function`)*: The spawning function.

#### Returns
*(`Observable`)*: An Observable with the final result

#### Example
```js
var Rx = require('rx');

var thunk = function (val) {
  return function (cb) {
    cb(null, val);
  };
};

var spawned = Rx.Observable.spawn(function* () {
  var v = yield thunk(12);
  var w = yield [24];
  var x = yield Rx.Observable.just(42);
  var y = yield Rx.Observable.just(56);
  var z = yield Promise.resolve(78);
  return v + w[0] + x + y + z;
});

spawned.subscribe(
  function (x) { console.log('next %s', x); },
  function (e) { console.log('error %s', e); },
  function () { console.log('completed'); }
);

// => next 212
// => completed
```

### Location

File:
- [/src/core/linq/observable/spawn.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/spawn.js)

Dist:
- [`rx.async.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.async.js)
- [`rx.async.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.async.compat.js)
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)

Prerequisites:
- If using `rx.async.js` | `rx.async.compat.js`
    - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
    - [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.binding.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Async`](http://www.nuget.org/packages/RxJS-Async)

Unit Tests:
- [``/tests/observable/spawn.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/spawn.js)
