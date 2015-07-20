# RxJS Lite Coincidence Module #

The Reactive Extensions for JavaScript has a set of coincidence-based operators such as `join` and `groupJoin` which allow one to correlate two observable sequences much as you would do in SQL.  There is also support for advanced windowing and bufferring capabilities which allow for the specification of opening and closing observable sequences to denote how much data to capture. This module is designed to work with the `rx-lite` NPM module for both the standards-compliant version as well as compat for older browsers.

## Details ##

Files:
- [`rx.lite.coincidence.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/modules/rx-lite-coincidence/rx.lite.coincidence.js)
- [`rx.lite.coincidence.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/modules/rx-lite-coincidence-compat/rx.lite.coincidence.compat.js)

NPM Packages:
- [`rx-lite-coincidence`](https://www.npmjs.org/package/rx-lite-coincidence)
- [`rx-lite-coincidence-compat`](https://www.npmjs.org/package/rx-lite-coincidence-compat)

File Dependencies:
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

## Included Observable Operators ##

## `Observable Instance Methods`
- [`buffer`](../../api/core/operators/buffer.md)
- [`groupBy`](../../api/core/operators/groupby.md)
- [`groupByUntil`](../../api/core/operators/groupbyuntil.md)
- [`groupJoin`](../../api/core/operators/groupjoin.md)
- [`join`](../../api/core/operators/join.md)
- [`pairwise`](../../api/core/operators/pairwise.md)
- [`partition`](../../api/core/operators/partition.md)
- [`window`](../../api/core/operators/window.md)
