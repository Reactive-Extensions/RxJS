# RxJS Core Binding Module #

The Reactive Extensions for JavaScript has a notion of hot and cold observables.  Hot observables fire whether you are listening to them or not, such as mouse movements.  Cold observables on the other hand, such as a sequence created from an array will fire the same sequence to all subscribers.  The Core Binding module gives you the ability to replay events for hot observables, and to turn cold observables into hot observables.  The primary use case is for those who are implementing libraries compatible with RxJS to be able to handle hot and cold observables.

## Details ##

Files:
- [`rx.core.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.core.binding.js)

NPM Packages:
- _None_

NuGet Packages:
- _None_

File Dependencies:
- [`rx.core.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.core.js)

NuGet Dependencies:
- _None_

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

- [`Rx.AsyncSubject`](../api/subjects/asyncsubject.md)
- [`Rx.Subject`](../api/subjects/subject.md)
- [`Rx.BehaviorSubject`](../api/core/observable.mdapi/subjects/behaviorsubject.md)
- [`Rx.ReplaySubject`](../api/core/observable.mdapi/subjects/replaysubject.md)
