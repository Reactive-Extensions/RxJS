# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
# RxJS Lite Aggregates Module #

The Reactive Extensions for JavaScript has a number of aggregation operators including those you might already know from the Array#extras and the upcoming ES6 standard such as `reduce`, `find` and `findIndex`.  This module is used exclusively for aggregation operations used on finite observable sequences.  In addition to the aforementioned operators, there are many useful operators such as `count`, `sum`, `average` and determining whether two sequences are equal via the `sequenceEqual` method.  This module is designed to work with the `rx-lite` NPM module for both the standards-compliant version as well as compat for older browsers.

## Details ##

Files:
- [`rx.lite.aggregates.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/modules/rx-lite-aggregates/rx.lite.aggregates.js)
[`rx.lite.aggregates.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/modules/rx-lite-aggregates-compat/rx.lite.aggregates.compat.js)

NPM Packages:
- [`rx-lite-aggregates`](https://www.npmjs.org/package/rx)

File Dependencies:
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

## Included Observable Operators ##

### `Observable Instance Methods`
- [`aggregate`](../../api/core/operators/reduce.md)
- [`all`](../../api/core/operators/every.md)
- [`any`](../../api/core/operators/some.md)
- [`average`](../../api/core/operators/average.md)
- [`includes`](../../api/core/operators/includes.md)
- [`count`](../../api/core/operators/count.md)
- [`elementAt`](../../api/core/operators/elementat.md)
- [`every`](../../api/core/operators/every.md)
- [`find`](../../api/core/operators/find.md)
- [`findIndex`](../../api/core/operators/findindex.md)
- [`first`](../../api/core/operators/first.md)
- [`indexOf`](../../api/core/operators/indexof.md)
- [`isEmpty`](../../api/core/operators/isempty.md)
- [`last`](../../api/core/operators/last.md)
- [`lastIndexOf`](../../api/core/operators/lastindexof.md)
- [`max`](../../api/core/operators/max.md)
- [`maxBy`](../../api/core/operators/maxby.md)
- [`min`](../../api/core/operators/min.md)
- [`minBy`](../../api/core/operators/minby.md)
- [`reduce`](../../api/core/operators/reduce.md)
- [`sequenceEqual`](../../api/core/operators/sequenceequal.md)
- [`single`](../../api/core/operators/single.md)
- [`slice`](../../api/core/operators/slice.md)
- [`some`](../../api/core/operators/some.md)
- [`sum`](../../api/core/operators/sum.md)
- [`toMap`](../../api/core/operators/tomap.md)
- [`toSet`](../../api/core/operators/toset.md)
