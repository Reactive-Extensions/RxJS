'use strict';

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe;

Observable.addToPrototype({
  distinct: require('../observable/distinct')
});

test('Observable#distinct default comparer all distinct', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(280, 4),
    onNext(300, 2),
    onNext(350, 1),
    onNext(380, 3),
    onNext(400, 5),
    onCompleted(420)
  );

  var results = scheduler.startScheduler(function () {
    return xs.distinct();
  });

  reactiveAssert(t, results.messages, [
    onNext(280, 4),
    onNext(300, 2),
    onNext(350, 1),
    onNext(380, 3),
    onNext(400, 5),
    onCompleted(420)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 420)
  ]);

  t.end();
});

test('Observable#distinct default comparer some duplicates', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(280, 4),
    onNext(300, 2),
    onNext(350, 2),
    onNext(380, 3),
    onNext(400, 4),
    onCompleted(420)
  );

  var results = scheduler.startScheduler(function () {
    return xs.distinct();
  });

  reactiveAssert(t, results.messages, [
    onNext(280, 4),
    onNext(300, 2),
    onNext(380, 3),
    onCompleted(420)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 420)
  ]);

  t.end();
});

function modComparer(mod) {
  return function (x, y) { return x % mod === y % mod; };
}

test('Observable#distinct CustomComparer all distinct', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(280, 4),
    onNext(300, 2),
    onNext(350, 1),
    onNext(380, 3),
    onNext(400, 5),
    onCompleted(420)
  );

  var results = scheduler.startScheduler(function () {
    return xs.distinct(null, modComparer(10));
  });

  reactiveAssert(t, results.messages, [
    onNext(280, 4),
    onNext(300, 2),
    onNext(350, 1),
    onNext(380, 3),
    onNext(400, 5),
    onCompleted(420)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 420)
  ]);

  t.end();
});

test('Observable#distinct custom comparer some duplicates', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(280, 4),
    onNext(300, 2),
    onNext(350, 12),
    onNext(380, 3),
    onNext(400, 24),
    onCompleted(420)
  );

  var results = scheduler.startScheduler(function () {
    return xs.distinct(null, modComparer(10));
  });

  reactiveAssert(t, results.messages, [
    onNext(280, 4),
    onNext(300, 2),
    onNext(380, 3),
    onCompleted(420)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 420)
  ]);

  t.end();
});
