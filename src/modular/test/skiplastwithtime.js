'use strict';

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe;

Observable.addToPrototype({
  skipLastWithTime: require('../observable/skiplastwithtime')
});

test('Observable#skipLastWithTime zero 1', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onCompleted(230)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipLastWithTime(0, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 1),
    onNext(220, 2),
    onCompleted(230)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 230)
  ]);

  t.end();
});

test('Observable#skipLastWithTime zero 2', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onCompleted(230)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipLastWithTime(0, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onCompleted(230)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 230)
  ]);

  t.end();
});

test('Observable#skipLastWithTime some 1', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onCompleted(230)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipLastWithTime(15, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(230, 1),
    onCompleted(230)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 230)
  ]);

  t.end();
});

test('Observable#skipLastWithTime some 2', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onNext(240, 4),
    onNext(250, 5),
    onNext(260, 6),
    onNext(270, 7),
    onNext(280, 8),
    onNext(290, 9),
    onCompleted(300)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipLastWithTime(45, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(260, 1),
    onNext(270, 2),
    onNext(280, 3),
    onNext(290, 4),
    onNext(300, 5),
    onCompleted(300)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 300)
  ]);

  t.end();
});

test('Observable#skipLastWithTime some all', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onCompleted(230)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipLastWithTime(45, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(230)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 230)
  ]);

  t.end();
});

test('Observable#skipLastWithTime error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipLastWithTime(45, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 210)
  ]);

  t.end();
});

test('Observable#skipLastWithTime never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipLastWithTime(50, scheduler);
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});
