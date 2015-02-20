# RxJS Binding Module #

The Reactive Extensions for JavaScript has a notion of hot and cold observables.  Hot observables fire whether you are listening to them or not, such as mouse movements.  Cold observables on the other hand, such as a sequence created from an array will fire the same sequence to all subscribers.  The Binding module gives you the ability to replay events for hot observables, and to turn cold observables into hot observables.

## Details ##

Files:
- [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.binding.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Binding`](http://www.nuget.org/packages/RxJS-Binding/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

File Dependencies:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NuGet Dependencies:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)

## Included Observable Operators ##

### `Observable Instance Methods`
- [`connect`](../api/core/operators/connect.md)
- [`publish`](../api/core/operators/publish.md)
- [`publishLast`](../api/core/operators/publishlast.md)
- [`publishValue`](../api/core/operators/publishvalue.md)
- [`refCount`](../api/core/operators/refcount.md)
- [`replay`](../api/core/operators/replay.md)
- [`share`](../api/core/operators/share.md)
- [`shareLast`](../api/core/operators/sharelast.md)
- [`shareReplay`](../api/core/operators/sharereplay.md)
- [`shareValue`](../api/core/operators/sharevalue.md)
- [`singleInstance`](../api/core/operators/singleinstance.md)

## Included Classes ##

### Subjects

- [`Rx.BehaviorSubject`](../api/core/observable.mdapi/subjects/behaviorsubject.md)
- [`Rx.ReplaySubject`](../api/core/observable.mdapi/subjects/replaysubject.md)
