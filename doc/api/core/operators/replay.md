### `Rx.Observable.prototype.replay([selector], [bufferSize], [window], [scheduler])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/replay.js "View in source")

Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.

This operator is a specialization of `multicast` using a `Rx.ReplaySubject`.

#### Arguments
1. `[selector]` *(`Function`)*: Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all the notifications of the source subject to the specified replay buffer trimming policy.
2. `[bufferSize]` *(`Number`)*: Maximum element count of the replay buffer.
3. `[window]` *(`Number`)*: Maximum time length of the replay buffer in milliseconds.
4. `[scheduler]` *(`Scheduler`)*: Scheduler where connected observers within the selector function will be invoked on.

#### Returns
*(`Observable`)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.

#### Example
```js
var interval = Rx.Observable.interval(1000);

var source = interval
    .take(2)
    .do(function (x) {
        console.log('Side effect');
    });

var published = source
    .replay(function (x) {
        return x.take(2).repeat(2);
    }, 3);

published.subscribe(createObserver('SourceA'));
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
// => Side effect
// => Next: SourceB0
// => Side effect
// => Next: SourceA1
// => Next: SourceA0
// => Next: SourceA1
// => Completed
// => Side effect
// => Next: SourceB1
// => Next: SourceB0
// => Next: SourceB1
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/replay.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/replay.js)

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
- [`/tests/observable/replay.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/replay.js)
