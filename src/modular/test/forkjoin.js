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
  forkJoin: require('../observable/forkjoin')
});

Observable.addToPrototype({
  forkJoin: require('../observable/forkjoin')
});

function add(x, y) { return x + y; }

test('forkJoin n-ary parameters', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onNext(225, 4),
    onCompleted(230));

  var o2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(235, 6),
    onNext(240, 7),
    onCompleted(250)
  );

  var o3 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(230, 3),
    onNext(245, 5),
    onCompleted(270)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.forkJoin(o1, o2, o3);
  });

  reactiveAssert(t, results.messages, [
    onNext(270, [4,7,5]),
    onCompleted(270)
  ]);

  t.end();
});

test('forkJoin n-ary parameters empty', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onNext(225, 4),
    onCompleted(230)
  );

  var o2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(235, 6),
    onNext(240, 7),
    onCompleted(250)
  );

  var o3 = scheduler.createHotObservable(
    onCompleted(270)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.forkJoin(o1, o2, o3);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(270)
  ]);

  t.end();
});

test('forkJoin n-ary parameters empty before end', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onNext(225, 4),
    onCompleted(230)
  );

  var o2 = scheduler.createHotObservable(
    onCompleted(235)
  );

  var o3 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(230, 3),
    onNext(245, 5),
    onCompleted(270));

  var results = scheduler.startScheduler(function () {
    return Observable.forkJoin(o1, o2, o3);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(235)
  ]);

  t.end();
});

test('forkJoin empty empty', function (t) {
  var scheduler = new TestScheduler();

  var o = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(230)
  );

  var e = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e.forkJoin(o, add);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(230)
  ]);

  t.end();
});

test('forkJoin none', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.forkJoin();
  });

  reactiveAssert(t, results.messages, [
    onCompleted(200)
  ]);

  t.end();
});

test('forkJoin empty return', function (t) {
  var scheduler = new TestScheduler();

  var o = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(230)
  );

  var e = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e.forkJoin(o, add);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(230)
  ]);

  t.end();
});

test('forkJoin return empty', function (t) {
  var scheduler = new TestScheduler();

  var o = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(230));

  var e = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return e.forkJoin(o, add);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(250)
  ]);

  t.end();
});

test('forkJoin return return', function (t) {
  var scheduler = new TestScheduler();

  var o = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(230)
  );

  var e = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 3),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e.forkJoin(o, add);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 2 + 3),
    onCompleted(250)
  ]);

  t.end();
});

test('forkJoin empty throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(230)
  );

  var e = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e.forkJoin(o, add);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('forkJoin throw empty', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error),
    onCompleted(230)
  );

  var e = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e.forkJoin(o, add);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('forkJoin return throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(230)
  );

  var e = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e.forkJoin(o, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('forkJoin throw return', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error),
    onCompleted(230)
  );

  var e = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e.forkJoin(o, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('forkJoin binary', function (t) {
  var scheduler = new TestScheduler();

  var o = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onNext(225, 4),
    onCompleted(230)
  );

  var e = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(235, 6),
    onNext(240, 7),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e.forkJoin(o, add);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 4 + 7),
    onCompleted(250)
  ]);

  t.end();
});
