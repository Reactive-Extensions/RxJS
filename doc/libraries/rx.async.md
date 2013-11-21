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
- [`fromCallback`](#rxobservablefromcallbackfunc-scheduler-context-selector)
- [`fromEvent`](#rxobservablefromeventelement-eventname-selector)
- [`fromEventPattern`](#rxobservablefromeventpatternaddhandler-removehandler-selector)
- [`fromNodeCallback`](#rxobservablefromnodecallbackfunc-scheduler-context-selector)
- [`fromPromise`](#rxobservablefrompromisepromise)
- [`start`](#rxobservablestartfunc-scheduler-context)
- [`toAsync`](#rxobservabletoasyncfunc-scheduler-context)
