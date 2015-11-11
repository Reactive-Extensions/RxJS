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
  never: require('../observable/never')
});

Observable.addToPrototype({
  takeUntil: require('../observable/takeuntil'),
  tap: require('../observable/tap')
});

test('Observable#takeUntil preempt some data next', function (t) {
  var scheduler = new TestScheduler();

  var l = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var r = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(225, 99),
    onCompleted(230)
  );

  var results = scheduler.startScheduler(function () {
    return l.takeUntil(r);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 3),
    onCompleted(225)
  ]);

  t.end();
});

test('Observable#takeUntil preempt some data error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var l = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var r = scheduler.createHotObservable(
    onNext(150, 1),
    onError(225, error)
  );

  var results = scheduler.startScheduler(function () {
    return l.takeUntil(r);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 3),
    onError(225, error)
  ]);

  t.end();
});

test('Observable#takeUntil no preempt some data empty', function (t) {
  var scheduler = new TestScheduler();

  var l = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var r = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(225)
  );

  var results = scheduler.startScheduler(function () {
    return l.takeUntil(r);
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

test('Observable#takeUntil no preempt some data never', function (t) {
  var scheduler = new TestScheduler();

  var l = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var r = Observable.never();

  var results = scheduler.startScheduler(function () {
    return l.takeUntil(r);
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

test('Observable#takeUntil preempt never next', function (t) {
  var scheduler = new TestScheduler();

  var l = Observable.never();

  var r = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(225, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return l.takeUntil(r);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(225)
  ]);

  t.end();
});

test('Observable#takeUntil preempt never error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var l = Observable.never();

  var r = scheduler.createHotObservable(
    onNext(150, 1),
    onError(225, error)
  );

  var results = scheduler.startScheduler(function () {
    return l.takeUntil(r);
  });

  reactiveAssert(t, results.messages, [
    onError(225, error)
  ]);

  t.end();
});

test('Observable#takeUntil no preempt never empty', function (t) {
  var scheduler = new TestScheduler();

  var l = Observable.never();

  var r = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(225)
  );

  var results = scheduler.startScheduler(function () {
    return l.takeUntil(r);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#takeUntil no preempt never never', function (t) {
  var scheduler = new TestScheduler();

  var l = Observable.never();

  var r = Observable.never();

  var results = scheduler.startScheduler(function () {
    return l.takeUntil(r);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#takeUntil preempt before first produced', function (t) {
  var scheduler = new TestScheduler();

  var l = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(230, 2),
    onCompleted(240)
  );

  var r = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(220)
  );

  var results = scheduler.startScheduler(function () {
    return l.takeUntil(r);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(210)
  ]);

  t.end();
});

test('Observable#takeUntil preempt before first produced remain silent and proper disposed', function (t) {
  var scheduler = new TestScheduler();

  var sourceNotDisposed = false;

  var l = scheduler.createHotObservable(
    onNext(150, 1),
    onError(215, new Error()),
    onCompleted(240)
  ).tap(function () { sourceNotDisposed = true; });

  var r = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(220)
  );

  var results = scheduler.startScheduler(function () {
    return l.takeUntil(r);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(210)
  ]);

  t.ok(!sourceNotDisposed);

  t.end();
});

test('Observable#takeUntil no preempt after last produced proper disposed signal', function (t) {
  var scheduler = new TestScheduler();

  var signalNotDisposed = false;

  var l = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(230, 2),
    onCompleted(240)
  );

  var r = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(250, 2),
    onCompleted(260)
  ).tap(function () { signalNotDisposed = true; });

  var results = scheduler.startScheduler(function () {
    return l.takeUntil(r);
  });

  reactiveAssert(t, results.messages, [
    onNext(230, 2),
    onCompleted(240)
  ]);

  t.ok(!signalNotDisposed);

  t.end();
});
