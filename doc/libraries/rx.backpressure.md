# RxJS Backpressure Module #

The Reactive Extensions for JavaScript provides support backpressure for situations when the observable sequences emits too many messages for the observer to consume.  This is in addition to other mechanisms already in place such as `buffer`, `throttle`, `sample` among other operators which allow you to get messages every so often, or in batches.  This module allows you to pause and resume a hot observable with `pausable` and to pause and resume with buffered data with `pausableBuffered`.  In addition, we also support the ability to get a requested number of items from the queue through the `controlled` operator.

## Details ##

Files:
- [`rx.backpressure.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.backpressure.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-BackPressure`](http://www.nuget.org/packages/RxJS-Backpressure/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

File Dependencies:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.binding.js)

NuGet Dependencies:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Binding`](http://www.nuget.org/packages/RxJS-Binding/)

## Included Observable Operators ##

### `Observable Instance Methods`
- [`controlled`](../api/core/operators/controlled.md)
- [`pausable`](../api/core/operators/pausable.md)
- [`pausableBuffered`](../api/core/operators/pausablebuffered.md)

