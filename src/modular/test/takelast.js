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
  takeLast: require('../observable/takelast')
});

test('Observable#takeLast zero completed', function (t) {
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
    return xs.takeLast(0);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(650)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 650)
  ]);

  t.end();
});

test('Observable#takeLast zero error', function (t) {
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
    return xs.takeLast(0);
  });

  reactiveAssert(t, results.messages, [
    onError(650, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 650)
  ]);

  t.end();
});

test('Observable#takeLast zero disposed', function (t) {
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
    return xs.takeLast(0);
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable#takeLast one completed', function (t) {
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
    return xs.takeLast(1);
  });

  reactiveAssert(t, results.messages, [
    onNext(650, 9),
    onCompleted(650)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 650)
  ]);

  t.end();
});

test('Observable#takeLast one error', function (t) {
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
    return xs.takeLast(1);
  });

  reactiveAssert(t, results.messages, [
    onError(650, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 650)
  ]);

  t.end();
});

test('Observable#takeLast one disposed', function (t) {
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
    return xs.takeLast(1);
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable#takeLast three completed', function (t) {
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
    return xs.takeLast(3);
  });

  reactiveAssert(t, results.messages, [
    onNext(650, 7),
    onNext(650, 8),
    onNext(650, 9),
    onCompleted(650)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 650)
  ]);

  t.end();
});

test('Observable#takeLast three error', function (t) {
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
    return xs.takeLast(3);
  });

  reactiveAssert(t, results.messages, [
    onError(650, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 650)
  ]);

  t.end();
});

test('Observable#takeLast three disposed', function (t) {
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
    return xs.takeLast(3);
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});
