# RxJS Backpressure Module #

The Reactive Extensions for JavaScript provides support backpressure for situations when the observable sequences emits too many messages for the observer to consume.  This is in addition to other mechanisms already in place such as `buffer`, `throttle`, `sample` among other operators which allow you to get messages every so often, or in batches.  This module allows you to pause and resume a hot observable with `pausable` and to pause and resume with buffered data with `pausableBuffered`.  In addition, we also support the ability to get a requested number of items from the queue through the `controlled` operator.

## Details ##

Files:
- `rx.backpressure.js`

NPM Packages:
- `rx`

NuGet Packages:
- `RxJS-BackPressure`

File Dependencies:
- `rx.js` | `rx.compat.js`
- `rx.binding.js`

NPM Dependencies:
- None

NuGet Dependencies:
- RxJS-Main
- RxJS-Binding

## Included Observable Operators ##

### `Observable Instance Methods`
- [`controlled`](../api/core/observable.md#rxobservableprototypecontrolledenablequeue)
- [`pausable`](../api/core/observable.md#rxobservableprototypepausablepauser)
- [`pausableBuffered`](../api/core/observable.md#rxobservableprototypepausablebufferedpauser)

