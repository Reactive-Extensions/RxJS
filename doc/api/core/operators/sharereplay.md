### `Rx.Observable.prototype.shareReplay([bufferSize], [window], [scheduler])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/sharereplay.js "View in source")

Returns an observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.

This operator is a specialization of `replay` that connects to the connectable observable sequence when the number of observers goes from zero to one, and disconnects when there are no more observers.

#### Arguments
1. `[bufferSize]` *(`Number`)*: Maximum element count of the replay buffer.
2. `[window]` *(`Number`)*: Maximum time length of the replay buffer in milliseconds.
3. `[scheduler]` *(`Scheduler`)*: Scheduler where connected observers within the selector function will be invoked on.

#### Returns
*(`Observable`)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.

#### Example
```js
var interval = Rx.Observable.interval(1000);

var source = interval
    .take(4)
    .doAction(function (x) {
        console.log('Side effect');
    });

var published = source
    .shareReplay(3);

published.subscribe(createObserver('SourceA'));
published.subscribe(createObserver('SourceB'));

// Creating a third subscription after the previous two subscriptions have
// completed. Notice that no side effects result from this subscription,
// because the notifications are cached and replayed.
Rx.Observable
    .return(true)
    .delay(6000)
    .flatMap(published)
    .subscribe(createObserver('SourceC'));

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
// => Side effect
// => Next: SourceA2
// => Next: SourceB2
// => Side effect
// => Next: SourceA3
// => Next: SourceB3
// => Completed
// => Completed
// => Next: SourceC1
// => Next: SourceC2
// => Next: SourceC3
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/sharereplay.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/sharereplay.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.binding.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

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
