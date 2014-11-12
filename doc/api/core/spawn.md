### `Rx.spawn(fn)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/spawn.js "View in source")

Spawns a generator function which allows for Promises, Observable sequences, Arrays, Objects, Generators and functions.

#### Arguments
1. `fn` *(`Function`)*: The spawning function.

#### Returns
*(`Function`)*: a function which has a done continuation.

#### Example
```js
var source = Rx.spawn(function* () {
  yield 1;
  yield 2;
  yield 3;
})();

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
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/spawn.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/spawn.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.all.compat.js)
- [`rx.experimental.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All)
- [`RxJS-Experimental`](http://www.nuget.org/packages/RxJS-Experimental)

Unit Tests:
- [`/tests/observable/spawn.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/spawn.js)
