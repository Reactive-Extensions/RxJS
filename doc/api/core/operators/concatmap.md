### `Rx.Observable.prototype.concatMap(selector, [resultSelector])`
[&#x24C8;]((https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/concatmap.js "View in source") 

This is an alias for the `selectConcat` method.  This can be one of the following:

Projects each element of an observable sequence to an observable sequence and concatenates the resulting observable sequences or Promises into one observable sequence.

```js
source.concatMap(function (x, i) { return Rx.Observable.range(0, x); });
source.concatMap(function (x, i) { return Promise.resolve(x + 1}; });
```

Projects each element of an observable sequence or Promise to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and concatenates the results into one observable sequence.

```js
source.concatMap(function (x, i) { return Rx.Observable.range(0, x); }, function (x, y, i) { return x + y + i; });
source.concatMap(function (x, i) { return Promise.resolve(x + i); }, function (x, y, i) { return x + y + i; });
```

Projects each element of the source observable sequence to the other observable sequence or Promise and merges the resulting observable sequences into one observable sequence.
 
 ```js
source.concatMap(Rx.Observable.fromArray([1,2,3]));
source.concatMap(Promise.resolve(42));
 ```

#### Arguments
1. `selector` *(`Function`)*:  A transform function to apply to each element or an observable sequence to project each element from the source sequence onto.
2. `[resultSelector]` *(`Function`)*: A transform function to apply to each element of the intermediate sequence.
 
#### Returns
*(`Observable`)*: An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.   

#### Example
```js
var source = Rx.Observable.range(0, 5)
    .concatMap(function (x, i) {
        return Rx.Observable
            .interval(100)
            .take(x).map(function() { return i; }); 
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

// => Next: 1 
// => Next: 2 
// => Next: 2 
// => Next: 3 
// => Next: 3 
// => Next: 3 
// => Next: 4 
// => Next: 4 
// => Next: 4 
// => Next: 4 
// => Completed 

/* Using a promise */
var source = Rx.Observable.fromArray([1,2,3,4])
    .concatMap(function (x, i) {
        return Promise.resolve(x + i);
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

// => Next: 4
// => Next: 4 
// => Next: 4 
// => Next: 4 
// => Completed    
```

### Location

File:
- [`/src/core/linq/observable/concatmap.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/concatmap.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Complete`](http://www.nuget.org/packages/RxJS-Complete/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/concatmap.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/concatmap.js)
