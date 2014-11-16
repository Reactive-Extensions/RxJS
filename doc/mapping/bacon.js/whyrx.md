# RxJS for Bacon.js Users #

[Bacon.js](https://github.com/baconjs/bacon.js) is a popular Reactive Programming library which was inspired by RxJS, ReactiveBanana among other libraries.  

But, before we get started, why use RxJS over Bacon.js?

## Why RxJS versus Bacon.js ##

There are a number of reasons why RxJS makes sense to use versus Bacon.js.  Some of these include:
- Performance
- Interoperability With The Libraries You Use
- Browser Compatibility
- A Commitment to Standards
- Swappable Concurrency Layer
- Backpressure
- Build What You Want
- Many Examples and Tutorials
- Extensive Documentation

### Performance ###

RxJS has always been committed to providing the best performance available on any given JavaScript platform.  Whether it is providing a small footprint for an `Observable` instance, to providing the capability of using `setImmediate` versus `setTimeout` versus `requestAnimationFrame`, all by choosing a different scheduler.  In addition, since RxJS is written in regular JavaScript versus CoffeeScript, there are a lot more optimizations that can be made by hand to ensure performance.

To make this more concrete, there is a project called [Kefir](https://github.com/pozadi/kefir) which is trying to make a more performance oriented version of Bacon.js.  Here are some current numbers based upon the memory tests provided by Kefir.  Note that these may change over time, but gives you a good indication of memory consumtpion.  Below will be comparison of `combineLatest`, `filter`, `map`, and `scan`.

```
stream1.combine(stream2, ->) (1000 samples)
----------------------------------------------------------------
Kefir   w/o subscr. 0.44 KiB   w/ subscr. +0.80 KiB   sum 1.23 KiB
Bacon   w/o subscr. 5.42 KiB   w/ subscr. +6.15 KiB   sum 11.57 KiB
Rx      w/o subscr. 0.43 KiB   w/ subscr. +2.84 KiB   sum 3.26 KiB
-----------------------
Kefir 1.00 1.00 1.00    Bacon 12.45 7.71 9.39    Rx 0.98 3.56 2.65

.filter(->) (1000 samples)
----------------------------------------------------------------
Kefir   w/o subscr. 0.31 KiB   w/ subscr. +0.46 KiB   sum 0.77 KiB
Bacon   w/o subscr. 1.82 KiB   w/ subscr. +2.49 KiB   sum 4.31 KiB
Rx      w/o subscr. 0.37 KiB   w/ subscr. +1.44 KiB   sum 1.81 KiB
-----------------------
Kefir 1.00 1.00 1.00    Bacon 5.91 5.39 5.60    Rx 1.21 3.11 2.35

.map(->) (1000 samples)
----------------------------------------------------------------
Kefir   w/o subscr. 0.30 KiB   w/ subscr. +0.47 KiB   sum 0.77 KiB
Bacon   w/o subscr. 1.81 KiB   w/ subscr. +2.49 KiB   sum 4.30 KiB
Rx      w/o subscr. 0.37 KiB   w/ subscr. +1.43 KiB   sum 1.81 KiB
-----------------------
Kefir 1.00 1.00 1.00    Bacon 6.07 5.31 5.60    Rx 1.24 3.06 2.35

.scan(0, ->) (1000 samples)
----------------------------------------------------------------
Kefir   w/o subscr. 0.30 KiB   w/ subscr. +0.47 KiB   sum 0.76 KiB
Bacon   w/o subscr. 1.68 KiB   w/ subscr. +2.06 KiB   sum 3.75 KiB
Rx      w/o subscr. 0.39 KiB   w/ subscr. +1.13 KiB   sum 1.52 KiB
-----------------------
Kefir 1.00 1.00 1.00    Bacon 5.62 4.44 4.90    Rx 1.29 2.43 1.99
```

As you'll note, while Kefir does pretty well here, Bacon.js does not.  Bacon.js has a fairly heavy Observable object to start with and then subscriptions are fairly heavy as well.  With both Kefir and RxJS, the initial size of the Observable is about the same.  We'll get to the other fine tuning such as schedulers in the later section.

## Interoperability With The Libraries You Use ##

One of the most important parts of when choosing a library is how well it works with the libraries you already use. Bacon.js ties itself directly to [jQuery](http://jquery.com) and [Zepto.js](http://zeptojs.com) for event binding with `asEventStream`.   Not only that, but adding support for your own custom library's binding is difficult, whereas with RxJS it couldn't be easier.

RxJS, on the other hand is more flexible about binding to the libraries you use.  For example, if you use [jQuery](http://jquery.com) or [Zepto.js](http://zeptojs.com), `Rx.Observable.fromEvent` will work perfectly for you. In addition, we also support the other libraries out of the box:
- [AngularJS](http://angularjs.org)
- [Backbone.js](http://backbonejs.org)
- [Ember.js](http://emberjs.org)

You can also override this behavior in `fromEvent` so that you use native DOM or Node.js events via the `EventEmitter` directly by setting the `Rx.config.useNativeEvents` flag to true, so that it's never in doubt which event system you are using.  When using native DOM events, you can attach a listener to one item, or you can attach listeners to a NodeList's children, we figure that out for you without you having to change your code, whereas Bacon.js doesnot.

In order to support the libraries you use, it's very simple to add your own event binding, for example we can bind our events to the [Dojo Toolkit](http://dojotoolkit.org) using the `Rx.Observable.fromEventPattern` method:

```js
require(['dojo/on', 'dojo/dom', 'rx'], function (on, dom, rx) {

  var input = dom.byId('input');

  var source = Rx.Observable.fromEventPattern(
    function addHandler (h) {
      return on(input, 'click', h);
    },
    function delHandler (_, signal) {
      signal.remove();
    }
  );

  var subscription = source.subscribeOnNext(function (x) {
    console.log('Next: Clicked!');
  });

  on.emit(input, 'click');
  // => Next: Clicked!
});
```

In addition, transducers hold a great amount of potential for high performance querying, and to that end, RxJS has added [transducers support](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/transducers.md) via the `transduce` method.

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

## Browser Compatibility ##

Browser and runtime compatibility is important to RxJS.  For example, it can run not only in the browser, but also Node.js, RingoJS, Narwhal, Nashorn, and event Windows Scripting Host (WSH).  We realize that there are many users out there without access to the latest browser, so we do the best to accommodate this with our `compat` builds.  These builds bridge all the way back to IE6 for support which includes using `attachEvent` with event normalization, to DOM Level 1 events.  Bacon.js does not have this behavior, and instead falls back to hoping that you use jQuery.

We also want to build RxJS for speed with asynchronous operations, so we optimize for the browser and runtime you are using.  For example, if your environment supports `setImmediate` for immediate execution, we will use that.  Else, if you're in Node.js and `setImmediate` is not available, it falls back to `process.nextTick`.  For browsers and runtimes that do not support `setImmediate`, we will fall back to `postMessage`, to `MessageChannel`, to asynchronous script loading, and finally defaulting back to `setTimeout` or event `WScript.Sleep` for Windows Scripting Host.

These `compat` files are important as we will shim behavior that we require such as `Array#extras`, `Function#bind` and so forth, so there is no need to bring in your own compatibility library such as html5shiv, although if they do exist already, we will use the native or shimmed methods directly.

## A Commitment to Standards ##

### Iterables and Array#extras ###

RxJS has a firm commitment to standards in JavaScript.  Whether it is supporting the `Array#extras` standard method signatures such as `map`, `filter`, `reduce`, `every` and `some`, or to some new emerging standard on collections, RxJS will implement these features accordingly from pull collections to push.  Unlike Bacon.js, RxJS conforms to `Array#extras` syntax to have the callback style of `function (item, index, collection)` in addition to accepting a `thisArg` for the calling context of the callback.  This helps as you can easily reuse your code from the Array version to Observable version.

An example of forward thinking is the introduction of ES6+ operators on Array with implementations on Observable such as:
- `contains`
- `find`
- `findIndex`
- `from`
- `of`

In addition, RxJS supports ES6 iterables in many methods which allow you to accept `Map`, `Set`, `Array` and array-like objects, for example in `Rx.Observable.from`, `flatMap`, `concatMap` among others.  RxJS also has the capability of converting to Maps and Sets via the `toMap` and `toSet` methods if available in your runtime.

This makes the following code possible to yield an array from an observable sequence and have it automatically converted into an observable sequence.

```js
Rx.Observable.range(1, 3)
  .flatMap(function (x, i) { return [x, i]; })
  .subscribeNext(function (value) {
    console.log('Value: %o', value);
  });
// => 1
// => 0
// => 2
// => 1
// => 3
// => 2
```

### Generators ###

Generators also play a big part in the next version of JavaScript.  RxJS also takes [full advantage of generators](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/generators.md) as iterables in such methods as the aforementioned `Rx.Observable.from`, `flatMap`, `concatMap` and other methods.  For example, you can yield values like the following:

```js
var source = Rx.Observable.from(
  function* () { yield 1; yield 2; yield 3; }()
);

source.subscribeNext(function (value) {
  console.log('Next: %s', value);
});

// => 1
// => 2
// => 3
```

Generators also give the developer pretty powerful capabilities when dealing with asynchronous actions.  RxJS introduced the `Rx.spawn` method which allows you to write async/await style code over Observables, Promises, Arrays, and just plain objects.

```js
Rx.spawn(function* () {
  var x = yield Rx.Observable.just(42);
  var y = yield Promise.resolve(42);
  console.log(x + y);

  try {
    var source = yield Rx.Observable.throwError(new Error('woops'));
  } catch (e) {
    console.log(e.message);
  }
})();
// => 84
// => woops
```

### Promises ###

Promises have been a great way for developers to express single value asynchronous values.  With ES6, they have now been standardized and are starting to appear in all browsers.  RxJS also supports `Promise` values as arguments in many places as noted in our [Bridging to Promises](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/promises.md) documentation.  No more having to call `Rx.Observable.fromPromise` everywhere, RxJS automatically converts them for you.

```js
var source = Rx.Observable.fromEvent(input, 'keyup')
  .map(function (e) { return e.target.value; })
  .flatMapLatest(function (text) {
    return queryPromise(text);
  });
```

RxJS also allows an Observable sequence to be converted to an ES6 compliant `Promise` with the `toPromise` method.
```js
Rx.Observable.just(42)
  .toPromise()
  .then(function (value) {
    console.log(value);
  });
// => 42
```

## Swappable Concurrency Layer ##

RxJS can easily be described in three pieces. First the `Observer` and `Observable` objects, secondly by the operators for composition on top of them, and finally a swappable concurrency layer which allows you to swap out your concurrency model at any time.  This last part is key which distinguishes RxJS from many other libraries.  There are a number of advantages to this approach that may be subtle at first, but invaluable as you start to use them.

The first advantage is that you can switch where callbacks are executed, for example, instead of using `setImmediate` or any of its fallbacks, you can execute the callback on `window.requestAnimationFrame` for smooth animations.

```js
// Available in RxJS-DOM project
var scheduler = Rx.Scheduler.requestAnimationFrame;

function render(value) {
  // Do something to render the value
}

Rx.Observable.range(1, 100, scheduler)
  .subscribe(render);
```

Schedulers also have advantages with virtual time, which means we can say what time it really is. This is great for deterministic testing in which you can verify the behavior of every single operator.  RxJS, through the `TestScheduler` can record when items happen and what values were yielded, thus no need for asynchronous testing.

```js
var scheduler = new TestScheduler();

var xs = scheduler.createHotObservable(
  Rx.ReactiveTest.onNext(201, 1),
  Rx.ReactiveTest.onCompleted(202)
);

var results = scheduler.startWithCreate(function () {
  return xs.map(function (x, i) { return x + x + i });
});

// Some custom collection assertion for values
collectionAssert.assertEqual(results.messages, [
  Rx.ReactiveTest.onNext(201, 2),
  Rx.ReactiveTest.onCompleted(202);
]);

// Some custom collection assertion for subscriptions
collectionAssert.assertEqual(xs.subscriptions, [
  Rx.ReactiveTest.subscribe(200, 202);
])
```

Every operator within RxJS has tests written in this style where all data is easily verified.  Not only can we create observables through the `TestScheduler`, but we can create Promises via the `createResolvedPromise` and `createRejectedPromise` methods.

Virtual time has more advantages as well.  Imagine if you had some historical stock data that you wanted to run through a simulation.  Using the `Historical` scheduler, you can easily accomplish this.

```js
var scheduler = new Rx.HistoricalScheduler(new Date(2014, 1));

var source = new Rx.Subject();

getStockData().forEach(function (stock) {
  scheduler.scheduleWithAbsolute(stock.date, function () {
    stock.onNext(stock);
  });
});

// Calculate with the data
source.groupBy(function (stock) { return stock.symbol };)
  /* Do something with the data */
  .subscribe(function (info) {
    // Process the data
  });
```

## Backpressure ##

In our applications, we consume a lot of data from external sources.  But, what if our consumers (Observers) cannot handle the load from the observable sequence?  RxJS has a number of mechanisms to handle this in the [Backpressure and Observable Sequences](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/backpressure.md) documentation.  This could come in the form of lossy operations such as `debounce`, `throttleFirst`, `sample`, `pausable`, to loss-less operations such as `pausableBuffered`, `buffer`, etc.

## Build What You Want ##

RxJS has a rather large surface area, so we give you the ability to build RxJS with only the things you want and none of the things you don't via the [`rx-cli`](https://www.npmjs.org/package/rx-cli) project.  For example, we can build a `compat` version of RxJS with only the `map`, `flatMap`, `takeUntil`, and `fromEvent` methods, which keeps your RxJS version lean and mean.

```js
rx --lite --compat --methods map,flatmap,takeuntil,fromevent
```

## Many Examples and Tutorials ##

As people try to learn RxJS, it's always great to have [examples](https://github.com/Reactive-Extensions/RxJS/tree/master/examples) to get them started.  To that end, RxJS ships a number of examples out of the box including simple scenarios such as Autocomplete, Follow the Mouse, Drawing, to more complete examples like databinding using a little demo project called `TKO`, to a complete game of Alphabet Invasion.

Want to learn RxJS at your own pace?  We also have tutorials for that as well called [LearnRx](http://jhusain.github.io/learnrx/) which will walk you through the basics of learning to compose arrays, and then how that applies to observable sequences.

There are also many [community resources](https://github.com/Reactive-Extensions/RxJS#resources) to learn RxJS from videos, to presentations, to examples with integration with such libraries as AngularJS and React.

## Extensive Documentation ##

As stated before, RxJS has a rather large surface area so sometimes it's hard to know where to start.  To that end, RxJS has [complete API documentation](https://github.com/Reactive-Extensions/RxJS/tree/master/doc#reactive-extensions-class-library), as well as a [Getting Started Guide](https://github.com/Reactive-Extensions/RxJS/tree/master/doc#getting-started-with-rxjs) as well as [Guidelines](https://github.com/Reactive-Extensions/RxJS/tree/master/doc#rxjs-guidelines), a [How Do I?](https://github.com/Reactive-Extensions/RxJS/tree/master/doc#how-do-i) section as well as a [growing list of comparisons with other libraries](https://github.com/Reactive-Extensions/RxJS/tree/master/doc#mapping-rxjs-from-different-libraries).
