# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
# RxJS Lite Experimental Module #

The Reactive Extensions for JavaScript has a number of operators that are considered experimental and not ready for mainstream usage.  This includes imperative operators such as `if`, `case`, `for`, `while`, `doWhile` as well as operators such as `forkJoin`. This module is designed to work with the `rx-lite` NPM module for both the standards-compliant version as well as compat for older browsers.

## Details ##

Files:
- [`rx.lite.experimental.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/modules/rx-lite-experimental/rx.lite.experimental.js)
- [`rx.lite.experimental.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/modules/rx-lite-experimental-compat/rx.lite.experimental.compat.js)

NPM Packages:
- [`rx-lite-experimental`](https://www.npmjs.org/package/rx-lite-experimental)
- [`rx-lite-experimental-compat`](https://www.npmjs.org/package/rx-lite-experimental-compat)

File Dependencies:
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

## Included Observable Operators ##

### `Observable Methods`
- [`case`](../../api/core/operators/case.md)
- [`for`](../../api/core/operators/for.md)
- [`forkJoin`](../../api/core/operators/forkjoin.md)
- [`if`](../../api/core/operators/if.md)
- [`while`](../../api/core/operators/while.md)

### `Observable Instance Methods`
- [`doWhile`](/api/core/operators/dowhile.md)
- [`expand`](../../api/core/operators/expand.md)
- [`extend`](../../api/core/operators/manyselect.md)
- [`flatMapFirst`](../../api/core/operators/flatmapfirst.md)
- [`flatMapWithMaxConcurrent`](../../api/core/flatmapwithmaxconcurrent.md)
- [`forkJoin`](../../api/core/operators/forkjoinproto.md)
- [`let`](../../api/core/operators/let.md)
- [`manySelect`](../../api/core/operators/manyselect.md)
- [`selectSwitchFirst`](../../api/core/operators/flatmapfirst.md)
- [`selectWithMaxConcurrent`](../../api/core/operators/flatmapwithmaxconcurrent.md)
