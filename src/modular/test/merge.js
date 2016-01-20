'use strict';

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted;

Observable.addToObject({
  empty: require('../observable/empty'),
  merge: require('../observable/merge'),
  never: require('../observable/never')
});

Observable.addToPrototype({
  merge: require('../observable/merge'),
  tap: require('../observable/tap')
});

test('merge never 2', function (t) {
  var scheduler = new TestScheduler();

  var n1 = Observable.never();
  var n2 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return Observable.merge(scheduler, n1, n2);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('merge never 3', function (t) {
  var scheduler = new TestScheduler();

  var n1 = Observable.never();
  var n2 = Observable.never();
  var n3 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return Observable.merge(scheduler, n1, n2, n3);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('merge empty 2', function (t) {
  var scheduler = new TestScheduler();

  var e1 = Observable.empty();
  var e2 = Observable.empty();

  var results = scheduler.startScheduler(function () {
    return Observable.merge(scheduler, e1, e2);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(203)
  ]);

  t.end();
});

test('merge empty 3', function (t) {
  var scheduler = new TestScheduler();

  var e1 = Observable.empty();
  var e2 = Observable.empty();
  var e3 = Observable.empty();

  var results = scheduler.startScheduler(function () {
    return Observable.merge(scheduler, e1, e2, e3);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(204)
  ]);

  t.end();
});

test('merge empty delayed 2 right last', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(240)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.merge(scheduler, e1, e2);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(250)
  ]);

  t.end();
});

test('merge empty delayed 2 left last', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(240)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.merge(scheduler, e1, e2);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(250)
  ]);

  t.end();
});

test('merge empty delayed 3 middle last', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(245)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var e3 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(240)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.merge(scheduler, e1, e2, e3);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(250)
  ]);

  t.end();
});

test('merge empty never ', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(245)
  );

  var n1 = Observable.never();

  var results = scheduler.startScheduler(function () {
      return Observable.merge(scheduler, e1, n1);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('merge never empty', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(245)
  );

  var n1 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return Observable.merge(scheduler, n1, e1);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('merge return never', function (t) {
  var scheduler = new TestScheduler();

  var r1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(245)
  );
  var n1 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return Observable.merge(scheduler, r1, n1);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2)
  ]);

  t.end();
});

test('merge never return', function (t) {
  var scheduler = new TestScheduler();

  var r1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(245)
  );

  var n1 = Observable.never();

  var results = scheduler.startScheduler(function () {
      return Observable.merge(scheduler, n1, r1);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2)
  ]);

  t.end();
});

test('merge Error never ', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(245, error)
  );
  var n1 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return Observable.merge(scheduler, e1, n1);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onError(245, error)
  ]);

  t.end();
});

test('merge never Error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(245, error)
  );

  var n1 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return Observable.merge(scheduler, n1, e1);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onError(245, error)
  ]);

  t.end();
});

test('merge empty return', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(245)
  );

  var r1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
      return Observable.merge(scheduler, e1, r1);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onCompleted(250)
  ]);

  t.end();
});

test('merge return empty', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(245)
  );

  var r1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
      return Observable.merge(scheduler, r1, e1);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onCompleted(250)
  ]);

  t.end();
});

test('merge lots 2', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 4),
    onNext(230, 6),
    onNext(240, 8),
    onCompleted(245)
  );

  var o2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 3),
    onNext(225, 5),
    onNext(235, 7),
    onNext(245, 9),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.merge(scheduler, o1, o2);
  }).messages;

  t.equal(9, results.length);
  for (var i = 0; i < 8; i++) {
    t.ok(results[i].value.kind === 'N' &&
      results[i].time === 210 + i * 5 &&
      results[i].value.value === i + 2);
  }
  t.ok(results[8].value.kind === 'C' && results[8].time === 250);

  t.end();
});

test('merge lots 3', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(225, 5),
    onNext(240, 8),
    onCompleted(245)
  );

  var o2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 3),
    onNext(230, 6),
    onNext(245, 9),
    onCompleted(250)
  );

  var o3 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 4),
    onNext(235, 7),
    onCompleted(240)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.merge(scheduler, o1, o2, o3);
  }).messages;

  t.equal(9, results.length);
  for (var i = 0; i < 8; i++) {
    t.ok(results[i].value.kind === 'N' &&
      results[i].time === 210 + i * 5 &&
      results[i].value.value === i + 2);
  }
  t.ok(results[8].value.kind === 'C' && results[8].time === 250);

  t.end();
});

test('merge Error left', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(245, error)
  );

  var o2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 3),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.merge(scheduler, o1, o2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(215, 3),
    onError(245, error)
  ]);

  t.end();
});

test('merge Error causes disposal', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var sourceNotDisposed = false;

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error)
  );

  var o2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 1),
    onCompleted(250))
    .tap(function () {
      return sourceNotDisposed = true;
  });

  var results = scheduler.startScheduler(function () {
    return Observable.merge(scheduler, o1, o2);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.ok(!sourceNotDisposed);

  t.end();
});
