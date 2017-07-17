# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
### `Rx.Observable.create(subscribe)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/create.js "View in source")

Creates an observable sequence from a specified subscribe method implementation.  This is an alias for the `createWithDisposable` method

#### Arguments
1. `subscribe` *(`Function`)*: Implementation of the resulting observable sequence's subscribe method, optionally returning a function that will be wrapped in a disposable object.  This could also be a disposable object.

#### Returns
*(`Observable`)*: The observable sequence with the specified implementation for the subscribe method.

#### Example
```js
/* Using a function */
var source = Rx.Observable.create(function (observer) {
    observer.onNext(42);
    observer.onCompleted();

    // Note that this is optional, you do not have to return this if you require no cleanup
    return function () {
        console.log('disposed');
    };
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
// => Completed

subscription.dispose();

// => disposed

/* Using a disposable */
var source = Rx.Observable.create(function (observer) {
    observer.onNext(42);
    observer.onCompleted();

    // Note that this is optional, you do not have to return this if you require no cleanup
    return Rx.Disposable.create(function () {
        console.log('disposed');
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
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/create.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/create.js)

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
- [`/tests/observable/create.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/create.js)
