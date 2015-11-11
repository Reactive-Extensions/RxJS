'use strict';
/* jshint undef: true, unused: true */

function add(x, y) { return x + y; }

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted;

Observable.addToPrototype({
  scan: require('../observable/scan')
});

test('Observable#scan with seed throws error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 24),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.scan(function () { throw error; }, 42);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#scan with seed never', function (t) {
  var scheduler = new TestScheduler();

  var seed = 42;

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.scan(add, seed);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#scan with seed empty', function (t) {
  var scheduler = new TestScheduler();

  var seed = 42;

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.scan(add, seed);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 42),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#scan with seed return', function (t) {
  var scheduler = new TestScheduler();

  var seed = 42;

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.scan(add, seed);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, seed + 2),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#scan with seed throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var seed = 42;

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(250, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.scan(add, seed);
  });

  reactiveAssert(t, results.messages, [
    onError(250, error)
  ]);

  t.end();
});

test('Observable#scan with seed some data', function (t) {
  var scheduler = new TestScheduler();

  var seed = 1;

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.scan(add, seed);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, seed + 2),
    onNext(220, seed + 2 + 3),
    onNext(230, seed + 2 + 3 + 4),
    onNext(240, seed + 2 + 3 + 4 + 5),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#scan no seed never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.scan(function (acc, x) {
      return acc + x;
    });
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#scan no seed empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.scan(function (acc, x) {
      return acc + x;
    });
  });

  reactiveAssert(t, results.messages, [
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#scan no seed return', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.scan(function (acc, x) {
      acc === undefined && (acc = 0);
      return acc + x;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 2),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#scan no seed throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(250, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.scan(function (acc, x) {
      acc === undefined && (acc = 0);
      return acc + x;
    });
  });

  reactiveAssert(t, results.messages, [
    onError(250, error)
  ]);

  t.end();
});

test('Observable#scan no seed some data', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.scan(function (acc, x) {
      acc === undefined && (acc = 0);
      return acc + x;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 2 + 3),
    onNext(230, 2 + 3 + 4),
    onNext(240, 2 + 3 + 4 + 5),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#scan without seed throws error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.scan(function () { throw error; });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onError(220, error)
  ]);

  t.end();
});
