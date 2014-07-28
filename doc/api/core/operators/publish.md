### `Rx.Observable.prototype.publish([selector])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/publish.js "View in source") 

Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence.

This operator is a specialization of `multicast` using a regular `Rx.Subject`.

#### Arguments
1. `[selector]` *(`Function`)*: Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all notifications of the source from the time of the subscription on.
  
#### Returns
*(ConnectableObservable)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
   
#### Example
```js
/* Without publish */
var interval = Rx.Observable.interval(1000);

var source = interval
    .take(2)
    .do(function (x) { 
        console.log('Side effect');
    });
 
source.subscribe(createObserver('SourceA'));
source.subscribe(createObserver('SourceB'));
 
function createObserver(tag) {
    return Rx.Observer.create(
        function (x) {
            console.log('Next: ' + tag + x);
        },
        function (err) {
            console.log('Error: ' + err);   
        },
        function () {
            console.log('Completed');   
        });
}

// => Side effect
// => Next: SourceA0 
// => Side effect
// => Next: SourceB0 
// => Side effect
// => Next: SourceA1 
// => Completed
// => Side effect
// => Next: SourceB1 
// => Completed  

/* With publish */
var interval = Rx.Observable.interval(1000);

var source = interval
    .take(2)
    .doAction(function (x) { 
        console.log('Side effect');
    });
 
var published = source.publish();
 
published.subscribe(createObserver('SourceA'));
published.subscribe(createObserver('SourceB'));
 
var connection = published.connect();

function createObserver(tag) {
    return Rx.Observer.create(
        function (x) {
            console.log('Next: ' + tag + x);
        },
        function (err) {
            console.log('Error: ' + err);   
        },
        function () {
            console.log('Completed');   
        });
}

// => Side effect 
// => Next: SourceA0 
// => Next: SourceB0 
// => Side effect 
// => Next: SourceA1 
// => Next: SourceB1
// => Completed    
```

### Location

File:
- [`/src/core/linq/observable/publish.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/publish.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) 
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using `rx.binding.js`
  - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Binding`](http://www.nuget.org/packages/RxJS-Binding/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/publish.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/publish.js)
