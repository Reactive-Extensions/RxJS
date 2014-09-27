### `Rx.Observable.prototype.share()`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/share.js "View in source")

Returns an observable sequence that shares a single subscription to the underlying sequence.

This operator is a specialization of `publish` which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.

#### Returns
*(`Observable`)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.

#### Example
```js
/* Without share */
var interval = Rx.Observable.interval(1000);

var source = interval
    .take(2)
    .doAction(function (x) {
        console.log('Side effect');
    });

source.subscribe(createObserver('SourceA'));
source.subscribe(createObserver('SourceB'));

function createObserver(tag) {
    return Rx.Observer.create(
        function (x) {
            console.log('Next: ' + tag + x);
        },
        function (err) {
            console.log('Error: ' + err);
        },
        function () {
            console.log('Completed');
        });
}

// => Side effect
// => Next: SourceA0
// => Side effect
// => Next: SourceB0
// => Side effect
// => Next: SourceA1
// => Completed
// => Side effect
// => Next: SourceB1
// => Completed

/* With share */
var interval = Rx.Observable.interval(1000);

var source = interval
    .take(2)
    .do(
        function (x) {
            console.log('Side effect');
        });

var published = source.share();

// When the number of observers subscribed to published observable goes from
// 0 to 1, we connect to the underlying observable sequence.
published.subscribe(createObserver('SourceA'));
// When the second subscriber is added, no additional subscriptions are added to the
// underlying observable sequence. As a result the operations that result in side
// effects are not repeated per subscriber.
published.subscribe(createObserver('SourceB'));

function createObserver(tag) {
    return Rx.Observer.create(
        function (x) {
            console.log('Next: ' + tag + x);
        },
        function (err) {
            console.log('Error: ' + err);
        },
        function () {
            console.log('Completed');
        });
}

// => Side effect
// => Next: SourceA0
// => Next: SourceB0
// => Side effect
// => Next: SourceA1
// => Next: SourceB1
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/share.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/share.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using `rx.binding.js`
  - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Binding`](http://www.nuget.org/packages/RxJS-Binding/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/publish.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/publish.js)
