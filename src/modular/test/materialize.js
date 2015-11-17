'use strict';

var test = require('tape');
var Observable = require('../observable');
var Notification = require('../notification');
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
  dematerialize: require('../observable/dematerialize'),
  materialize: require('../observable/materialize')
});

test('Observable#materialize never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.materialize();
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#materialize empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.materialize();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, Notification.createOnCompleted()),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#materialize return', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.materialize();
  });

  reactiveAssert(t, results.messages, [
    onNext(210, Notification.createOnNext(2)),
    onNext(250, Notification.createOnCompleted()),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#materialize throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(250, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.materialize();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, Notification.createOnError(error)),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#materialize dematerialize never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.materialize().dematerialize();
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#materialize dematerialize empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.materialize().dematerialize();
  });

  reactiveAssert(t, results.messages, [
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#materialize dematerialize return', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.materialize().dematerialize();
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#materialize dematerialize throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(250, error));

  var results = scheduler.startScheduler(function () {
    return xs.materialize().dematerialize();
  });

  reactiveAssert(t, results.messages, [
    onError(250, error)
  ]);

  t.end();
});
