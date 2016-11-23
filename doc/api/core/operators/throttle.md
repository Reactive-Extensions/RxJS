### `Rx.Observable.prototype.throttle(windowDuration, [scheduler])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/throttle.js "View in source")

Returns an Observable that emits only the first item emitted by the source Observable during sequential time windows of a specified duration.

#### Arguments
1. `windowDuration` *(`Number`)*: Time to wait before emitting another item after emitting the last item (specified as an integer denoting milliseconds).
2. `[scheduler]` *(`Scheduler`)*:  The Scheduler to use internally to manage the timers that handle timeout for each item. If not provided, defaults to the default scheduler.

#### Returns
*(`Observable`)*: An Observable that performs the throttle operation.

#### Example
```js
var times = [
  { value: 0, time: 100 },
  { value: 1, time: 600 },
  { value: 2, time: 400 },
  { value: 3, time: 900 },
  { value: 4, time: 200 }
];

// Delay each item by time and project value;
var source = Rx.Observable.from(times)
  .flatMap(function (item) {
    return Rx.Observable
      .of(item.value)
      .delay(item.time);
  })
  .throttle(300 /* ms */);

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

// => Next: 0
// => Next: 2
// => Next: 3
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/throttle.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/throttle.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.time.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- If using `rx.time.js`
    - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)

Unit Tests:
- [`/tests/observable/throttle.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/throttle.js)
