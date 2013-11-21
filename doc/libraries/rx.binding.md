# RxJS Binding Module #

The Reactive Extensions for JavaScript has a notion of hot and cold observables.  Hot observables fire whether you are listening to them or not, such as mouse movements.  Cold observables on the other hand, such as a sequence created from an array will fire the same sequence to all subscribers.  The Binding module gives you the ability to replay events for hot observables, and to turn cold observables into hot observables.

## Details ##

Files:
- `rx.binding.js`

NPM Packages:
- `rx`

NuGet Packages:
- `RxJS-Binding`

File Dependencies:
- `rx.js` | `rx.compat.js`

NPM Dependencies:
- None

NuGet Dependencies:
- RxJS-Main

## Included Observable Operators ##

### `Observable Instance Methods`
- [`connect`](../api/core/observable.md#connectableobservableprototypeconnect)
- [`publish`](../api/core/observable.md#rxobservableprototypepublishselector)
- [`publishLast`](../api/core/observable.md#rxobservableprototypepublishlatestselector)
- [`publishValue`](../api/core/observable.md#rxobservableprototypepublishvalueselector)
- [`refCount`](../api/core/observable.md#connectableobservableprototyperefcount)
- [`replay`](../api/core/observable.md#rxobservableprototypereplayselector-buffersize-window-scheduler)

## Included Classes ##

### Subjects

- [`Rx.BehaviorSubject`](../api/core/observable.mdapi/subjects/behaviorsubject.md)
- [`Rx.ReplaySubject`](../api/core/observable.mdapi/subjects/replaysubject.md)

