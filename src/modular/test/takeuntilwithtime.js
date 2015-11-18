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
  takeUntilWithTime: require('../observable/takeuntilwithtime')
});

test('Observable#takeUntilWithTime zero', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onCompleted(230)
  );

  var results = scheduler.startScheduler(function () {
    return xs.takeUntilWithTime(new Date(0), scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(201)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 201)
  ]);

  t.end();
});

test('Observable#takeUntilWithTime late', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onCompleted(230)
  );

  var results = scheduler.startScheduler(function () {
    return xs.takeUntilWithTime(new Date(250), scheduler);
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

test('Observable#takeUntilWithTime error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.takeUntilWithTime(new Date(250), scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 210)
  ]);

  t.end();
});

test('Observable#takeUntilWithTime never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable();

  var results = scheduler.startScheduler(function () {
    return xs.takeUntilWithTime(new Date(250), scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#takeUntilWithTime twice 1', function (t) {
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
    return xs
      .takeUntilWithTime(new Date(255), scheduler)
      .takeUntilWithTime(new Date(235), scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onCompleted(235)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 235)
  ]);

  t.end();
});

test('Observable#takeUntilWithTime twice 2', function (t) {
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
    return xs
      .takeUntilWithTime(new Date(235), scheduler)
      .takeUntilWithTime(new Date(255), scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onCompleted(235)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 235)
  ]);

  t.end();
});
