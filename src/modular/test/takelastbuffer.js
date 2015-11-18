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
  takeLastBuffer: require('../observable/takelastbuffer')
});

test('Observable#takeLastBuffer zero completed', function (t) {
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
    return xs.takeLastBuffer(0);
  });

  reactiveAssert(t, results.messages, [
    onNext(650, []),
    onCompleted(650)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 650)
  ]);

  t.end();
});

test('Observable#takeLastBuffer zero error', function (t) {
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
    return xs.takeLastBuffer(0);
  });

  reactiveAssert(t, results.messages, [
    onError(650, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 650)
  ]);

  t.end();
});

test('Observable#takeLastBuffer zero disposed', function (t) {
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
    return xs.takeLastBuffer(0);
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable#takeLastBuffer one completed', function (t) {
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
    return xs.takeLastBuffer(1);
  });

  reactiveAssert(t, results.messages, [
    onNext(650, [9]),
    onCompleted(650)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 650)
  ]);

  t.end();
});

test('Observable#takeLastBuffer one error', function (t) {
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
    return xs.takeLastBuffer(1);
  });

  reactiveAssert(t, results.messages, [
    onError(650, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 650)
  ]);

  t.end();
});

test('Observable#takeLastBuffer one disposed', function (t) {
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
    return xs.takeLastBuffer(1);
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable#takeLastBuffer three completed', function (t) {
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
    return xs.takeLastBuffer(3);
  });

  reactiveAssert(t, results.messages, [
    onNext(650, [7, 8, 9]),
    onCompleted(650)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 650)
  ]);

  t.end();
});

test('Observable#takeLastBuffer three error', function (t) {
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
    return xs.takeLastBuffer(3);
  });

  reactiveAssert(t, results.messages, [
    onError(650, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 650)
  ]);

  t.end();
});

test('Observable#takeLastBuffer three disposed', function (t) {
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
    return xs.takeLastBuffer(3);
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});
