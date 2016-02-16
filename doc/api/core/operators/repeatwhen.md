### `Rx.Observable.prototype.repeatWhen(notificationHandler)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/repeatwhen.js "View in source")

Returns an Observable that emits the same values as the source Observable with the exception of an onCompleted. An onCompleted notification from the source will result in the emission of a void item to the Observable provided as an argument to the notificationHandler function. If that Observable calls onComplete or onError then repeatWhen will call onCompleted or onError on the child subscription. Otherwise, this Observable will resubscribe to the source observable.

#### Arguments
1. `notificationHandler`: `Function` - receives an Observable of notifications with which a user can complete or error, aborting the repeat.

#### Returns
`Observable`: Observable modified with repeat logic

#### Example: Delayed repeat
```js
var source = Rx.Observable.just(42)
  .repeatWhen(function(notifications) {
    return notifications.scan(
      function (acc, x) { return acc + x; }, 0)
    .delay(200)
    .takeWhile(function (count) {
      return count < 2;
    });
  });

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

// => Next: 42
// 200 ms pass
// => Next: 42
// 200 ms pass
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/repeatwhen.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/repeatwhen.js)

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
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/repeatwhen.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/repeatwhen.js)
