### <a id="connectableobservableprototypeconnect"></a>`ConnectableObservable.prototype.connect()`
<a href="#connectableobservableprototypeconnect">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js#L504 "View in source")

Connects the observable wrapper to its source. All subscribed observers will receive values from the underlying observable sequence as long as the connection is established.

#### Returns
*(Disposable)*: Disposable object used to disconnect the observable wrapper from its source, causing subscribed observer to stop receiving values from the underlying observable sequence.

#### Example
```js
var interval = Rx.Observable.interval(1000);

var source = interval
    .take(2)
    .do(function (x) {
        console.log('Side effect');
    });

var published = source.publish();

published.subscribe(createObserver('SourceA'));
published.subscribe(createObserver('SourceB'));

// Connect the source
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
// => Completed
```

### Location

File:
- [`/src/core/linq/connectableobservable.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/connectableobservable.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.all.js)
- [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Binding`](http://www.nuget.org/packages/RxJS-Binding/)

Unit Tests:
- [`/tests/observable/connectableobservable.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/connectableobservable.js)
