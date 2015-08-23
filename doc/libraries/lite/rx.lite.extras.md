# RxJS Lite Extras #

The Reactive Extensions for JavaScript's lite extras are the operators that are found on `rx.js` and `rx.compat.js` but not available in `rx.lite.js` and `rx.lite.compat.js`.  By adding this file, you will have full access to all operators and thus makes including other files such as `rx.time.js`, `rx.joinpatterns.js` and others easier.

## Details ##

Files:
- [`rx.lite.extras.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.extras.js)

NPM Packages:
- [`rx-lite-extras`](https://www.npmjs.org/package/rx-lite-extras)

NuGet Packages:
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

File Dependencies:
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

## Included Observable Operators ##

### `Observable Methods`
- [`amb`](../../api/core/operators/amb.md)
- [`generate`](../../api/core/operators/generate.md)
- [`onErrorResumeNext`](../../api/core/operators/onerrorresumenext.md)
- [`using`](../../api/core/operators/using.md)

### `Observable Instance Methods`
- [`amb`](../../api/core/operators/ambproto.md)
- [`bufferWithCount`](../../api/core/operators/bufferwithcount.md)
- [`distinct`](../../api/core/operators/distinct.md)
- [`observeOn`](../../api/core/operators/observeon.md)
- [`onErrorResumeNext`](../../api/core/operators/onerrorresumenext.md)
- [`subscribeOn`](../../api/core/operators/subscribeon.md)
- [`takeLastBuffer`](../../api/core/operators/takelastbuffer.md)
- [`windowWithCount`](../../api/core/operators/windowwithcount.md)
