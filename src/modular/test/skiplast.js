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
  skipLast: require('../observable/skiplast')
});

test('Observable#skipLast zero completed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 1),
    onNext(210, 2),
    onNext(250, 3),
    onNext(270, 4),
    onNext(310, 5),
    onNext(360, 6),
    onNext(380, 7),
    onNext(410, 8),
    onNext(590, 9),
    onCompleted(650)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipLast(0);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(250, 3),
    onNext(270, 4),
    onNext(310, 5),
    onNext(360, 6),
    onNext(380, 7),
    onNext(410, 8),
    onNext(590, 9),
    onCompleted(650)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 650)
  ]);

  t.end();
});

test('Observable#skipLast zero error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 1),
    onNext(210, 2),
    onNext(250, 3),
    onNext(270, 4),
    onNext(310, 5),
    onNext(360, 6),
    onNext(380, 7),
    onNext(410, 8),
    onNext(590, 9),
    onError(650, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipLast(0);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(250, 3),
    onNext(270, 4),
    onNext(310, 5),
    onNext(360, 6),
    onNext(380, 7),
    onNext(410, 8),
    onNext(590, 9),
    onError(650, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 650)
  ]);

  t.end();
});

test('Observable#skipLast zero disposed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 1),
    onNext(210, 2),
    onNext(250, 3),
    onNext(270, 4),
    onNext(310, 5),
    onNext(360, 6),
    onNext(380, 7),
    onNext(410, 8),
    onNext(590, 9)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipLast(0);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(250, 3),
    onNext(270, 4),
    onNext(310, 5),
    onNext(360, 6),
    onNext(380, 7),
    onNext(410, 8),
    onNext(590, 9)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable#skipLast one completed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 1),
    onNext(210, 2),
    onNext(250, 3),
    onNext(270, 4),
    onNext(310, 5),
    onNext(360, 6),
    onNext(380, 7),
    onNext(410, 8),
    onNext(590, 9),
    onCompleted(650)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipLast(1);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 2),
    onNext(270, 3),
    onNext(310, 4),
    onNext(360, 5),
    onNext(380, 6),
    onNext(410, 7),
    onNext(590, 8),
    onCompleted(650)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 650)
  ]);

  t.end();
});

test('Observable#skipLast one error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 1),
    onNext(210, 2),
    onNext(250, 3),
    onNext(270, 4),
    onNext(310, 5),
    onNext(360, 6),
    onNext(380, 7),
    onNext(410, 8),
    onNext(590, 9),
    onError(650, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipLast(1);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 2),
    onNext(270, 3),
    onNext(310, 4),
    onNext(360, 5),
    onNext(380, 6),
    onNext(410, 7),
    onNext(590, 8),
    onError(650, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 650)
  ]);

  t.end();
});

test('Observable#skipLast one disposed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 1),
    onNext(210, 2),
    onNext(250, 3),
    onNext(270, 4),
    onNext(310, 5),
    onNext(360, 6),
    onNext(380, 7),
    onNext(410, 8),
    onNext(590, 9)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipLast(1);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 2),
    onNext(270, 3),
    onNext(310, 4),
    onNext(360, 5),
    onNext(380, 6),
    onNext(410, 7),
    onNext(590, 8)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable#skipLast three completed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 1),
    onNext(210, 2),
    onNext(250, 3),
    onNext(270, 4),
    onNext(310, 5),
    onNext(360, 6),
    onNext(380, 7),
    onNext(410, 8),
    onNext(590, 9),
    onCompleted(650)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipLast(3);
  });

  reactiveAssert(t, results.messages, [
    onNext(310, 2),
    onNext(360, 3),
    onNext(380, 4),
    onNext(410, 5),
    onNext(590, 6),
    onCompleted(650)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 650)
  ]);

  t.end();
});

test('Observable#skipLast three error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 1),
    onNext(210, 2),
    onNext(250, 3),
    onNext(270, 4),
    onNext(310, 5),
    onNext(360, 6),
    onNext(380, 7),
    onNext(410, 8),
    onNext(590, 9),
    onError(650, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipLast(3);
  });

  reactiveAssert(t, results.messages, [
    onNext(310, 2),
    onNext(360, 3),
    onNext(380, 4),
    onNext(410, 5),
    onNext(590, 6),
    onError(650, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 650)
  ]);

  t.end();
});

test('Observable#skipLast three disposed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 1),
    onNext(210, 2),
    onNext(250, 3),
    onNext(270, 4),
    onNext(310, 5),
    onNext(360, 6),
    onNext(380, 7),
    onNext(410, 8),
    onNext(590, 9)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skipLast(3);
  });

  reactiveAssert(t, results.messages, [
    onNext(310, 2),
    onNext(360, 3),
    onNext(380, 4),
    onNext(410, 5),
    onNext(590, 6)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});
