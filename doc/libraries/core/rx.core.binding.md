# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
# RxJS Core Binding Module #

The Reactive Extensions for JavaScript has a notion of hot and cold observables.  Hot observables fire whether you are listening to them or not, such as mouse movements.  Cold observables on the other hand, such as a sequence created from an array will fire the same sequence to all subscribers.  The Core Binding module gives you the ability to replay events for hot observables, and to turn cold observables into hot observables.  The primary use case is for those who are implementing libraries compatible with RxJS to be able to handle hot and cold observables.

## Details ##

Files:
- [`rx.core.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.core.binding.js)

NPM Packages:
- [`rx-core-binding`](https://www.npmjs.com/package/rx-core-binding)

NuGet Packages:
- _None_

File Dependencies:
- [`rx.core.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.core.js)

NuGet Dependencies:
- _None_

## Included Observable Operators ##

### `Observable Instance Methods`
- [`connect`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/connect.md)
- [`publish`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/publish.md)
- [`publishLast`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/publishlast.md)
- [`publishValue`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/publishvalue.md)
- [`refCount`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/refcount.md)
- [`replay`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/replay.md)
- [`share`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/share.md)
- [`shareLast`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/sharelast.md)
- [`shareReplay`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/sharereplay.md)
- [`shareValue`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/sharevalue.md)
- [`singleInstance`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/singleinstance.md)

## Included Classes ##

### Subjects

- [`Rx.AsyncSubject`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/asyncsubject.md)
- [`Rx.Subject`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/subject.md)
- [`Rx.BehaviorSubject`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.mdapi/subjects/behaviorsubject.md)
- [`Rx.ReplaySubject`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.mdapi/subjects/replaysubject.md)
