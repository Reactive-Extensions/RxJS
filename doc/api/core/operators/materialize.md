### `Rx.Observable.prototype.materialize()`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/materialize.js "View in source")

Materializes the implicit notifications of an observable sequence as explicit notification values.

#### Returns
*(`Observable<Notification>`)*: An observable sequence containing the materialized notification values from the source sequence.

#### Example
```js
var source = Rx.Observable.of(1,2,3).materialize();

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

// => Next OnNext(1)
// => Next OnNext(2)
// => Next OnNext(3)
// => Next OnCompleted()
// => Completed
```
### Location

File:
- [`/src/core/linq/observable/materialize.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/materialize.js)

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
- [`/tests/observable/materialize.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/materialize.js)
