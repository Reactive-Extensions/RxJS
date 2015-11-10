'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe;

Observable.addToObject({
  concat: require('../observable/concat'),
  never: require('../observable/never')
});

Observable.addToPrototype({
  concat: require('../observable/concat')
});

test('concat empty empty', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e1.concat(e2);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(250)
  ]);

  t.end();
});

test('concat empty never', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(230)
  );

  var e2 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return e1.concat(e2);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('concat never empty', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(230)
  );

  var e2 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return e2.concat(e1);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('concat never never', function (t) {
  var scheduler = new TestScheduler();

  var e1 = Observable.never();
  var e2 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return e1.concat(e2);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('concat empty throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(250, error)
  );

  var results = scheduler.startScheduler(function () {
    return e1.concat(e2);
  });

  reactiveAssert(t, results.messages, [
    onError(250, error)
  ]);

  t.end();
});

test('concat throw empty', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(230, error)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e1.concat(e2);
  });

  reactiveAssert(t, results.messages, [
    onError(230, error)
  ]);

  t.end();
});

test('concat throw throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(230, error)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(250, new Error())
  );

  var results = scheduler.startScheduler(function () {
    return e1.concat(e2);
  });

  reactiveAssert(t, results.messages, [
    onError(230, error)
  ]);

  t.end();
});

test('concat return empty', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e1.concat(e2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onCompleted(250)
  ]);

  t.end();
});

test('concat empty return', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(240, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e1.concat(e2);
  });

  reactiveAssert(t, results.messages, [
    onNext(240, 2),
    onCompleted(250)
  ]);

  t.end();
});

test('concat return never', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(230)
  );

  var e2 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return e1.concat(e2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2)
  ]);

  t.end();
});

test('concat never return', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(230)
  );

  var e2 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return e2.concat(e1);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('concat return return', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 2),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(240, 3),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e1.concat(e2);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 2),
    onNext(240, 3),
    onCompleted(250)
  ]);

  t.end();
});

test('concat throw return', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(230, error)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(240, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e1.concat(e2);
  });

  reactiveAssert(t, results.messages, [
    onError(230, error)
  ]);

  t.end();
});

test('concat return throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 2),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(250, error)
  );

  var results = scheduler.startScheduler(function () {
    return e1.concat(e2);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 2),
    onError(250, error)
  ]);

  t.end();
});

test('concat some data on both sides', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onCompleted(225)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e1.concat(e2);
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

test('concat as arguments', function (t) {
  var scheduler = new TestScheduler();

  var xs1 = scheduler.createColdObservable(
      onNext(10, 1),
      onNext(20, 2),
      onNext(30, 3),
      onCompleted(40)
  );

  var xs2 = scheduler.createColdObservable(
    onNext(10, 4),
    onNext(20, 5),
    onCompleted(30)
  );

  var xs3 = scheduler.createColdObservable(
    onNext(10, 6),
    onNext(20, 7),
    onNext(30, 8),
    onNext(40, 9),
    onCompleted(50)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.concat(xs1, xs2, xs3);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onNext(250, 4),
    onNext(260, 5),
    onNext(280, 6),
    onNext(290, 7),
    onNext(300, 8),
    onNext(310, 9),
    onCompleted(320)
  ]);

  reactiveAssert(t, xs1.subscriptions, [
    subscribe(200, 240)
  ]);

  reactiveAssert(t, xs2.subscriptions, [
    subscribe(240, 270)
  ]);

  reactiveAssert(t, xs3.subscriptions, [
    subscribe(270, 320)
  ]);

  t.end();
});
