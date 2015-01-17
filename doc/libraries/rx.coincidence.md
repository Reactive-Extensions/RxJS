# RxJS Coincidence Module #

The Reactive Extensions for JavaScript has a set of coincidence-based operators such as `join` and `groupJoin` which allow one to correlate two observable sequences much as you would do in SQL.  There is also support for advanced windowing and bufferring capabilities which allow for the specification of opening and closing observable sequences to denote how much data to capture.

## Details ##

Files:
- [`rx.coincidence.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.coincidence.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Coincidence`](http://www.nuget.org/packages/RxJS-Coincidence/)

File Dependencies:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NuGet Dependencies:
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)

## Included Observable Operators ##

## `Observable Instance Methods`
- [`buffer`](../api/core/operators/buffer.md)
- [`groupBy`](../api/core/operators/groupby.md)
- [`groupByUntil`](../api/core/operators/groupbyuntil.md)
- [`groupJoin`](../api/core/operators/groupjoin.md)
- [`join`](../api/core/operators/join.md)
- [`pairwise`](../api/core/operators/pairwise.md)
- [`partition`](../api/core/operators/partition.md)
- [`window`](../api/core/operators/window.md)
