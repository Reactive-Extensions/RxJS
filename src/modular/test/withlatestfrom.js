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

Observable.addToPrototype({
  withLatestFrom: require('../observable/withlatestfrom')
});

test('withLatestFrom never never', function (t) {
  var scheduler = new TestScheduler();

  var e1 = Observable.never();
  var e2 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return e1.withLatestFrom(e2, add);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('withLatestFrom never empty', function (t) {
  var scheduler = new TestScheduler();

  var e1 = Observable.never();

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(210)
  );

  var results = scheduler.startScheduler(function () {
    return e1.withLatestFrom(e2, add);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('withLatestFrom empty never', function (t) {
  var scheduler = new TestScheduler();

  var e1 = Observable.never();

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(210)
  );

  var results = scheduler.startScheduler(function () {
    return e2.withLatestFrom(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(210)
  ]);

  t.end();
});

test('withLatestFrom emptyempty', function (t) {
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
    return e2.withLatestFrom(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(210)
  ]);

  t.end();
});

test('withLatestFrom empty return', function (t) {
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
    return e1.withLatestFrom(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(210)
  ]);

  t.end();
});

test('withLatestFrom return empty', function (t) {
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
    return e2.withLatestFrom(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(220)
  ]);

  t.end();
});

test('withLatestFrom never return', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(220)
  );

  var e2 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return e1.withLatestFrom(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(220)
  ]);

  t.end();
});

test('withLatestFrom return never', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(210)
  );

  var e2 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return e2.withLatestFrom(e1, add);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('withLatestFrom return return', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 2),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 3),
    onCompleted(240)
  );

  var results = scheduler.startScheduler(function () {
    return e1.withLatestFrom(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 2 + 3),
    onCompleted(230)
  ]);

  t.end();
});

test('withLatestFrom empty error', function (t) {
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
    return e1.withLatestFrom(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('withLatestFrom error empty', function (t) {
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
    return e2.withLatestFrom(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('withLatestFrom return throw', function (t) {
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
    return e1.withLatestFrom(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('withLatestFrom throw return', function (t) {
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
    return e2.withLatestFrom(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('withLatestFrom throw throw', function (t) {
  var error1 = new Error('error1');
  var error2 = new Error('error2');

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
    return e1.withLatestFrom(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error1)
  ]);

  t.end();
});

test('withLatestFrom error throw', function (t) {
  var error1 = new Error('error1');
  var error2 = new Error('error2');

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
    return e1.withLatestFrom(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error1)
  ]);

  t.end();
});

test('withLatestFrom throw error', function (t) {
  var error1 = new Error('error1');
  var error2 = new Error('error2');

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
    return e2.withLatestFrom(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error1)
  ]);

  t.end();
});

test('withLatestFrom never throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = Observable.never();

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error)
  );

  var results = scheduler.startScheduler(function () {
    return e1.withLatestFrom(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('withLatestFrom throw never', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = Observable.never();

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error)
  );

  var results = scheduler.startScheduler(function () {
    return e2.withLatestFrom(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('withLatestFrom some throw', function (t) {
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
    return e1.withLatestFrom(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('withLatestFrom throw some', function (t) {
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
    return e2.withLatestFrom(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('withLatestFrom throw after complete left', function (t) {
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
    return e1.withLatestFrom(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(220)
  ]);

  t.end();
});

test('withLatestFrom throw after complete right', function (t) {
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
    return e2.withLatestFrom(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onError(230, error)
  ]);

  t.end();
});

test('withLatestFrom interleaved with tail', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 3),
    onNext(230, 5),
    onNext(235, 6),
    onNext(240, 7),
    onCompleted(250)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onNext(225, 4),
    onCompleted(230)
  );

  var results = scheduler.startScheduler(function () {
    return e1.withLatestFrom(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 3 + 2),
    onNext(230, 5 + 4),
    onNext(235, 6 + 4),
    onNext(240, 7 + 4),
    onCompleted(250)
  ]);

  t.end();
});

test('withLatestFrom consecutive', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onNext(235, 4),
    onCompleted(240)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(225, 6),
    onNext(240, 7),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e1.withLatestFrom(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onNext(235, 4 + 6),
    onCompleted(240)
  ]);

  t.end();
});

test('withLatestFrom consecutive array', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onNext(235, 4),
    onCompleted(240)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(225, 6),
    onNext(240, 7),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e1.withLatestFrom(e2);
  });

  reactiveAssert(t, results.messages, [
    onNext(235, [4,6]),
    onCompleted(240)
  ]);

  t.end();
});

test('withLatestFrom consecutive end with error left', function (t) {
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
    return e1.withLatestFrom(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onError(230, error)
  ]);

  t.end();
});

test('withLatestFrom consecutive end with error right', function (t) {
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
    return e2.withLatestFrom(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onNext(235, 4 + 6),
    onNext(240, 4 + 7),
    onError(245, error)
  ]);

  t.end();
});

test('withLatestFrom consecutive end with error right array', function (t) {
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
    return e2.withLatestFrom(e1);
  });

  reactiveAssert(t, results.messages, [
    onNext(235, [6,4]),
    onNext(240, [7,4]),
    onError(245, error)
  ]);

  t.end();
});

test('withLatestFrom selector throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 2),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 3),
    onCompleted(240)
  );

  var results = scheduler.startScheduler(function () {
    return e1.withLatestFrom(e2, function () {
      throw error;
    });
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});
