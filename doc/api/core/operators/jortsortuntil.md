### `Rx.Observable.jorSort()` [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/jortsortuntil.js "View in source")

The `jortSort` method checks if your inputs are sorted until another Observable sequence fires.

See [http://jort.technology/](http://jort.technology/) for full details.

#### Arguments
1. `other` *(`Observable`)*: The Observable sequence which will cause the termination of the sequence.

#### Returns
*(`Observable`)*:  An observable which has a single value of `true` if sorted, else `false`.

#### Example
```js
var just = Rx.helpers.just;

// Sorted
var source = Rx.Observable.of(1,2,3,4)
  .flatMap(function (x) {
    return Rx.Observable.timer(1000).map(just(x));
  })
  .jortSortUntil(Rx.Observable.timer(3000));

var subscription = source.subscribe(
  function (x) { console.log('Next: %s', x); },
  function (e) { console.log('Error: %s', e); },
  function ( ) { console.log('Completed'); }
);
// => Next: true
// => Completed

// Non sorted
var source = Rx.Observable.of(3,1,2,4)
  .flatMap(function (x) {
    return Rx.Observable.timer(1000).map(just(x));
  })
  .jortSortUntil(Rx.Observable.timer(3000));

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
- [`/src/core/linq/observable/jortsortuntil.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/jortsortuntil.js)

Unit Tests:
- [`/tests/observable/jortsortuntil.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/jortsortuntil.js)
