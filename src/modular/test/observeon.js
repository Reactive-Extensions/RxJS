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
  observeOn: require('../observable/observeon')
});

test('Observable#observeOn normal', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.observeOn(scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(211, 2),
    onCompleted(251)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 251)
  ]);

  t.end();
});

test('Observable#observeOn Error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();


  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.observeOn(scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(211, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 211)
  ]);

  t.end();
});

test('Observable#observeOn empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.observeOn(scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(251)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 251)
  ]);

  t.end();
});

test('Observable#observeOn never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.observeOn(scheduler);
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});
