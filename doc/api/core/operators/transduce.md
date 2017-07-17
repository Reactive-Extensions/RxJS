# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
### `Rx.Observable.prototype.transduce(transducer)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/transduce.js "View in source")

Executes a transducer to transform the observable sequence.  

Transducers are composable algorithmic transformations. They are independent from the context of their input and output sources and specify only the essence of the transformation in terms of an individual element. Because transducers are decoupled from input or output sources, they can be used in many different processes such as Observable sequences. Transducers compose directly, without awareness of input or creation of intermediate aggregates.

Such examples of transducers libraries are [transducers-js](https://github.com/cognitect-labs/transducers-js) from Cognitect and [transducers.js](https://github.com/jlongster/transducers.js) from James Long.

In order for this operator to work, the transducers library must follow the following contract:
```js
return {
  '@@transducer/init': function() {
    // Return the item
    return observer;
  },
  '@@transducer/step': function(obs, input) {
    // Process next item
    return obs.onNext(input);
  },
  '@@transducer/result': function(obs) {
    // Mark completion
    return obs.onCompleted();
  }
};
```

### Arguments
1. `transducer` *(`Transducer`)*: A transducer to execute.

#### Returns
*(`Observable`)*: An observable sequence that results from the transducer execution.

#### Example

Below is an example using [transducers-js](https://github.com/cognitect-labs/transducers-js).
```js
function even (x) { return x % 2 === 0; }
function mul10(x) { return x * 10; }

var t = transducers

var source = Rx.Observable.range(1, 5)
  .transduce(t.comp(t.filter(even), t.map(mul10)));

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

// => Next: 20
// => Next: 40
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/transduce.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/transduce.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/transduce.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/transduce.js)
