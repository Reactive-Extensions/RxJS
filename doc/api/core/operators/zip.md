### `Rx.Observable.zip(...args)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/zip.js "View in source") 

Merges the specified observable sequences or Promises into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.

#### Arguments
1. `args` *(Array|arguments)*: Observable sources.

#### Returns
*(`Observable`)*: An observable sequence containing the result of combining elements of the sources using the specified result selector function.

#### Example
```js
/* Using arguments */
var range = Rx.Observable.range(0, 5);

var source = Observable.zip(
    range,
    range.skip(1), 
    range.skip(2), 
    function (s1, s2, s3) {
        return s1 + ':' + s2 + ':' + s3;
    }
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

// => Next: 0:1:2
// => Next: 1:2:3
// => Next: 2:3:4
// => Completed

/* Using promises and Observables */
var range = Rx.Observable.range(0, 5);

var source = Observable.zip(
    RSVP.Promise.resolve(0),
    RSVP.Promise.resolve(1),
    Rx.Observable.return(2)
    function (s1, s2, s3) {
        return s1 + ':' + s2 + ':' + s3;
    }
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

// => Next: 0:1:2
// => Completed
```

### Location

File:
- [/src/core/linq/observable/zip.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/zip.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- [`rx`](https://www.npmjs.org/package/rx).experimental.js
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [/tests/observable/zip.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/zip.js)
