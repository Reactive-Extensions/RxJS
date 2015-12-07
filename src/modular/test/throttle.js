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
  throttle: require('../observable/throttle')
});

test('Observable#throttle completed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(250, 3),
    onNext(310, 4),
    onNext(350, 5),
    onNext(410, 6),
    onNext(450, 7),
    onCompleted(500)
  );

  var results = scheduler.startScheduler(function () {
    return xs.throttle(200, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(410, 6),
    onCompleted(500)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 500)
  ]);

  t.end();
});

test('Observable#throttle never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.throttle(200, scheduler);
  });

  reactiveAssert(t, results.messages, [
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable#throttle empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(500)
  );

  var results = scheduler.startScheduler(function () {
    return xs.throttle(200, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(500)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 500)
  ]);

  t.end();
});

test('Observable#throttle error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(250, 3),
    onNext(310, 4),
    onNext(350, 5),
    onError(410, error),
    onNext(450, 7),
    onCompleted(500)
  );

  var results = scheduler.startScheduler(function () {
    return xs.throttle(200, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onError(410, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 410)
  ]);

  t.end();
});

test('Observable#throttle no end', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(250, 3),
    onNext(310, 4),
    onNext(350, 5),
    onNext(410, 6),
    onNext(450, 7)
  );

  var results = scheduler.startScheduler(function () {
    return xs.throttle(200, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(410, 6)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});
