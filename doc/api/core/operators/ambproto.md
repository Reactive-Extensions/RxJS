### <a id="rxobservableprototypeambrightsource"></a>`Rx.Observable.prototype.amb(rightSource)`
<a href="#rxobservableprototypeambrightsource">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/ambproto.js "View in source")

Propagates the observable sequence that reacts first.

#### Arguments
1. `rightSource` *(`Observable`)*: Second observable sequence.

#### Returns
*(`Observable`)*: An observable sequence that surfaces either of the given sequences, whichever reacted first.

#### Example
```js
var first = Rx.Observable.timer(300).map(function () { return 'first'; });
var second = Rx.Observable.timer(500).map(function () { return 'second'; });

var source = first.amb(second);

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

// => Next: first
// => Completed
```

### Location

File:
- [/src/core/linq/observable/ambproto.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/ambproto.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.lite.extras.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.extras.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [/tests/observable/amb.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/amb.js)
