# RxJS Experimental Module #

The Reactive Extensions for JavaScript has a number of operators that are considered experimental and not ready for mainstream usage.  This includes imperative operators such as `if`, `case`, `for`, `while`, `doWhile` as well as operators such as `forkJoin`.

## Details ##

Files:
- [`rx.experimental.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.experimental.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Experimental`](http://www.nuget.org/packages/RxJS-Experimental/)

File Dependencies:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NuGet Dependencies:
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)

## Included Observable Operators ##

### `Observable Methods`
- [`case | switchCase`](../../api/core/operators/case.md)
- [`for | forIn`](../../api/core/operators/for.md)
- [`forkJoin`](../../api/core/operators/forkjoin.md)
- [`if | ifThen`](../../api/core/operators/if.md)
- [`while | whileDo`](../../api/core/operators/while.md)

### `Observable Instance Methods`
- [`doWhile`](/api/core/operators/dowhile.md)
- [`expand`](../../api/core/operators/expand.md)
- [`extend`](../../api/core/operators/manyselect.md)
- [`forkJoin`](../../api/core/operators/forkjoinproto.md)
- [`let | letBind`](../../api/core/operators/let.md)
- [`manySelect`](../../api/core/operators/manyselect.md)
- [`exclusive`](../../api/core/operators/exclusive.md)
- [`exclusivemap`](../../api/core/operators/exclusivemap.md)
