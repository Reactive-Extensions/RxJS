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
  subscribeOn: require('../observable/subscribeon')
});

test('Observable#subscribeOn normal', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.subscribeOn(scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(201, 251)
  ]);

  t.end();
});

test('Observable#subscribeOn error', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.subscribeOn(scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(201, 211)
  ]);

  t.end();
});

test('Observable#subscribeOn empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.subscribeOn(scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(201, 251)
  ]);

  t.end();
});

test('Observable#subscribeOn never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.subscribeOn(scheduler);
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(201, 1001)
  ]);

  t.end();
});
