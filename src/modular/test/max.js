'use strict';

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
  max: require('../observable/max')
});

function reverseComparer(a, b) {
  return a > b ? -1 : a < b ? 1 : 0;
}

test('Observable#max number empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.max();
  });

  reactiveAssert(t, results.messages, [
    onError(250, function (n) { return n.error instanceof EmptyError; })
  ]);

  t.end();
});

test('Observable#max number Return', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.max();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 2),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#max number Some', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 3),
    onNext(220, 4),
    onNext(230, 2),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.max();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 4),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#max number throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error));

  var results = scheduler.startScheduler(function () {
    return xs.max();
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#max number Never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
      return xs.max();
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#max comparer empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.max(reverseComparer);
  });

  reactiveAssert(t, results.messages, [
    onError(250, function (n) { return n.error instanceof EmptyError; })
  ]);

  t.end();
});

test('Observable#max comparer return', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 'z'),
    onNext(210, 'a'),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.max(reverseComparer);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 'a'),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#max comparer some', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 'z'),
    onNext(210, 'b'),
    onNext(220, 'c'),
    onNext(230, 'a'),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.max(reverseComparer);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 'a'),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#max comparer throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 'z'),
    onError(210, error));

  var results = scheduler.startScheduler(function () {
    return xs.max(reverseComparer);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#max comparer never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 'z')
  );

  var results = scheduler.startScheduler(function () {
    return xs.max(reverseComparer);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#max comparer throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 'z'),
    onNext(210, 'b'),
    onNext(220, 'c'),
    onNext(230, 'a'),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.max(function () { throw error; });
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});
