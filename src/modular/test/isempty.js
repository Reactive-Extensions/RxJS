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
  isEmpty: require('../observable/isempty')
});

test('Observable#isEmpty empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.isEmpty();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, true),
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#isEmpty return', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.isEmpty();
  });

  reactiveAssert(t, results.messages, [
    onNext(210, false),
    onCompleted(210)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 210)
  ]);

  t.end();
});

test('Observable#isEmpty throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.isEmpty();
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 210)
  ]);

  t.end();
});

test('Observable#isEmpty never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1));

  var results = scheduler.startScheduler(function () {
    return xs.isEmpty();
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});
