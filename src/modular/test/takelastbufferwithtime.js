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
  takeLastBufferWithTime: require('../observable/takelastbufferwithtime')
});

test('Observable#takeLastBufferWithTime zero 1', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onCompleted(230)
  );

  var results = scheduler.startScheduler(function () {
    return xs.takeLastBufferWithTime(0, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(230, []),
    onCompleted(230)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 230)
  ]);

  t.end();
});

test('Observable#takeLastBufferWithTime zero 2', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onCompleted(230)
  );

  var results = scheduler.startScheduler(function () {
      return xs.takeLastBufferWithTime(0, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(230, []),
    onCompleted(230)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 230)
  ]);

  t.end();
});

test('Observable#takeLastBufferWithTime some 1', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onCompleted(240)
  );

  var results = scheduler.startScheduler(function () {
    return xs.takeLastBufferWithTime(25, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(240, [2,3]),
    onCompleted(240)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 240)
  ]);

  t.end();
});

test('Observable#takeLastBufferWithTime some 2', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onCompleted(300)
  );

  var results = scheduler.startScheduler(function () {
    return xs.takeLastBufferWithTime(25, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(300, []),
    onCompleted(300)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 300)
  ]);

  t.end();
});

test('Observable#takeLastBufferWithTime some 3', function (t) {
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
    return xs.takeLastBufferWithTime(45, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(300, [6,7,8,9]),
    onCompleted(300)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 300)
  ]);

  t.end();
});

test('Observable#takeLastBufferWithTime some 4', function (t) {
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
    return xs.takeLastBufferWithTime(25, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(350, []),
    onCompleted(350)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 350)
  ]);

  t.end();
});

test('Observable#takeLastBufferWithTime All', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onCompleted(230)
  );

  var results = scheduler.startScheduler(function () {
    return xs.takeLastBufferWithTime(50, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(230, [1,2]),
    onCompleted(230)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 230)
  ]);

  t.end();
});

test('Observable#takeLastBufferWithTime Error', function (t) {
  var scheduler = new TestScheduler();

  var ex = new Error();

  var xs = scheduler.createHotObservable(onError(210, ex));

  var results = scheduler.startScheduler(function () {
    return xs.takeLastBufferWithTime(50, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(210, ex)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 210)
  ]);

  t.end();
});

test('Observable#takeLastBufferWithTime never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable();

  var results = scheduler.startScheduler(function () {
    return xs.takeLastBufferWithTime(50, scheduler);
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});
