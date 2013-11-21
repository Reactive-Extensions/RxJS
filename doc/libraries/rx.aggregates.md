# RxJS Aggregates Module #

The Reactive Extensions for JavaScript has a number of aggregation operators including those you might already know from the Array#extras and the upcoming ES6 standard such as `reduce`, `find` and `findIndex`.  This module is used exclusively for aggregation operations used on finite observable sequences.  In addition to the aforementioned operators, there are many useful operators such as `count`, `sum`, `average` and determining whether two sequences are equal via the `sequenceEqual` method.

## Details ##

Files:
- `rx.aggregates.js`

NPM Packages:
- `rx`

NuGet Packages:
- `RxJS-Aggregates`

File Dependencies:
- `rx.js` | `rx.compat.js` | `rx.lite.js` | `rx.lite.compat.js`

NPM Dependencies:
- None

NuGet Dependencies:
- RxJS-Main

## Included Observable Operators ##

### `Observable Instance Methods`
- [`aggregate`](../api/core/observable.md#rxobservableprototypeaggregateseed-accumulator)
- [`all`](../api/core/observable.md#rxobservableprototypeallpredicate-thisarg)
- [`any`](../api/core/observable.md#rxobservableprototypeanypredicate-thisarg)
- [`average`](../api/core/observable.md#rxobservableprototypeaverageselector)
- [`contains`](../api/core/observable.md#rxobservableprototypecontainsvalue-comparer)
- [`count`](../api/core/observable.md#rxobservableprototypecountpredicate)
- [`elementAt`](../api/core/observable.md#rxobservableprototypeelementatindex)
- [`elementAtOrDefault`](../api/core/observable.md#rxobservableprototypeelementatordefaultindex-defaultvalue)
- [`every`](../api/core/observable.md#rxobservableprototypeeverypredicate-thisarg)
- [`find`](../api/core/observable.md#rxobservableprototypefindpredicate-thisarg)
- [`findIndex`](../api/core/observable.md#rxobservableprototypefindindexpredicate-thisarg)
- [`first`](../api/core/observable.md#rxobservableprototypefirstpredicate-thisarg)
- [`firstOrDefault`](../api/core/observable.md#rxobservableprototypefirstordefaultpredicate-defaultvalue-thisarg)
- [`isEmpty`](../api/core/observable.md#rxobservableprototypeisempty)
- [`last`](../api/core/observable.md#rxobservableprototypelastpredicate-thisarg)
- [`lastOrDefault`](../api/core/observable.md#rxobservableprototypelastordefaultpredicate-defaultvalue-thisarg)
- [`let | letBind`](../api/core/observable.md#rxobservableprototypeletfunc)
- [`max`](../api/core/observable.md#rxobservableprototypemaxcomparer)
- [`maxBy`](../api/core/observable.md#rxobservableprototypemaxbykeyselector-comparer)
- [`min`](../api/core/observable.md#rxobservableprototypemincomparer)
- [`minBy`](../api/core/observable.md#rxobservableprototypeminbykeyselector-comparer)
- [`reduce`](../api/core/observable.md#rxobservableprototypereduceaccumulator-seed)
- [`sequenceEqual`](../api/core/observable.md#rxobservableprototypesequenceequalsecond-comparer)
- [`single`](../api/core/observable.md#rxobservableprototypesinglepredicate-thisarg)
- [`singleOrDefault`](../api/core/observable.md#rxobservableprototypesingleordefaultpredicate-defaultvalue-thisarg)
- [`some`](../api/core/observable.md#rxobservableprototypesomepredicate-thisarg)
- [`sum`](../api/core/observable.md#rxobservableprototypesumkeyselector-thisarg)
