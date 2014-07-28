### `Rx.Observable.defer(observableFactory)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/defer.js "View in source") 

Returns an observable sequence that invokes the specified factory function whenever a new observer subscribes.

#### Arguments
1. `observableFactory` *(`Function`)*: Observable factory function to invoke for each observer that subscribes to the resulting sequence.

#### Returns
*(`Observable`)*: An observable sequence whose observers trigger an invocation of the given observable factory function.

#### Example
```js
/* Using an observable sequence */
var source = Rx.Observable.defer(function () {
    return Rx.Observable.return(42);
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

/* Using a promise */
var source = Rx.Observable.defer(function () {
    return RSVP.Promise.resolve(42);
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
- [`/src/core/linq/observable/defer.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/defer.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.all.compat.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Complete`](http://www.nuget.org/packages/RxJS-Complete)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/defer.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/defer.js)
