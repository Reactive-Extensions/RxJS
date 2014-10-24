### `Rx.Observable.jortSort()` [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/jortsort.js "View in source")

The `jortSort` method checks if your inputs are sorted.  Note that this is only for a sequence with an end.

See [http://jort.technology/](http://jort.technology/) for full details.

#### Returns
*(`Observable`)*:  An observable which has a single value of `true` if sorted, else `false`.

#### Example
```js
// Sorted
var source = Rx.Observable.of(1,2,3,4)
  .jortSort();

var subscription = source.subscribe(
  function (x) { console.log('Next: %s', x); },
  function (e) { console.log('Error: %s', e); },
  function ( ) { console.log('Completed'); }
);
// => Next: true
// => Completed

// Non sorted
var source = Rx.Observable.of(3,1,2,4)
  .jortSort();

var subscription = source.subscribe(
  function (x) { console.log('Next: %s', x); },
  function (e) { console.log('Error: %s', e); },
  function ( ) { console.log('Completed'); }
);
// => Next: false
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/jortsort.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/jortsort.js)

Unit Tests:
- [`/tests/observable/jortsort.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/jortsort.js)
