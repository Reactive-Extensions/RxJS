# Generators and Observable Sequences #

One of the more exciting features of ES6 is a new function type called generators.  They have been in Firefox for years, although they have now been finally standardized in ES6, and will be shipping in a browser or runtime near you. How generators differ from normal functions is that a normal function such as the following will run to completion, regardless of whether it is asynchronous or not.

```js
function printNumberOfTimes(msg, n) {
  for (var i = 0; i < n; i++) {
    console.log(msg);
  }
}

printNumberOfTime('Hello world', 1);
// => Hello world

// Asynchronous
setTimeout(function () {
  console.log('Hello from setTimeout after one second');
}, 1000); 
// => Hello from setTimeout after one second
```

Instead of running to completion, generators allow us to interrupt the flow of the function by introducing the `yield` keyword which pauses the function.  The function cannot resume on its own without the external consumer saying that they need the next value.  

To create a generator function, you must use the `function*` syntax which then becomes a generator.  In this particular example, we will yield a single value, the meaning of life.
```js
function* theMeaningOfLife() {
  yield 42;
}
```

To get the value out, we need to invoke the function, and then call `next` to get the next value.  The return value from the `next` call will have a flag as to whether it is done, as well as any value that is yielded.  Note that the function doesn't do anything until we start to call `next`.

```js
var it = theMeaningOfLife();

it.next();
// => { done: false, value: 42 }

it.next();
// => { done: true, value: undefined }
```

We can also use some ES6 shorthand for getting values from a generator such as the `for..of`.

```js
for (var v of theMeaningOfLife()) {
  console.log(v);
}
// => 42
```

This of course is only scratching the surface of what generators are capable of doing as we're more focused on the simple nature of yielding values.

Since RxJS believes heavily in standards, we also look for ways to incorporate new language features as they become standardized so that you can take advantage of them, combined with the power of RxJS.

## Async/Await Style and RxJS ##

One common complaint of JavaScript is the callback nature to asynchronous behavior.  Luckily, this can be solved quite easily with a library approach.  To that end, we introduce [`Rx.spawn`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/spawn.md) which allows you to write straight forward code manner and can yield not only Observable sequences, but also Promises, Callbacks, Arrays, etc.  This allows you to write your code in a very imperative manner without all the callbacks, but also brings the power of RxJS whether you want to call `timeout`, `retry`, `catch` or any other method for that matter.  Note that this only yields a single value, but in RxJS terms, this is still quite useful.  

For example, we could get the HTML from Bing.com and write it to the console, with a timeout of 5 seconds which will throw an error should it not respond in time.  We could also add in things like `retry` and `catch` so that we could for example try three times and then if it fails, give a default response or cached version.

```js
var Rx = require('rx');
var request = require('request');
var get = Rx.Observable.fromNodeCallback(request);

Rx.spawn(function* () {
  var data;
  try {
    data = yield get('http://bing.com').timeout(5000 /*ms*/);
  } catch (e) {
    console.log('Error %s', e);
  } 

  console.log(data);
})();
```

## Mixing Operators with Generators ##

Many of the operators inside RxJS also support generators.  For example, we could use the [`Rx.Observable.from`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/from.md) method to take a generator function, in this case, a Fibonacci sequence, take 10 of them and display it.

```js
function* fibonacci(){
  var fn1 = 1;
  var fn2 = 1;
  while (1) {
    var current = fn2;
    fn2 = fn1;
    fn1 = fn1 + current;
    yield current;
  }
}

Rx.Observable.from(fibonacci())
  .take(10)
  .subscribe(function (x) {
    console.log('Value: %s', x);
  });

//=> Value: 1
//=> Value: 1
//=> Value: 2
//=> Value: 3
//=> Value: 5
//=> Value: 8
//=> Value: 13
//=> Value: 21
//=> Value: 34
//=> Value: 55
```

That's just the beginning, as there are several operators such as [`concatMap`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/concatmap.md)/[`selectConcat`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/concatmap.md) and [`flatMap`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/selectmany.md)/[`selectMany`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/concatmap.md) which take iterables as an argument so that we can further enable composition.  For example, we could project using generators from a `flatMap` operation.

```js
var source = Rx.Observable.of(1,2,3)
  .flatMap(
    function (x, i) { return function* () { yield x; yield i; }(); },
    function (x, y, i1, i2) { return x + y + i1 + i2; }
  );

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

// => Next: 2
// => Next: 2
// => Next: 5
// => Next: 5
// => Next: 8
// => Next: 8
// => Completed
```

The future of JavaScript is exciting and generators add new possibilities to our applications to allow them to mix and match our programming styles.

Notice that in this sample, move becomes an observable sequence in which we can manipulate further. The [Querying Observable Sequences](querying.md) topic will show you how you can project this sequence into a collection of Points type and filter its content, so that your application will only receive values that satisfy a certain criteria.

## See Also

Concepts
- [Querying Observable Sequences](querying.md)