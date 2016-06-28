### `Rx.Observable.case(selector, sources, [elseSource|scheduler])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/case.js "View in source")

Uses selector to determine which source in sources to use.  There is an alias 'switchCase' for browsers <IE9.

### Arguments
1. `selector` *(`Function`)*: The function which extracts the value for to test in a case statement.
2. `sources` *(`Object`)*: A object which has keys which correspond to the case statement labels.
3. `[elseSource|scheduler]` *(`Observable` | `Scheduler`)*: The observable sequence that will be run if the sources are not matched. If this is not provided, it defaults to `Rx.Observabe.empty` with the specified scheduler.

#### Returns
*(`Observable`)*: An observable sequence which is determined by a case statement.

#### Example
```js
var sources = {
    'foo': Rx.Observable.return(42),
    'bar': Rx.Observable.return(56)
};

var defaultSource = Rx.Observable.empty();

var source = Rx.Observable.case(
    function () {
        return 'foo';
    },
    sources,
    defaultSource);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

//=> Next: 42
//=> Completed
```

### Location

File:
- [`/src/core/linq/observable/case.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/case.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.experimental.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.experimental.js)

Prerequisites:
- If using `rx.experimental.js`
  - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Complete`](http://www.nuget.org/packages/RxJS-Complete)
- [`RxJS-Experimental`](http://www.nuget.org/packages/RxJS-Experimental)

Unit Tests:
- [`/tests/observable/case.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/case.js)
