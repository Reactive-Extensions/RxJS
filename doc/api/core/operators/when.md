### `Rx.Observable.when(...args)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/when.js "View in source")

A series of plans (specified as an Array of as a series of arguments) created by use of the Then operator on patterns.

### Arguments
1. `args` *(arguments|Array)*: A series of plans (specified as an Array of as a series of arguments) created by use of the then operator on patterns.

#### Returns
*(`Observable`)*: Observable sequence with the results form matching several patterns.

#### Example
```js
// Fire each plan when both are ready
var source = Rx.Observable.when(
  Rx.Observable.timer(100).and(Rx.Observable.timer(500)).then(function (x, y) { return 'first'; }),
  Rx.Observable.timer(400).and(Rx.Observable.timer(300)).then(function (x, y) { return 'second'; })
);

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

// => Next: second
// => Next: first
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/when.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/when.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.joinpatterns.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.joinpatterns.js)

Prerequisites:
- [`rx`](https://www.npmjs.org/package/rx).joinpatterns.js
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All)
- [`RxJS-JoinPatterns`](http://www.nuget.org/packages/RxJS-JoinPatterns)

Unit Tests:
- [`/tests/observable/when.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/when.js)
