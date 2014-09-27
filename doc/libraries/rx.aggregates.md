# RxJS Aggregates Module #

The Reactive Extensions for JavaScript has a number of aggregation operators including those you might already know from the Array#extras and the upcoming ES6 standard such as `reduce`, `find` and `findIndex`.  This module is used exclusively for aggregation operations used on finite observable sequences.  In addition to the aforementioned operators, there are many useful operators such as `count`, `sum`, `average` and determining whether two sequences are equal via the `sequenceEqual` method.

## Details ##

Files:
- [`rx.aggregates.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.aggregates.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

File Dependencies:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NuGet Dependencies:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/) | [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Main/)

## Included Observable Operators ##

### `Observable Instance Methods`
- [`aggregate`](../api/core/operators/aggregate.md)
- [`all`](../api/core/operators/all.md)
- [`any`](../api/core/operators/any.md)
- [`average`](../api/core/operators/average.md)
- [`contains`](../api/core/operators/contains.md)
- [`count`](../api/core/operators/count.md)
- [`elementAt`](../api/core/operators/elementat.md)
- [`elementAtOrDefault`](../api/core/operators/elementatordefault.md)
- [`every`](../api/core/operators/all.md)
- [`find`](../api/core/operators/find.md)
- [`findIndex`](../api/core/operators/findindex.md)
- [`first`](../api/core/operators/first.md)
- [`firstOrDefault`](../api/core/operators/firstordefault.md)
- [`isEmpty`](../api/core/operators/isempty.md)
- [`last`](../api/core/operators/last.md)
- [`lastOrDefault`](../api/core/operators/lastordefault.md)
- [`max`](../api/core/operators/max.md)
- [`maxBy`](../api/core/operators/maxby.md)
- [`min`](../api/core/operators/min.md)
- [`minBy`](../api/core/operators/minby.md)
- [`reduce`](../api/core/operators/reduce.md)
- [`sequenceEqual`](../api/core/operators/sequenceequal.md)
- [`single`](../api/core/operators/single.md)
- [`singleOrDefault`](../api/core/operators/singleordefault.md)
- [`some`](../api/core/operators/any.md)
- [`sum`](../api/core/operators/sum.md)
- [`toMap`](../api/core/operators/tomap.md)
- [`toSet`](../api/core/operators/toset.md)
