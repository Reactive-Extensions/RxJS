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
  min: require('../observable/min')
});

function reverseComparer(a, b) {
  return a > b ? -1 : a < b ? 1 : 0;
}

test('Observable#min empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.min();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, function (n) { return n.error instanceof EmptyError; })
  ]);

  t.end();
});

test('Observable#min return', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.min();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 2),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#min some', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.min();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 2),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#min throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.min();
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#min never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1));

  var results = scheduler.startScheduler(function () {
    return xs.min();
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#min with comparer empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 'a'),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.min(reverseComparer);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, function (n) { return n.error instanceof EmptyError; })
  ]);

  t.end();
});

test('Observable#min with comparer non-empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 'z'),
    onNext(210, 'b'),
    onNext(220, 'c'),
    onNext(230, 'a'),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.min(reverseComparer);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 'c'),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#min with comparer throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 'z'),
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.min(reverseComparer);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#min with comparer never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 'z')
  );

  var results = scheduler.startScheduler(function () {
    return xs.min(reverseComparer);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#min with comparer throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 'z'),
    onNext(210, 'b'),
    onNext(220, 'c'),
    onNext(230, 'a'),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.min(function () { throw error; });
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});
