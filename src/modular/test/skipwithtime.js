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
  skipWithTime: require('../observable/skipwithtime')
});

test('Observable#skipWithTime zero', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onCompleted(230)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipWithTime(0, scheduler);
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

test('Observable#skipWithTime some', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onCompleted(230)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipWithTime(15, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 2),
    onCompleted(230)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 230)
  ]);

  t.end();
});

test('Observable#skipWithTime late', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onCompleted(230));

  var results = scheduler.startScheduler(function () {
    return xs.skipWithTime(50, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(230)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 230)
  ]);

  t.end();
});

test('Observable#skipWithTime error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipWithTime(50, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 210)
  ]);

  t.end();
});

test('Observable#skipWithTime never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable();

  var results = scheduler.startScheduler(function () {
    return xs.skipWithTime(50, scheduler);
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable#skipWithTime twice 1', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onNext(240, 4),
    onNext(250, 5),
    onNext(260, 6),
    onCompleted(270)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipWithTime(15, scheduler).skipWithTime(30, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(240, 4),
    onNext(250, 5),
    onNext(260, 6),
    onCompleted(270)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 270)
  ]);

  t.end();
});

test('Observable#skipWithTime twice 2', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onNext(240, 4),
    onNext(250, 5),
    onNext(260, 6),
    onCompleted(270)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipWithTime(30, scheduler).skipWithTime(15, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(240, 4),
    onNext(250, 5),
    onNext(260, 6),
    onCompleted(270)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 270)
  ]);

  t.end();
});
