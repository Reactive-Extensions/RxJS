# Transducers with Observable Sequences #

Much like Language Integrated Query (LINQ), Transducers are composable algorithmic transformations. They, like LINQ, are independent from the context of their input and output sources and specify only the essence of the transformation in terms of an individual element. Because transducers are decoupled from input or output sources, they can be used in many different processes - collections, streams, observables, etc. Transducers compose directly, without awareness of input or creation of intermediate aggregates.  There are two major libraries currently out there, Cognitect's [`transducer-js`](https://github.com/cognitect-labs/transducers-js) and James Long's [`transducers.js`](https://github.com/jlongster/transducers.js) which are both great for getting high performance over large amounts of data.  Because it is collection type neutral, it is a perfect fit for RxJS to do transformations over large collections.

The word `transduce` is just a combination of `transform` and `reduce`. The reduce function is the base transformation; any other transformation can be expressed in terms of it (`map`, `filter`, etc).
```js
var arr = [1, 2, 3, 4];

arr.reduce(
  function(result, x) { return result.concat(x + 1); }, []);

// => [ 2, 3, 4, 5 ]
```

Using transducers, we can model the following behavior while breaking apart the map aspect of adding 1 to the concat operation, adding the seed and then the "collection" to transduce.

```js
var arr = [1, 2, 3, 4];

function increment(x) { return x + 1; }
function concatItem(acc, x) { return acc.concat(x); }

transduce(map(increment), concatItem, [], arr);

// => [ 2, 3, 4, 5 ]
```

Using Cognitect's [`transducers-js`](https://github.com/cognitect-labs/transducers-js) library, we can easily accomplish what we had above.  

```js
var t = transducers;

var arr = [1, 2, 3, 4];

function increment(x) { return x + 1; }

into([], t.comp(t.map(increment)), arr);

// => [ 2, 3, 4, 5 ]
```

We can go a step further and add filtering as well to get only even values.

```js
var t = transducers;

var arr = [1, 2, 3, 4];

function increment(x) { return x + 1; }
function isEven(x) { return x % 2 === 0; }

into([], t.comp(t.map(increment), t.filter(isEven)), arr);

// => [ 2, 4 ]
```

Since it works so well using Arrays, there's no reason why it cannot work for Observable sequences as well.  To that end, we have introduced the [`transduce`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/transduce.md) method which acts exactly like it does for Arrays, but for Observable sequences.  Once again, let's go over the above example, this time using an Observable sequence.

```js
var t = transducers;

var source = Rx.Observable.range(1, 4);

function increment(x) { return x + 1; }
function isEven(x) { return x % 2 === 0; }

var transduced = source.transduce(t.comp(t.map(increment), t.filter(isEven)));

transduced.subscribe(
  function (x) { console.log('Next: %s', x); },
  function (e) { console.log('Error: %s', e); },
  function ()  { console.log('Completed'); });

// => Next: 2
// => Next: 4
// => Completed
```

Note that this above example also works the same with `transducers.js` as well with little to no modification.  This example will in fact work faster than the traditional LINQ style (as of now) which most use currently.

```js
var source = Rx.Observable.range(1, 4);

function increment(x) { return x + 1; }
function isEven(x) { return x % 2 === 0; }

var transduced = source.map(increment).filter(isEven);

transduced.subscribe(
  function (x) { console.log('Next: %s', x); },
  function (e) { console.log('Error: %s', e); },
  function ()  { console.log('Completed'); });

// => Next: 2
// => Next: 4
// => Completed
```

This opens up a wide new set of possibilities making RxJS even faster over large collections with no intermediate Observable sequences.
