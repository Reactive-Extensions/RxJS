### `Rx.Observable.prototype.dematerialize()`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/dematerialize.js "View in source")

Dematerializes the explicit notification values of an observable sequence as implicit notifications.

#### Returns
*(`Observable`)*: An observable sequence exhibiting the behavior corresponding to the source sequence's notification values.

#### Example
```js
var source = Rx.Observable
  .from([
    Rx.Notification.createOnNext(42),
    Rx.Notification.createOnError(new Error('woops'))
  ])
  .dematerialize();

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

// => Next: 42
// => Error: Error: woops
```
### Location

File:
- [`/src/core/linq/observable/dematerialize.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/dematerialize.js)

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
- [`RxJS-Complete`](http://www.nuget.org/packages/RxJS-Complete/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/dematerialize.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/dematerialize.js)
