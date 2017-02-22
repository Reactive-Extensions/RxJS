### `Rx.Observable.throw(exception, [scheduler])`
### `Rx.Observable.throwError(exception, [scheduler])`
### `Rx.Observable.throwException(exception, [scheduler])` ** DEPRECATED **
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/throw.js "View in source")

Returns an observable sequence that terminates with an exception, using the specified scheduler to send out the single onError message.

### Arguments
1. `exception` *(Error)*: Error the observable sequence terminates with.
2. `[scheduler=Rx.Scheduler.immediate]` *(`Scheduler`)*: Scheduler to send the exceptional termination call on. If not specified, defaults to the immediate scheduler.

#### Returns
*(`Observable`)*: The observable sequence that terminates exceptionally with the specified exception object.

#### Example
```js
var source = Rx.Observable.return(42)
    .selectMany(Rx.Observable.throw(new Error('error!')));

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

// => Error: Error: error!
```

### Location

File:
- [/src/core/perf/operators/throw.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/throw.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [/tests/observable/throw.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/throw.js)
