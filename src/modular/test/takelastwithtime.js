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
  takeLastWithTime: require('../observable/takelastwithtime')
});

test('Observable#takeLastWithTime zero 1', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onCompleted(230)
  );

  var results = scheduler.startScheduler(function () {
    return xs.takeLastWithTime(0, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(230)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 230)
  ]);

  t.end();
});

test('Observable#takeLastWithTime zero 2', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onCompleted(230)
  );

  var results = scheduler.startScheduler(function () {
    return xs.takeLastWithTime(0, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(230)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 230)
  ]);

  t.end();
});

test('Observable#takeLastWithTime some 1', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onCompleted(240)
  );

  var results = scheduler.startScheduler(function () {
    return xs.takeLastWithTime(25, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(240, 2),
    onNext(240, 3),
    onCompleted(240)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 240)
  ]);

  t.end();
});

test('Observable#takeLastWithTime some 2', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onCompleted(300)
  );

  var results = scheduler.startScheduler(function () {
    return xs.takeLastWithTime(25, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(300)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 300)
  ]);

  t.end();
});

test('Observable#takeLastWithTime some 3', function (t) {
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
    return xs.takeLastWithTime(45, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(300, 6),
    onNext(300, 7),
    onNext(300, 8),
    onNext(300, 9),
    onCompleted(300)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 300)
  ]);

  t.end();
});

test('Observable#takeLastWithTime some 4', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(240, 2),
    onNext(250, 3),
    onNext(280, 4),
    onNext(290, 5),
    onNext(300, 6),
    onCompleted(350)
  );

  var results = scheduler.startScheduler(function () {
    return xs.takeLastWithTime(25, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(350)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 350)
  ]);

  t.end();
});

test('Observable#takeLastWithTime all', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onCompleted(230)
  );

  var results = scheduler.startScheduler(function () {
    return xs.takeLastWithTime(50, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(230, 1),
    onNext(230, 2),
    onCompleted(230)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 230)
  ]);

  t.end();
});

test('Observable#takeLastWithTime error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.takeLastWithTime(50, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 210)
  ]);

  t.end();
});

test('Observable#takeLastWithTime never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.takeLastWithTime(50, scheduler);
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});
