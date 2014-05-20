# RxJS Core Module #

The Reactive Extensions for JavaScript's lite extras are the operators that are found on `rx.js` and `rx.compat.js` but not available in `rx.lite.js` and `rx.lite.compat.js`.  By adding this file, you will have full access to all operators and thus makes including other files such as `rx.time.js`, `rx.joinpatterns.js` and others easier.

## Details ##

Files:
- [`rx.lite.extras.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.extras.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

File Dependencies:
- None

NPM Dependencies:
- None

NuGet Dependencies:
- None

## Included Observable Operators ##

### `Observable Methods`
- [`amb`](../api/core/observable.md#rxobservableambargs)
- [`onErrorResumeNext`](../api/core/observable.md#rxobservableonerrorresumenextargs)
- [`using`](../api/core/observable.md#rxobservableusingresourcefactory-observablefactory)

### `Observable Instance Methods`
- [`amb`](../api/core/observable.md#rxobservableprototypeambrightsource)
- [`bufferWithCount`](../api/core/observable.md#rxobservableprototypebufferwithcountcount-skip)
- [`distinct`](../api/core/observable.md#rxobservableprototypedistinctkeyselector-keyserializer)
- [`groupBy`](../api/core/observable.md#rxobservableprototypegroupbykeyselector-elementselector-keyserializer)
- [`groupByUntil`](../api/core/observable.md#rxobservableprototypegroupbyuntilkeyselector-elementselector-durationselector-keyserializer)
- [`observeOn`](../api/core/observable.md#rxobservableprototypeobserveonscheduler)
- [`onErrorResumeNext`](../api/core/observable.md#rxobservableprototypeonerrorresumenextsecond)
- [`subscribeOn`](../api/core/observable.md#rxobservableprototypesubscribeonscheduler)
- [`windowWithCount`](../api/core/observable.md#rxobservableprototypewindowwithcountcount-skip)
