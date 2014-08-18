### `Rx.Observable.prototype.takeLastWithTime(duration, [timeScheduler], [loopScheduler])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takelastwithtime.js "View in source") 

Returns elements within the specified duration from the end of the observable source sequence, using the specified schedulers to run timers and to drain the collected elements.

#### Arguments
1. `duration` *(`Number`)*: Duration for taking elements from the end of the sequence.
2. `[timeScheduler=Rx.Scheduler.timeout]` *(`Scheduler`)*: Scheduler to run the timer on. If not specified, defaults to timeout scheduler.
2. `[loopScheduler=Rx.Scheduler.currentThread]` *(`Scheduler`)*: Scheduler to drain the collected elements. If not specified, defaults to current thread scheduler.

#### Returns
*(`Observable`)*: An observable sequence with the elements taken during the specified duration from the end of the source sequence.
    
#### Example
```js
var source = Rx.Observable.timer(0, 1000)
    .take(10)
    .takeLastWithTime(5000);
    
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

// => Next: 5
// => Next: 6
// => Next: 7
// => Next: 8
// => Next: 9
// => Completed 
```

### Location

File:
- [`/src/core/linq/observable/takelastwithtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takelastwithtime.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using `rx.time.js`
  - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/skipuntilwithtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/takelastwithtime.js)