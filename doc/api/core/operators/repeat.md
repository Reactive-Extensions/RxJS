### `Rx.Observable.repeat(value, [repeatCount], [scheduler])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/repeat.js "View in source") 

Generates an observable sequence that repeats the given element the specified number of times, using the specified scheduler to send out observer messages.

### Arguments
1. `value` *(`Any`)*: Element to repeat.
2. `[repeatCount=-1]` *(`Number`)*:Number of times to repeat the element. If not specified, repeats indefinitely.
3. `[scheduler=Rx.Scheduler.immediate]` *(`Scheduler`)*: Scheduler to run the producer loop on. If not specified, defaults to Scheduler.immediate.

#### Returns
*(`Observable`)*: An observable sequence that repeats the given element the specified number of times.

#### Example
```js
var source = Rx.Observable.repeat(42, 3);

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

//=> Next: 42 
// => Next: 42
// => Next: 42
// => Completed 
```

### Location

File:
- [/src/core/observable/repeat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/repeat.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [/tests/observable/repeat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/repeat.js)
