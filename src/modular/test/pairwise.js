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
  pairwise: require('../observable/pairwise')
});

test('Observable#pairwise empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 5),
    onCompleted(210)
  );

  var results = scheduler.startScheduler(function () {
    return xs.pairwise();
  });

  reactiveAssert(t, results.messages, [
    onCompleted(210)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 210)
  ]);

  t.end();
});

test('Observable#pairwise single', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 5),
    onNext(210, 4),
    onCompleted(220)
  );

  var results = scheduler.startScheduler(function () {
    return xs.pairwise();
  });

  reactiveAssert(t, results.messages, [
    onCompleted(220)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 220)
  ]);

  t.end();
});

test('Observable#pairwise completed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 5),
    onNext(210, 4),
    onNext(240, 3),
    onNext(290, 2),
    onNext(350, 1),
    onCompleted(360)
  );

  var results = scheduler.startScheduler(function () {
    return xs.pairwise();
  });

  reactiveAssert(t, results.messages, [
    onNext(240, [4,3]),
    onNext(290, [3, 2]),
    onNext(350, [2, 1]),
    onCompleted(360)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 360)
  ]);

  t.end();
});

test('Observable#pairwise not completed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 5),
    onNext(210, 4),
    onNext(240, 3),
    onNext(290, 2),
    onNext(350, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.pairwise();
  });

  reactiveAssert(t, results.messages, [
    onNext(240, [4,3]),
    onNext(290, [3, 2]),
    onNext(350, [2, 1])
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable#pairwise error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 5),
    onNext(210, 4),
    onNext(240, 3),
    onError(290, error),
    onNext(350, 1),
    onCompleted(360)
  );

  var results = scheduler.startScheduler(function () {
    return xs.pairwise();
  });

  reactiveAssert(t, results.messages, [
    onNext(240, [4,3]),
    onError(290, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 290)
  ]);

  t.end();
});

test('Observable#pairwise disposed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 5),
    onNext(210, 4),
    onNext(240, 3),
    onNext(290, 2),
    onNext(350, 1),
    onCompleted(360)
  );

  var results = scheduler.startScheduler(function () {
    return xs.pairwise();
  }, { disposed: 280 });

  reactiveAssert(t, results.messages, [
    onNext(240, [4,3])
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 280)
  ]);

  t.end();
});
