### `Rx.Observable.spawn(fn)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/spawn.js "View in source")

Spawns a generator function which allows for Promises, Observable sequences, Arrays, Objects, Generators and functions.

#### Arguments
1. `fn` *(`Function`)*: The spawning function.

#### Returns
*(`Function`)*: A function which has a done continuation.

#### Example
```js
var Rx = require('rx');
var request = require('request');
var get = Rx.Observable.fromNodeCallback(request);

Rx.spawn(function* () {
  var data;
  try {
    data = yield get('http://bing.com').timeout(5000 /*ms*/);
  } catch (e) {
    console.log('Error %s', e);
  } 

  console.log(data);
})();
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
- [/tests/observable/spawn.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/spawn.js)
