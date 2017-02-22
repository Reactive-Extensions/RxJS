### `Rx.Observable.prototype.catch(second | handler)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js#L3107-L3112 "View in source")

Continues an observable sequence that is terminated by an exception with the next observable sequence.

#### Arguments

Using another Observable:
- `second` *(`Observable`)*: A second observable sequence used to produce results when an error occurred in the first sequence.

Using a handler:
- `handler` *(`Function`)*: Exception handler function that returns an observable sequence given the error that occurred in the first sequence

#### Returns
*(`Observable`)*: An observable sequence containing the first sequence's elements, followed by the elements of the handler sequence in case an exception occurred.

#### Example
```js
/* Using a second observable */
var source = Rx.Observable.throw(new Error()).catch(Rx.Observable.just(42));

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
// => Completed

/* Using a handler function */
var source = Rx.Observable.throw(new TimeoutError())
    .catch(function (e) {
      var returnValue;
      if (e instanceof TimeoutError) { return Rx.Observable.just(42); }
      return Rx.Observable.throw(e);
    });

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
// => Completed
```
### Location

File:
- [`/src/core/linq/observable/catchproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/catchproto.js)

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
- [`/tests/observable/catch.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/catch.js)
