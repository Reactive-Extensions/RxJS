# Bridging to Callbacks #

Promises are a defacto standard within JavaScript community and is part of the ECMAScript Standard.  A promise represents the eventual result of an asynchronous operation. The primary way of interacting with a promise is through its then method, which registers callbacks to receive either a promise’s eventual value or the reason why the promise cannot be fulfilled.  You can create them very easily where the constructor has two functions, `resolve` and `reject` which resolves the value or rejects it for a given reason.  RxJS is fully committed to standards and has native support for Promises for any number of methods where they can be used interchangeably with Observable sequences.  

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
- [`Rx.Observable.prototype.throttleWithSelector`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/throttlewithselector.md)
- [`Rx.Observable.prototype.timeoutWithSelector`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/timeoutwithselector.md)
- [`Rx.Observable.while`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/while.md)
- [`Rx.Observable.prototype.window`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/window.md)
- [`Rx.Observable.zip`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/zip.md) | [`Rx.Observable.prototype.zip`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/zipproto.md)


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
  function (x) { console.log('onNext: ' + x); },
  function (e) { console.log('onError: ' + e.message); },
  function () { console.log('onCompleted'); });

// => onNext: 42
// => onCompleted

// Create a promise which rejects with an error
var promise2 = new RSVP.Promise(function (resolve, reject) {
    reject(new Error('reason'));
});

var source2 = Rx.Observable.fromPromise(promise2);

var subscription2 = source2.subscribe(
  function (x) { console.log('onNext: ' + x); },
  function (e) { console.log('onError: ' + e.message); },
  function () { console.log('onCompleted'); });

// => onError: reject
```

## Converting Observable Sequences to Promises ##

