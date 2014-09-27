### `Rx.Observable.prototype.multicast(subject | subjectSelector, [selector])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/multicast.js "View in source")

Multicasts the source sequence notifications through an instantiated subject into all uses of the sequence within a selector function. Each
subscription to the resulting sequence causes a separate multicast invocation, exposing the sequence resulting from the selector function's
invocation. For specializations with fixed subject types, see `publish`, `share`, `publishValue`, `shareValue`, `publishLast`, `replay`, and `shareReplay`.

#### Arguments
1. `subjectSelector` *(`Function`)*:  Factory function to create an intermediate subject through which the source sequence's elements will be multicast to the selector function.
1. `subject` *(Subject)*: Subject to push source elements into.
2. `[selector]` *(`Function`)*: Optional selector function which can use the multicasted source sequence subject to the policies enforced by the created subject. Specified only if `subjectSelector` is provided.

#### Returns
*(`Observable`)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.

#### Example
```js
var subject = new Rx.Subject();
var source = Rx.Observable.range(0, 3)
    .multicast(subject);

var observer = Rx.Observer.create(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    }
);

var subscription = source.subscribe(observer);
subject.subscribe(observer);

var connected = source.connect();

subscription.dispose();

// => Next: 0
// => Next: 0
// => Next: 1
// => Next: 1
// => Next: 2
// => Next: 2
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/multicast.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/multicast.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)
  - [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Binding`](http://www.nuget.org/packages/RxJS-Binding/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/multicast.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/multicast.js)
