'use strict';

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted;

Observable.addToPrototype({
  minBy: require('../observable/minby')
});

function reverseComparer(a, b) {
  return a > b ? -1 : a < b ? 1 : 0;
}

test('Observable#minBy empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, { key: 1, value: 'z' }),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.minBy(function (x) { return x.key; });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, []),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#minBy return', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, { key: 1, value: 'z' }),
    onNext(210, { key: 2, value: 'a' }),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.minBy(function (x) { return x.key; });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, [{ key: 2, value: 'a' }]),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#minBy some', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, { key: 1, value: 'z' }),
    onNext(210, { key: 3, value: 'b' }),
    onNext(220, { key: 2, value: 'c' }),
    onNext(230, { key: 4, value: 'a' }),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.minBy(function (x) { return x.key; });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, [{ key: 2, value: 'c' }]),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#minBy multiple', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, { key: 1, value: 'z' }),
    onNext(210, { key: 3, value: 'b' }),
    onNext(215, { key: 2, value: 'd' }),
    onNext(220, { key: 3, value: 'c' }),
    onNext(225, { key: 2, value: 'y' }),
    onNext(230, { key: 4, value: 'a' }),
    onNext(235, { key: 4, value: 'r' }),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.minBy(function (x) { return x.key; });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, [{ key: 2, value: 'd' }, { key: 2, value: 'y' }]),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#minBy throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, { key: 1, value: 'z' }),
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.minBy(function (x) { return x.key; });
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#minBy never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, { key: 1, value: 'z' })
  );

  var results = scheduler.startScheduler(function () {
    return xs.minBy(function (x) { return x.key; });
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#minBy comparer empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, { key: 1, value: 'z' }),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.minBy(function (x) { return x.key; }, reverseComparer);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, []),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#minBy comparer return', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, { key: 1, value: 'z' }),
    onNext(210, { key: 2, value: 'a' }),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.minBy(function (x) { return x.key; }, reverseComparer);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, [{ key: 2, value: 'a' }]),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#minBy comparer some', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, { key: 1, value: 'z' }),
    onNext(210, { key: 3, value: 'b' }),
    onNext(220, { key: 20, value: 'c' }),
    onNext(230, { key: 4, value: 'a' }),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.minBy(function (x) { return x.key; }, reverseComparer);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, [{ key: 20, value: 'c' }]),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#minBy comparer throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, { key: 1, value: 'z' }),
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.minBy(function (x) { return x.key; }, reverseComparer);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#minBy comparer never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, { key: 1, value: 'z' })
  );

  var results = scheduler.startScheduler(function () {
    return xs.minBy(function (x) { return x.key; }, reverseComparer);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#minBy selector throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, { key: 1, value: 'z' }),
    onNext(210, { key: 3, value: 'b' }),
    onNext(220, { key: 2, value: 'c' }),
    onNext(230, { key: 4, value: 'a' }),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.minBy(function () { throw error; }, reverseComparer);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#minBy comparer throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, { key: 1, value: 'z' }),
    onNext(210, { key: 3, value: 'b' }),
    onNext(220, { key: 2, value: 'c' }),
    onNext(230, { key: 4, value: 'a' }),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.minBy(function (x) { return x.key; }, function () { throw error; });
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});
