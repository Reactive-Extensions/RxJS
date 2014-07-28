### `Rx.Observable.prototype.catch(second | handler)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js#L3107-L3112 "View in source") 

Continues an observable sequence that is terminated by an exception with the next observable sequence.  There is an alias for this method `catchException` for browsers <IE9

#### Arguments
1. `second` *(`Observable`)*: A second observable sequence used to produce results when an error occurred in the first sequence.
1. `handler` *(`Function`)*: Exception handler function that returns an observable sequence given the error that occurred in the first sequence

#### Returns
*(`Observable`)*: An observable sequence containing the first sequence's elements, followed by the elements of the handler sequence in case an exception occurred.

#### Example
```js
/* Using a second observable */
var source = Rx.Observable.throw(new Error())
    .catch(Rx.Observable.return(42));

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

// => Next: 42
// => Completed 

/* Using a handler function */
var source = Rx.Observable.throw(new Error())
    .catch(function (e) {
        return Rx.Observable.return(e instanceof Error);
    });

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

// => Next: true
// => Completed     
```
### Location

File:
- [`/src/core/linq/observable/catchproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/catchproto.js)

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
- [`/tests/observable/catchexceptionproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/catchexceptionproto.js)