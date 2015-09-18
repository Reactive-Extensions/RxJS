### `Rx.Observable.prototype.single([predicate], [thisArg], [defaultValue])`
### `Rx.Observable.prototype.single([settings])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/first.js "View in source")

Returns a single element of an observable sequence that satisfies the condition in the predicate, or a default value if no such element exists.  If no default value is given, then `onError` will be called.  If there are more than one element that matches, then `onError` will be called.

#### Arguments

`Rx.Observable.prototype.single([predicate], [thisArg], [defaultValue])`

1. `[predicate]` *(`Function`)*: A predicate function to evaluate for elements in the source sequence. The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(`Any`)*: Object to use as `this` when executing the predicate.
3. `[defaultValue]` *(`Any`)*: Default value if no such element exists.

`Rx.Observable.prototype.single([settings])`
1. `[settings]` *(`Object`)*: An object with the following fields
    - `[predicate]` *(`Function`)*: A predicate function to evaluate for elements in the source sequence. The callback is called with the following information:
        1. the value of the element
        2. the index of the element
        3. the Observable object being subscribed
    - `[thisArg]` *(`Any`)*: Object to use as `this` when executing the predicate.
    - `[defaultValue]` *(`Any`)*: Default value if no such element exists.

#### Returns
*(`Observable`)*: An observable sequence that contains elements from the input sequence that satisfy the condition.

#### Example
```js
/* with a default value */
var source = Rx.Observable.empty().single({defaultValue: 42});

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

// => Next: 42
// => Completed

/* With a predicate */
var source = Rx.Observable.range(0, 10)
  .single(function (x, idx, obs) { return x ===  1; });

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

// => Next: 1
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/single.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/single.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.aggregates.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.aggregates.js)

Prerequisites:
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

Unit Tests:
- [`/tests/observable/single.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/single.js)
