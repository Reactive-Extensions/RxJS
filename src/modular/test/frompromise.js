'use strict';

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
    onError = ReactiveTest.onError,
    onCompleted = ReactiveTest.onCompleted;

// Polyfilling
require('lie/polyfill');

Observable.addToObject({
  fromPromise: require('../observable/frompromise')
});

test('Observable.fromPromise factory success mock', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createResolvedPromise(201, 1);

  var results = scheduler.startScheduler(function () {
    return Observable.fromPromise(function () { return xs; }, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(202, 1),
    onCompleted(202)
  ]);

  t.end();
});

test('Observable.fromPromise factory failure mock', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createRejectedPromise(201, error);

  var results = scheduler.startScheduler(function () {
    return Observable.fromPromise(function () { return xs; }, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(202, error)
  ]);

  t.end();
});

test('Observable.fromPromise factory throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.fromPromise(function () { throw error; }, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(200, error)
  ]);

  t.end();
});

test('Observable.fromPromise success mock', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createResolvedPromise(201, 1);

  var results = scheduler.startScheduler(function () {
    return Observable.fromPromise(xs, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(202, 1),
    onCompleted(202)
  ]);

  t.end();
});

test('Observable.fromPromise failure mock', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createRejectedPromise(201, error);

  var results = scheduler.startScheduler(function () {
    return Observable.fromPromise(xs, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(202, error)
  ]);

  t.end();
});

test('Observable.fromPromise success', function (t) {
  var promise = new Promise(function (resolve) {
    resolve(42);
  });

  var source = Observable.fromPromise(promise);

  source.subscribe(
    function (x) {
      t.equal(42, x);
    },
    function () {
      t.ok(false);
    },
    function () {
      t.ok(true);
      t.end();
    });
});

test('promise Failure', function (t) {
  var error = new Error('woops');

  var promise = new Promise(function (resolve, reject) {
    reject(error);
  });

  var source = Observable.fromPromise(promise);

  source.subscribe(
    function () {
      t.ok(false);
    },
    function (err) {
      t.equal(err, error);
      t.end();
    },
    function () {
      t.ok(false);
    });
});
