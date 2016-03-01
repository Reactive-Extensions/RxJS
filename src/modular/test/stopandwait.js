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
  controlled: require('../observable/controlled')
});

test('ControlledObservable#stopAndWait never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.controlled(true, scheduler).stopAndWait(scheduler);
  });

  reactiveAssert(t, results.messages, [

  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('ControlledObservable#stopAndWait empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.controlled(true, scheduler).stopAndWait(scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('ControlledObservable#stopAndWait basic', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.controlled(true, scheduler).stopAndWait(scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('ControlledObservable#stopAndWait error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onError(250, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.controlled(true, scheduler).stopAndWait(scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onError(250, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('ControlledObservable#stopAndWait infinite', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5)
  );

  var results = scheduler.startScheduler(function () {
    return xs.controlled(true, scheduler).stopAndWait(scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('ControlledObservable#windowed disposed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onNext(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.controlled(true, scheduler).stopAndWait(scheduler);
  }, { disposed: 235 });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 235)
  ]);

  t.end();
});
