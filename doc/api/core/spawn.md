### `Rx.spawn(fn)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/spawn.js "View in source")

Spawns a generator function which allows for Promises, Observable sequences, Arrays, Objects, Generators and functions.

#### Arguments
1. `fn` *(`Function`)*: The spawning function.

#### Returns
*(`Function`)*: a function which has a done continuation.

#### Example
```js
Rx.spawn(function* () {
  var data1 = yield Promise.resolve('A');
  console.log('Generator1: ' + data1);
  var data2 = yield Rx.Observable.return('B').delay(1000).map(function(x) {
    console.log('Map: ' + x);
    return x;
  });
  console.log('Generator2: ' + data2);
  return data2;
})(function(err, res) {
    console.log('Done: ' + res);
});

// => Generator1: A
// => Map: B
// => Generator2: B
// => Done: B
```

### Location

File:
- [`/src/core/linq/observable/spawn.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/spawn.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.experimental.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.experimental.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All)
- [`RxJS-Experimental`](http://www.nuget.org/packages/RxJS-Experimental)

Unit Tests:
- [`/tests/observable/spawn.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/spawn.js)
