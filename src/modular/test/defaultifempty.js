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
  defaultIfEmpty: require('../observable/defaultifempty')
});

test('Observable#defaultIfEmpty never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.defaultIfEmpty();
  });

  reactiveAssert(t, results.messages, [
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable#defaultIfEmpty error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.defaultIfEmpty();
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 210)
  ]);

  t.end();
});

test('Observable#defaultIfEmpty non-empty 1', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(280, 42),
    onNext(360, 43),
    onCompleted(420));

  var results = scheduler.startScheduler(function () {
    return xs.defaultIfEmpty();
  });

  reactiveAssert(t, results.messages, [
    onNext(280, 42),
    onNext(360, 43),
    onCompleted(420)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 420)
  ]);

  t.end();
});

test('Observable#defaultIfEmpty non-empty 2', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(280, 42),
    onNext(360, 43),
    onCompleted(420));

  var results = scheduler.startScheduler(function () {
    return xs.defaultIfEmpty(-1);
  });

  reactiveAssert(t, results.messages, [
    onNext(280, 42),
    onNext(360, 43),
    onCompleted(420)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 420)
  ]);

  t.end();
});

test('Observable#defaultIfEmpty empty 1', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onCompleted(420));

  var results = scheduler.startScheduler(function () {
    return xs.defaultIfEmpty(null);
  });

  reactiveAssert(t, results.messages, [
    onNext(420, null),
    onCompleted(420)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 420)
  ]);

  t.end();
});

test('Observable#defaultIfEmpty empty 2', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onCompleted(420));

  var results = scheduler.startScheduler(function () {
    return xs.defaultIfEmpty(-1);
  });

  reactiveAssert(t, results.messages, [
    onNext(420, -1),
    onCompleted(420)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 420)
  ]);

  t.end();
});
