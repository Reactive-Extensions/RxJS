### `Rx.Observable.if(condition, thenSource, [elseSource])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/if.js "View in source") 

Determines whether an observable collection contains values. There is an alias for this method called `ifThen` for browsers <IE9

#### Arguments
1. `condition` *(`Function`)*: The condition which determines if the thenSource or elseSource will be run.
2. `thenSource` *(`Observable`)*: thenSource The observable sequence that will be run if the condition function returns true.
3. `[elseSource]` *(Observable|Scheduler)*: The observable sequence that will be run if the condition function returns false. If this is not provided, it defaults to Rx.Observabe.Empty with the specified scheduler.

#### Returns
*(`Observable`)*: The generated sequence.

#### Example
```js
// This uses and only then source
var shouldRun = true;

var source = Rx.Observable.if(
    function () { return shouldRun; },
    Rx.Observable.return(42)
);

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

// => Next: 42
// => Completed

// The next example uses an elseSource
var shouldRun = false;

var source = Rx.Observable.if(
    function () { return shouldRun; },
    Rx.Observable.return(42),
    Rx.Observable.return(56)
);

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

// => Next: 56
// => Completed
```

### Location

File:
- [/src/core/observable/if.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/if.js)

Dist:
- [rx.all.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.all.js)
- [rx.experimental.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js)

Prerequisites:
- If using `rx.experimental.js` - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Experimental`](http://www.nuget.org/packages/RxJS-Experimental)

Unit Tests:
- [/tests/observable/if.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/if.js)