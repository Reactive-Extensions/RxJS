### `Rx.Observable.ofArrayChanges(array)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/ofarraychanges.js "View in source")

Creates an Observable sequence from changes to an array using `Array.observe`.

#### Arguments
1. `array` *(`Array`)*: The array to observe changes using `Array.observe`

#### Returns
*(`Observable`)*: An observable sequence containing changes to an array from `Array.observe`.

#### Example
```js
var arr = [1,2,3];
var source = Rx.Observable.ofArrayChanges(arr);

var subscription = source.subscribe(
  function (x) {
    console.log('Next: %s', x);
  },
  function (err) {
    console.log('Error: %s', err);
  },
  function () {
    console.log('Completed');
  });

arr.push(4);

// => Next: {type: "splice", object: Array[4], index: 3, removed: Array[0], addedCount: 1}
```

### Location

File:
- [`/src/core/linq/observable/ofarraychanges.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/ofarraychanges.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)

Prerequisites:
- None

NPM Packages:
- None

NuGet Packages:
- [`RxJS-Complete`](http://www.nuget.org/packages/RxJS-Complete)

Unit Tests:
- [`/tests/observable/ofarraychanges.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/ofarraychanges.js)
