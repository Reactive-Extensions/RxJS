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
  skipUntil: require('../observable/skipuntil')
});

test('Observable#skipUntil some data next', function (t) {
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
    return l.skipUntil(r);
  });

  reactiveAssert(t, results.messages, [
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#skipUntil some data error', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error();

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
    return l.skipUntil(r);
  });

  reactiveAssert(t, results.messages, [
    onError(225, error)
  ]);

  t.end();
});

test('Observable#skipUntil some data empty', function (t) {
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
    return l.skipUntil(r);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#skipUntil never next', function (t) {
  var scheduler = new TestScheduler();

  var l = Observable.never();

  var r = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(225, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return l.skipUntil(r);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#skipUntil never error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var l = Observable.never();

  var r = scheduler.createHotObservable(
    onNext(150, 1),
    onError(225, error));

  var results = scheduler.startScheduler(function () {
    return l.skipUntil(r);
  });

  reactiveAssert(t, results.messages, [
    onError(225, error)
  ]);

  t.end();
});

test('Observable#skipUntil some data never', function (t) {
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
    return l.skipUntil(r);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#skipUntil never empty', function (t) {
  var scheduler = new TestScheduler();

  var l = Observable.never();

  var r = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(225)
  );

  var results = scheduler.startScheduler(function () {
    return l.skipUntil(r);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#skipUntil never never', function (t) {
  var scheduler = new TestScheduler();

  var l = Observable.never();

  var r = Observable.never();

  var results = scheduler.startScheduler(function () {
    return l.skipUntil(r);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#skipUntil has completed causes disposal', function (t) {
  var scheduler = new TestScheduler();

  var disposed = false;

  var l = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var r = Observable.create(function () {
    return function () { disposed = true; };
  });

  var results = scheduler.startScheduler(function () {
    return l.skipUntil(r);
  });

  reactiveAssert(t, results.messages, []);

  t.ok(disposed);

  t.end();
});
