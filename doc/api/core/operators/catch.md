### `Rx.Observable.catch(...args)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/catch.js "View in source")

Continues an observable sequence that is terminated by an exception with the next observable sequence.  There is an alias for this method `catchException` for browsers <IE9

#### Arguments
1. `args` *(`Array` | `arguments`)*: Observable sequences to catch exceptions for.

#### Returns
*(`Observable`)*: An observable sequence containing elements from consecutive source sequences until a source sequence terminates successfully.

#### Example
```js
var obs1 = Rx.Observable.throw(new Error('error'));
var obs2 = Rx.Observable.return(42);

var source = Rx.Observable.catch(obs1, obs2);

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
- [`/src/core/linq/observable/catch.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/catch.js)

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
- [`/tests/observable/catchexceptionproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/catchexceptionproto.js)
