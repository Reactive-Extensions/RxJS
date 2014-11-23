### `Rx.Observable.prototype.bufferWithTimeOrCount(timeSpan, count, [scheduler])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/bufferwithtimeorcount.js "View in source")

Projects each element of an observable sequence into a buffer that is completed when either it's full or a given amount of time has elapsed.

#### Arguments
1. `timeSpan` *(`Number`)*: Maximum time length of a buffer.
2. `count` *(`Number`)*: Maximum element count of a buffer.
3. `[scheduler=Rx.Scheduler.timeout]` *(`Scheduler`)*: Scheduler to run buffer timers on. If not specified, the timeout scheduler is used.

#### Returns
*(`Observable`)*: An observable sequence of buffers.

#### Example
```js
/* Hitting the count buffer first */
var source = Rx.Observable.interval(100)
    .bufferWithTimeOrCount(500, 3)
    .take(3);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

// => Next: 0,1,2
// => Next: 3,4,5
// => Next: 6,7,8
// => Completed
```
### Location

File:
- [/src/core/linq/observable/bufferwithtimeorcount.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/bufferwithtimeorcount.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.time.js)

Prerequisites:
- [`rx`](https://www.npmjs.org/package/rx).time.js
    - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | rx.lite.compat.js

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/bufferwithtimeorcount.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/bufferwithtimeorcount.js)
