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
  skipUntilWithTime: require('../observable/skipuntilwithtime')
});

test('Observable#skipUntilWithTime zero', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onCompleted(230)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipUntilWithTime(new Date(0), scheduler);
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

test('Observable#skipUntilWithTime late', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onCompleted(230)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipUntilWithTime(new Date(250), scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(230)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 230)
  ]);

  t.end();
});

test('Observable#skipUntilWithTime error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipUntilWithTime(new Date(250), scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 210)
  ]);

  t.end();
});

test('Observable#skipUntilWithTime never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable();

  var results = scheduler.startScheduler(function () {
      return xs.skipUntilWithTime(new Date(250), scheduler);
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable#skipUntil twice 1', function (t) {
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
      .skipUntilWithTime(new Date(215), scheduler)
      .skipUntilWithTime(new Date(230), scheduler);
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

test('Observable#skipUntil twice 2', function (t) {
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
      .skipUntilWithTime(new Date(230), scheduler)
      .skipUntilWithTime(new Date(215), scheduler);
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
