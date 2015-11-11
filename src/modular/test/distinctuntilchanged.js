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
  distinctUntilChanged: require('../observable/distinctuntilchanged')
});

test('Observable#distinctUntilChanged never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.distinctUntilChanged();
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#distinctUntilChanged empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.distinctUntilChanged();
  });

  reactiveAssert(t, results.messages, [
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#distinctUntilChanged return', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 2),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.distinctUntilChanged();
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 2),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#distinctUntilChanged throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(250, error));

  var results = scheduler.startScheduler(function () {
    return xs.distinctUntilChanged();
  });

  reactiveAssert(t, results.messages, [
    onError(250, error)
  ]);

  t.end();
});

test('Observable#distinctUntilChanged all changes', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.distinctUntilChanged();
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#distinctUntilChanged all same', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 2),
      onNext(230, 2),
      onNext(240, 2),
      onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.distinctUntilChanged();
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#distinctUntilChanged some changes', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(215, 3),
    onNext(220, 3),
    onNext(225, 2),
    onNext(230, 2),
    onNext(230, 1),
    onNext(240, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.distinctUntilChanged();
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(215, 3),
    onNext(225, 2),
    onNext(230, 1),
    onNext(240, 2),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#distinctUntilChanged comparer all equal', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.distinctUntilChanged(null, function () { return true; });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#distinctUntilChanged comparer all different', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 2),
    onNext(230, 2),
    onNext(240, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.distinctUntilChanged(null, function () { return false; });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 2),
    onNext(230, 2),
    onNext(240, 2),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#distinctUntilChanged key selector evens', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 4),
    onNext(230, 3),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.distinctUntilChanged(function (x) { return x % 2 === 0; });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(230, 3),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#distinctUntilChanged key selector throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.distinctUntilChanged(function () { throw error; });
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#distinctUntilChanged comparer throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.distinctUntilChanged(null, function () { throw error; });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onError(220, error)
  ]);

  t.end();
});
