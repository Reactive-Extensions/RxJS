### `Rx.Observable.prototype.retry([retryCount])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/retry.js "View in source")

Repeats the source observable sequence the specified number of times or until it successfully terminates. If the retry count is not specified, it retries indefinitely.
Note if you encounter an error and want it to retry once, then you must use .retry(2).

#### Arguments
1. `[retryCount]` *(`Number`)*:  Number of times to retry the sequence. If not provided, retry the sequence indefinitely.

#### Returns
*(`Observable`)*: An observable sequence producing the elements of the given sequence repeatedly until it terminates successfully.

#### Example
```js
var count = 0;

var source = Rx.Observable.interval(1000)
    .selectMany(function () {
        if (++count < 2) {
            return Rx.Observable.throw(new Error());
        }
        return Rx.Observable.return(42);
    })
    .retry(3)
    .take(1);

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
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/retry.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/retry.js)

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
- [`/tests/observable/retry.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/retry.js)
