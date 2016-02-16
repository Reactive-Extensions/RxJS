'use strict';

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted;

var CompositeError = require('../internal/errors').CompositeError;

Observable.addToObject({
  mergeDelayError: require('../observable/mergedelayerror')
});

test('Observable.mergeDelayError never never', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1)
  );
  var o2 = scheduler.createHotObservable(
    onNext(160, 1)
  );

  var results = scheduler.startScheduler(function() {
    return Observable.mergeDelayError(o1, o2);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable.mergeDelayError empty right', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );
  var o2 = scheduler.createHotObservable(
    onNext(160, 1),
    onCompleted(260)
  );

  var results = scheduler.startScheduler(function() {
    return Observable.mergeDelayError(o1, o2);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(260)
  ]);

  t.end();
});

test('Observable.mergeDelayError empty left', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(260)
  );
  var o2 = scheduler.createHotObservable(
    onNext(160, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function() {
    return Observable.mergeDelayError(o1, o2);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(260)
  ]);

  t.end();
});

test('Observable.mergeDelayError empty middle', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(260)
  );
  var o2 = scheduler.createHotObservable(
    onNext(160, 1),
    onCompleted(250)
  );
  var o3 = scheduler.createHotObservable(
    onNext(160, 1),
    onCompleted(270)
  );

  var results = scheduler.startScheduler(function() {
    return Observable.mergeDelayError(o1, o2, o3);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(270)
  ]);

  t.end();
});

test('Observable.mergeDelayError empty never', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(260)
  );
  var o2 = scheduler.createHotObservable(
    onNext(160, 1)
  );

  var results = scheduler.startScheduler(function() {
    return Observable.mergeDelayError(o1, o2);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable.mergeDelayError never empty', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1)
  );
  var o2 = scheduler.createHotObservable(
    onNext(160, 1),
    onCompleted(260)
  );

  var results = scheduler.startScheduler(function() {
    return Observable.mergeDelayError(o1, o2);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable.mergeDelayError return never', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );
  var o2 = scheduler.createHotObservable(
    onNext(160, 1)
  );

  var results = scheduler.startScheduler(function() {
    return Observable.mergeDelayError(o1, o2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2)
  ]);

  t.end();
});

test('Observable.mergeDelayError never return', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );
  var o2 = scheduler.createHotObservable(
    onNext(160, 1)
  );

  var results = scheduler.startScheduler(function() {
    return Observable.mergeDelayError(o2, o1);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2)
  ]);

  t.end();
});

test('Observable.mergeDelayError error never', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(250, error) // error dropped
  );
  var o2 = scheduler.createHotObservable(
    onNext(160, 1)
  );

  var results = scheduler.startScheduler(function() {
    return Observable.mergeDelayError(o1, o2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2)
  ]);

  t.end();
});

test('Observable.mergeDelayError never error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(250, error) // error dropped
  );
  var o2 = scheduler.createHotObservable(
    onNext(160, 1)
  );

  var results = scheduler.startScheduler(function() {
    return Observable.mergeDelayError(o2, o1);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2)
  ]);

  t.end();
});

test('Observable.mergeDelayError error empty', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(250, error)
  );
  var o2 = scheduler.createHotObservable(
    onNext(160, 1),
    onCompleted(260)
  );

  var results = scheduler.startScheduler(function() {
    return Observable.mergeDelayError(o1, o2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onError(260, error)
  ]);

  t.end();
});

test('Observable.mergeDelayError empty error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(250, error)
  );
  var o2 = scheduler.createHotObservable(
    onNext(160, 1),
    onCompleted(260)
  );

  var results = scheduler.startScheduler(function() {
    return Observable.mergeDelayError(o2, o1);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onError(260, error)
  ]);

  t.end();
});

test('Observable.mergeDelayError no errors', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );
  var o2 = scheduler.createHotObservable(
    onNext(160, 1),
    onNext(215, 2),
    onCompleted(260)
  );

  var results = scheduler.startScheduler(function() {
    return Observable.mergeDelayError(o1, o2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(215, 2),
    onCompleted(260)
  ]);

  t.end();
});

test('Observable.mergeDelayError error error', function (t) {
  var error1 = new Error();
  var error2 = new Error();
  var composite = new CompositeError([error1, error2]);

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(250, error1)
  );
  var o2 = scheduler.createHotObservable(
    onNext(160, 1),
    onNext(215, 2),
    onError(260, error2)
  );

  var results = scheduler.startScheduler(function() {
    return Observable.mergeDelayError(o2, o1);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(215, 2),
    onError(260, composite)
  ]);

  t.end();
});

test('Observable.mergeDelayError error left', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(250, error),
    onNext(270, 3),
    onCompleted(280)
  );
  var o2 = scheduler.createHotObservable(
    onNext(160, 1),
    onNext(215, 2),
    onCompleted(260)
  );

  var results = scheduler.startScheduler(function() {
    return Observable.mergeDelayError(o1, o2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(215, 2),
    onError(260, error)
  ]);

  t.end();
});

test('Observable.mergeDelayError error right', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(250, error),
    onNext(270, 3),
    onCompleted(280)
  );
  var o2 = scheduler.createHotObservable(
    onNext(160, 1),
    onNext(215, 2),
    onCompleted(260)
  );

  var results = scheduler.startScheduler(function() {
    return Observable.mergeDelayError(o2, o1);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(215, 2),
    onError(260, error)
  ]);

  t.end();
});

test('Observable.mergeDelayError infinite left error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4)
  );
  var o2 = scheduler.createHotObservable(
    onNext(160, 1),
    onNext(215, 2),
    onNext(225, 3),
    onError(260, error) // Error dropped
  );

  var results = scheduler.startScheduler(function() {
    return Observable.mergeDelayError(o1, o2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(215, 2),
    onNext(220, 3),
    onNext(225, 3),
    onNext(230, 4)
  ]);

  t.end();
});

test('Observable.mergeDelayError infinite right error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4)
  );
  var o2 = scheduler.createHotObservable(
    onNext(160, 1),
    onNext(215, 2),
    onNext(225, 3),
    onError(260, error) // Error dropped
  );

  var results = scheduler.startScheduler(function() {
    return Observable.mergeDelayError(o2, o1);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(215, 2),
    onNext(220, 3),
    onNext(225, 3),
    onNext(230, 4)
  ]);

  t.end();
});
