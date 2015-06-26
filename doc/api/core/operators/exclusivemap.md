### `Rx.Observable.prototype.exclusive()` ##
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/exclusivemap.js "View in source")

Receives an Observable of Observables and transforms items from the first Observable exclusively until it completes before it begins subscribes to the next Observable.  Observables that come before the current Observable completes will be dropped and will not propogate.

This operator is similar to using `.concatAll().map()` except that it will not hold onto Observables that come in before the current one is finished completed.

#### Arguments

1. `selector` *(`Observable`)*: A selector function to invoke for every item in the current subscription
2. `thisArg` *(`Any`)*: An optional context to invoke with the selector

#### Returns
*(`Observable`)*: An Observable sequence that is the result of concatenating non-overlapping items emitted by an Observable of Observables and transforming them through a selector function

#### Example

```javascript

//Generate an event every 100 milliseconds
var source = Rx.Observable.generateWithRelativeTime(
     0,
     function(x) {return x < 5; },
     function(x) {return x + 1; },
     function(x) {return x; },
     function(x) {return 100; })
    .map(function(value) {
      //Observable takes 150 milliseconds to complete
      return Rx.Observable.timer(150).map(function(){ return value; });
    });
     
     
source.exclusiveMap(function(v) { 
  return v * v;
 })
 .subscribe(
       function (x) {
        console.log("Next %d", x);
       }, function(e) {
        console.log("Error %s", e);
       }, function() {
        console.log("Completed");
       });


// Next 0
// Next 4
// Next 16
// Completed
```


#### Location

File: 
- [`/src/core/linq/observable/exclusivemap.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/exclusive.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.experimental.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.experimental.js)
- [`rx.experimental-lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.experimental-lite.js)
- [`rx.experimental-lite-compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.experimental-lite-compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Experimental`](http://www.nuget.org/packages/RxJS-Experimental/)

Unit Tests:
- [`/tests/observable/exclusivemap.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/exclusivemap.js)
