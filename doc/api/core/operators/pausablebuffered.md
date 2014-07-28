### `Rx.Observable.prototype.pausableBuffered(pauser)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/backpressure/pausablebuffered.js "View in source") 

Pauses the underlying observable sequence based upon the observable sequence which yields true/false, and yields the values that were buffered while paused. Note that this only works on hot observables.

#### Arguments
1. `pauser` *(Rx.Subject)*: The observable sequence used to pause the underlying sequence.

#### Returns
*(`Observable`)*: The observable sequence which is paused based upon the pauser.

#### Example
```js
var pauser = new Rx.Subject();
var source = Rx.Observable.interval(1000).pausableBuffered(pauser);
    
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

// To begin the flow
pauser.onNext(true);

// To pause the flow at any point
pauser.onNext(false);

// Resume the flow which empties the queue from when you last paused
pauser.onNext(true);
```
### Location

File:
- [`/src/core/backpressure/pausablebuffered.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/backpressure/pausablebuffered.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [rx.backpressure.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.backpressure.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using `rx.backpressure.js`
    - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
    - [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-BackPressure`](http://www.nuget.org/packages/RxJS-BackPressure/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/pausablebuffered.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/pausablebuffered.js)
