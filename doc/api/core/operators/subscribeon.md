### `Rx.Observable.prototype.subscribeOn(scheduler)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/subscribeon.js "View in source")

Wraps the source sequence in order to run its subscription and unsubscription logic on the specified scheduler.

This only performs the side-effects of subscription and unsubscription on the specified scheduler. In order to invoke observer callbacks on a scheduler, use `observeOn`.

#### Arguments
1. `scheduler` *(`Scheduler`)*:  Scheduler to notify observers on.

#### Returns
*(`Observable`)*: The source sequence whose observations happen on the specified scheduler.

#### Example
```js
var observable = Rx.Observable.create(function (observer) {
    function handler () {
        observer.onNext(42);
        observer.onCompleted();
    }

    // Change scheduler for here
    var id = setTimeout(handler, 1000);

    return function () {
        // And change scheduler for here
        if (id) clearTimeout(id);
    };
});

// Change the scheduler to timeout for subscribe/unsubscribe
var source = observable.subscribeOn(Rx.Scheduler.timeout);

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
- [`/src/core/linq/observable/subscribeon.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/subscribeon.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)

Unit Tests:
- [`/tests/observable/subscribeon.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/subscribeon.js)
