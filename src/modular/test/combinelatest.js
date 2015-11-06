'use strict';
/* jshint undef: true, unused: true */

function add (x, y) { return x + y; }

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted;

Observable.addToObject({
  combineLatest: require('../observable/combinelatest')
});

Observable.addToPrototype({
  combineLatest: require('../observable/combinelatest'),
});

test('combineLatest never never', function (t) {
  var scheduler = new TestScheduler();

  var e1 = Observable.never();
  var e2 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return e1.combineLatest(e2, add);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('combineLatest never empty', function (t) {
  var scheduler = new TestScheduler();

  var e1 = Observable.never();

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(210)
  );

  var results = scheduler.startScheduler(function () {
    return e1.combineLatest(e2, add);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('combineLatest empty never', function (t) {
  var scheduler = new TestScheduler();

  var e1 = Observable.never();

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(210)
  );

  var results = scheduler.startScheduler(function () {
    return e2.combineLatest(e1, add);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('combineLatest empty empty', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(210)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(210)
  );

  var results = scheduler.startScheduler(function () {
    return e2.combineLatest(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(210)
  ]);

  t.end();
});

test('combineLatest empty return', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(210)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(220)
  );

  var results = scheduler.startScheduler(function () {
    return e1.combineLatest(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(215)
  ]);

  t.end();
});

test('combineLatest return empty', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(210)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(220)
  );

  var results = scheduler.startScheduler(function () {
    return e2.combineLatest(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(215)
  ]);

  t.end();
});

test('combineLatest never return', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(220)
  );

  var e2 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return e1.combineLatest(e2, add);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('combineLatest return never', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(210));

  var e2 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return e2.combineLatest(e1, add);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('combineLatest return return', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 3),
    onCompleted(240)
  );

  var results = scheduler.startScheduler(function () {
    return e1.combineLatest(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 2 + 3),
    onCompleted(240)
  ]);

  t.end();
});

test('combineLatest return return no selector', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 3),
    onCompleted(240)
  );

  var results = scheduler.startScheduler(function () {
    return e1.combineLatest(e2);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, [2, 3]),
    onCompleted(240)
  ]);

  t.end();
});

test('combineLatest empty error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error)
  );

  var results = scheduler.startScheduler(function () {
    return e1.combineLatest(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('combineLatest error empty', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error)
  );

  var results = scheduler.startScheduler(function () {
    return e2.combineLatest(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('combineLatest return throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error)
  );

  var results = scheduler.startScheduler(function () {
    return e1.combineLatest(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('combineLatest throw return', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error)
  );

  var results = scheduler.startScheduler(function () {
    return e2.combineLatest(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('combineLatest throw throw', function (t) {
  var error1 = new Error();
  var error2 = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error1)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(230, error2)
  );

  var results = scheduler.startScheduler(function () {
    return e1.combineLatest(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error1)
  ]);

  t.end();
});

test('combineLatest ErrorThrow', function (t) {
  var error1 = new Error();
  var error2 = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(220, error1)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(230, error2)
  );

  var results = scheduler.startScheduler(function () {
    return e1.combineLatest(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error1)
  ]);

  t.end();
});

test('combineLatest throw error', function (t) {
  var error1 = new Error();
  var error2 = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(220, error1)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(230, error2)
  );

  var results = scheduler.startScheduler(function () {
    return e2.combineLatest(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error1)
  ]);

  t.end();
});

test('combineLatest never throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = Observable.never();

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error)
  );

  var results = scheduler.startScheduler(function () {
    return e1.combineLatest(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('combineLatest throw never', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = Observable.never();

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error));

  var results = scheduler.startScheduler(function () {
    return e2.combineLatest(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('combineLatest some throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error)
  );

  var results = scheduler.startScheduler(function () {
    return e1.combineLatest(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('combineLatest throw some', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(230));
  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error));

  var results = scheduler.startScheduler(function () {
    return e2.combineLatest(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('combineLatest throw after complete left', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(220)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(230, error)
  );

  var results = scheduler.startScheduler(function () {
    return e1.combineLatest(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onError(230, error)
  ]);

  t.end();
});

test('combineLatest throw after complete right', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(220)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(230, error)
  );

  var results = scheduler.startScheduler(function () {
    return e2.combineLatest(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onError(230, error)
  ]);

  t.end();
});

test('combineLatest interleaved with tail', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onNext(225, 4),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 3),
    onNext(230, 5),
    onNext(235, 6),
    onNext(240, 7),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e1.combineLatest(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 2 + 3),
    onNext(225, 3 + 4),
    onNext(230, 4 + 5),
    onNext(235, 4 + 6),
    onNext(240, 4 + 7),
    onCompleted(250)
  ]);

  t.end();
});

test('combineLatest consecutive', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onNext(225, 4),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(235, 6),
    onNext(240, 7),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e1.combineLatest(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onNext(235, 4 + 6),
    onNext(240, 4 + 7),
    onCompleted(250)
  ]);

  t.end();
});

test('combineLatest consecutive end with error left', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onNext(225, 4),
    onError(230, error)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(235, 6),
    onNext(240, 7),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e1.combineLatest(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onError(230, error)
  ]);

  t.end();
});

test('combineLatest consecutive end with error right', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onNext(225, 4),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(235, 6),
    onNext(240, 7),
    onError(245, error)
  );

  var results = scheduler.startScheduler(function () {
    return e2.combineLatest(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onNext(235, 4 + 6),
    onNext(240, 4 + 7),
    onError(245, error)
  ]);

  t.end();
});

test('combineLatest selector throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 3),
    onCompleted(240)
  );

  var results = scheduler.startScheduler(function () {
    return e1.combineLatest(e2, function () { throw error; });
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});
