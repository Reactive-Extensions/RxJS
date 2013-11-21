# RxJS Experimental Module #

The Reactive Extensions for JavaScript has a number of operators that are considered experimental and not ready for mainstream usage.  This includes imperative operators such as `if`, `case`, `for`, `while`, ``](../api/core/observable.md../api/core/observable.md` as well as operators such as `forkJoin`.

## Details ##

Files:
- `rx.experimental.js`

NPM Packages:
- `rx`

NuGet Packages:
- `RxJS-Experimental`

File Dependencies:
- `rx.js` | `rx.compat.js` | `rx.lite.js` | `rx.lite.compat.js`

NPM Dependencies:
- None

NuGet Dependencies:
- RxJS-Main

## Included Observable Operators ##

### `Observable Methods`
- [`case | switchCase`](../api/core/observable.md#rxobservablecaseselector-sources-elsesourcescheduler)
- [`for | forIn`](../api/core/observable.md#rxobservableforsources-resultselector)
- [`forkJoin`](../api/core/observable.md#rxobservableforkjoinargs)
- [`if | ifThen`](../api/core/observable.md#rxobservableifcondition-thensource-elsesource)
- [`while | whileDo`](../api/core/observable.md#rxobservablewhilecondition-source)

### `Observable Instance Methods`
- [`doWhile`](../api/core/observable.md../api/core/observable.md`](../api/core/observable.md#rxobservableprototypedowhilecondition-source)
- [`expand`](../api/core/observable.md#rxobservableprototypeexpandselector-scheduler)
- [`forkJoin`](../api/core/observable.md#rxobservableprototypeforkjoinsecond-resultselector)
- [`let | letBind`](../api/core/observable.md#rxobservableprototypeletfunc)
- [`manySelect`](../api/core/observable.md#rxobservableprototypemanyselectselector-scheduler)
