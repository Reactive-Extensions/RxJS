'use strict';

function add(x, y) { return x + y; }

var test = require('tape');
var Observable = require('../observable');
var EmptyError = require('../internal/errors').EmptyError;
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted;

Observable.addToPrototype({
  reduce: require('../observable/reduce')
});

test('Observable#reduce with seed empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.reduce(add, 42);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 42),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#reduce with seed return', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 24),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.reduce(add, 42);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 42 + 24),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#reduce with seed throws error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 24),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.reduce(function () { throw error; }, 42);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#reduce with seed throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.reduce(add, 42);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#reduce with seed never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.reduce(add, 42);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#reduce with seed range', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 0),
    onNext(220, 1),
    onNext(230, 2),
    onNext(240, 3),
    onNext(250, 4),
    onCompleted(260)
  );

  var results = scheduler.startScheduler(function () {
    return xs.reduce(add, 42);
  });

  reactiveAssert(t, results.messages, [
    onNext(260, 10 + 42),
    onCompleted(260)
  ]);

  t.end();
});

test('Observable#reduce without seed empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
  var results = scheduler.startScheduler(function () {
    return xs.reduce(add);
  });

  reactiveAssert(t, results.messages, [
    onError(250, function (n) { return n.error instanceof EmptyError; })
  ]);

  t.end();
});

test('Observable#reduce without seed return', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 24),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.reduce(add);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 24),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#reduce without seed throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.reduce(add);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#reduce without seed never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.reduce(add);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#reduce without seed range', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 0),
    onNext(220, 1),
    onNext(230, 2),
    onNext(240, 3),
    onNext(250, 4), onCompleted(260)
  );

  var results = scheduler.startScheduler(function () {
    return xs.reduce(add);
  });

  reactiveAssert(t, results.messages, [
    onNext(260, 10),
    onCompleted(260)
  ]);

  t.end();
});

test('Observable#reduce without seed throws error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 24),
    onNext(220, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.reduce(function () { throw error; });
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});
