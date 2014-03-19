# RxJS Async Module #

The Reactive Extensions for JavaScript provides support for bridging to events, promises, callbacks, Node.js-style callbacks and more.  This module contains all of that functionality.  In addition, this also supports taking ordinary functions and turning them into asynchronous functions via Observable sequences.

This comes with both `rx.async.js` which is for use in modern development environments such as > IE9 and server-side environments such as Node.js.  We also have `rx.async.compat.js` which has backwards compatibility to browsers which do not support all required ES5 features.

## Details ##

Files:
- `rx.async.js`
- `rx.async.compat.js`

NPM Packages:
- `rx`

NuGet Packages:
- `RxJS-Async`

File Dependencies:
- `rx.js` | `rx.compat.js`
- `rx.binding.js`

NPM Dependencies:
- None

NuGet Dependencies:
- RxJS-Main
- RxJS-Binding

## Included Observable Operators ##

### `Observable Methods`
- [`fromCallback`](../api/core/observable.md#rxobservablefromcallbackfunc-scheduler-context-selector)
- [`fromEvent`](../api/core/observable.md#rxobservablefromeventelement-eventname-selector)
- [`fromEventPattern`](../api/core/observable.md#rxobservablefromeventpatternaddhandler-removehandler-selector)
- [`fromNodeCallback`](../api/core/observable.md#rxobservablefromnodecallbackfunc-scheduler-context-selector)
- [`fromPromise`](../api/core/observable.md#rxobservablefrompromisepromise)
- [`start`](../api/core/observable.md#rxobservablestartfunc-scheduler-context)
- [`startAsync`](../api/core/observable.md#rxobservablestartasyncfunctionasync)
- [`toAsync`](../api/core/observable.md#rxobservabletoasyncfunc-scheduler-context)
