### `Rx.Observable.forkJoin(...args)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/forkjoin.js "View in source")

Runs all observable sequences in parallel and collect their last elements.

#### Arguments
1. `args` *(Arguments | Array)*: An array or arguments of Observable sequences or Promises to collect the last elements for.

#### Returns
*(`Observable`)*: An observable sequence with an array collecting the last elements of all the input sequences.

#### Example
```js
/* Using observables and Promises */
var source = Rx.Observable.forkJoin(
    Rx.Observable.return(42),
    Rx.Observable.range(0, 10),
    Rx.Observable.from([1,2,3]),
    RSVP.Promise.resolve(56)
);

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

// => Next: [42, 9, 3, 56]
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/forkjoin.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/forkjoin.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.experimental.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.experimental.js)

Prerequisites:
- If using `rx.experimental.js` - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Complete`](http://www.nuget.org/packages/RxJS-Complete)
- [`RxJS-Experimental`](http://www.nuget.org/packages/RxJS-Experimental)

Unit Tests:
- [`/tests/observable/forkjoin.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/forkjoin.js)
