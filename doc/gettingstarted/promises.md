# Bridging to Promises #

Promises are a defacto standard within JavaScript community and is part of the ECMAScript Standard.  A promise represents the eventual result of an asynchronous operation. The primary way of interacting with a promise is through its then method, which registers callbacks to receive either a promise’s eventual value or the reason why the promise cannot be fulfilled.  You can create them very easily where the constructor has two functions, `resolve` and `reject` which resolves the value or rejects it for a given reason.  RxJS is fully committed to standards and has native support for Promises for any number of methods where they can be used interchangeably with Observable sequences.  

The advantage that you get when you intermix Promises with Observable sequences is that unlike the ES6 Promise standard, you get cancellation semantics which means you can disregard values if you no longer are interested.  One of the biggest problems around Promises right now are around cancellation, as to cancel the operation, such as an XHR is not easily done with the existing standard, nor is it to only get the last value to ensure no out of order requests.  With Observable sequences, you get that behavior for free in a multicast behavior, instead of the unicast Promise behavior.

The following list of operators natively support Promises:
- [`Rx.Observable.amb`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/amb.md) | [`Rx.Observable.prototype.amb`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/ambproto.md)
- [`Rx.Observable.case`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/case.md)
- [`Rx.Observable.catch`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/catch.md) | [`Rx.Observable.prototype.catch`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/catchproto.md)
- [`Rx.Observable.combineLatest`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/combinelatest.md) | [`Rx.Observable.prototype.combineLatest`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/combinelatestproto.md)
- [`Rx.Observable.concat`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/concat.md) | [`Rx.Observable.prototype.concat`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/concatproto.md)
- [`Rx.Observable.prototype.concatMap`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/concatmap.md)
- [`Rx.Observable.prototype.concatMapObserver`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/concatobserver.md)
- [`Rx.Observable.defer`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/defer.md)
- [`Rx.Observable.prototype.flatMap`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/selectmany.md)
- [`Rx.Observable.prototype.flatMapLatest`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/flatmaplatest.md)
- [`Rx.Observable.forkJoin`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/forkjoin.md) | [`Rx.Observable.prototype.forkJoin`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/forkjoinproto.md)
- [`Rx.Observable.if`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/if.md)
- [`Rx.Observable.merge`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/merge.md)
- [`Rx.Observable.prototype.mergeAll`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/mergeall.md)
- [`Rx.Observable.onErrorResumeNext`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/onerrorresumenext.md) | [`Rx.Observable.prototype.onErrorResumeNext`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/onerrorresumenextproto.md)
- [`Rx.Observable.prototype.selectMany`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/selectmany.md)
- [`Rx.Observable.prototype.selectSwitch`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/flatmaplatest.md)
- [`Rx.Observable.prototype.sequenceEqual`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/sequenceequal.md)
- [`Rx.Observable.prototype.skipUntil`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/skipuntil.md)
- [`Rx.Observable.startAsync`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/startasync.md)
- [`Rx.Observable.prototype.switch`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/switch.md)
- [`Rx.Observable.prototype.takeUntil`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/takeuntil.md)
- [`Rx.Observable.prototype.debounceWithSelector`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/debouncewithselector.md)
- [`Rx.Observable.prototype.timeoutWithSelector`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/timeoutwithselector.md)
- [`Rx.Observable.while`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/while.md)
- [`Rx.Observable.prototype.window`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/window.md)
- [`Rx.Observable.withLatestFrom`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/withlatestfrom.md)
- [`Rx.Observable.zip`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/zip.md) | [`Rx.Observable.prototype.zip`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/zipproto.md)

Because of this, we can now do a number of very interesting things such as combining Promises and Observable sequences.

```js
var source = Rx.Observable.range(0, 3)
  .flatMap(function (x) { return Promise.resolve(x * x); });

var subscription = source.subscribe(
  function (x) { console.log('onNext: %s', x); },
  function (e) { console.log('onError: %s', e); },
  function () { console.log('onCompleted'); });

// => onNext: 0
// => onNext: 1
// => onNext: 4
// => onCompleted
```

This is just scatching the surface of what Promises and RxJS can do together so that we have first class single values and first class multiple values working together.

## Converting Promises to Observable Sequences ##

It's quite simple to convert a Promise object which conforms to the ES6 Standard Promise where the behavior is uniform across implementations.  To support this, we provide the [`Rx.Observable.fromPromise`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/frompromise.md) method which calls the `then` method of the promise to handle both success and error cases.

In the following example, we create promise objects using [RSVP](https://github.com/tildeio/rsvp.js) library.

```js
// Create a promise which resolves 42
var promise1 = new RSVP.Promise(function (resolve, reject) {
    resolve(42);
});

var source1 = Rx.Observable.fromPromise(promise1);

var subscription1 = source1.subscribe(
  function (x) { console.log('onNext: %s', x); },
  function (e) { console.log('onError: %s', e); },
  function () { console.log('onCompleted'); });

// => onNext: 42
// => onCompleted

// Create a promise which rejects with an error
var promise2 = new RSVP.Promise(function (resolve, reject) {
    reject(new Error('reason'));
});

var source2 = Rx.Observable.fromPromise(promise2);

var subscription2 = source2.subscribe(
  function (x) { console.log('onNext: %s', x); },
  function (e) { console.log('onError: %s', e); },
  function () { console.log('onCompleted'); });

// => onError: reject
```

Notice that in this sample, these promises becomes an observable sequences in which we can manipulate further. The [Querying Observable Sequences](querying.md) topic will show you how you can project this sequence into another, filter its content, so that your application will only receive values that satisfy a certain criteria.

## Converting Observable Sequences to Promises ##

Just as you can convert a Promise to an Observable sequence, you can also convert an Observable sequence to a Promise.  This either requires native support for Promises, or a Promise library you can add yourself, such as [Q](https://github.com/kriskowal/q), [RSVP](https://github.com/tildeio/rsvp.js), [when.js](https://github.com/cujojs/when) among others.  These libraries must conform to the ES6 standard for construction where it provides two functions to resolve or reject the promise.

```js
var p = new Promise(function (resolve, reject) {
  resolve(42);
});
```

We can use the [`toPromise`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/frompromise.md) method which allows you to convert an Observable sequence to a Promise.  This method accepts a Promise constructor, and if not provided, will default to a default implementation.  In this first example, we will use [RSVP](https://github.com/tildeio/rsvp.js) to construct our Promise objects.

```js
// Return a single value
var source1 = Rx.Observable.just(1).toPromise(RSVP.Promise);

source1.then(
  function (value) {
    console.log('Resolved value: %s', value);
  },
  function (reason) {
    console.log('Rejected reason: %s', reason);
  });

// => Resolved value: 1

// Reject the Promise
var source2 = Rx.Observable.throwError(new Error('reason')).toPromise(RSVP.Promise);

source2.then(
  function (value) {
    console.log('Resolved value: %s', value);
  },
  function (reason) {
    console.log('Rejected reason: %s', reason);
  });

// => Rejected reason: Error: reason
```

If an implementation is not given with the [`toPromise`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/frompromise.md) method, it will fall back to the Promise implementation specified in the `Rx.config.Promise` field.  By default this will be set to the runtime's ES6 Promise implementation, but can easily be overridden by specifying the configuration information.

```js
Rx.config.Promise = RSVP.Promise;

var source1 = Rx.Observable.just(1).toPromise();

source1.then(
  function (value) {
    console.log('Resolved value: %s', value);
  },
  function (reason) {
    console.log('Rejected reason: %s', reason);
  });

// => Resolved value: 1
```

If you are in a pure ES6 environment, this should just work without any settings on your part as it will use the runtime's ES6 Promise implementation.
```js
var source1 = Rx.Observable.just(1).toPromise();

source1.then(
  function (value) {
    console.log('Resolved value: %s', value);
  },
  function (reason) {
    console.log('Rejected reason: %s', reason);
  });

// => Resolved value: 1
```

Concepts
- [Querying Observable Sequences](querying.md)
