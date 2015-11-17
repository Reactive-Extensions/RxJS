'use strict';

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
  delaySubscription: require('../observable/delaysubscription')
});

test('Observable#delaySubscription relative', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(50, 42),
    onNext(60, 43),
    onCompleted(70)
  );

  var results = scheduler.startScheduler(function() {
    return xs.delaySubscription(30, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(280, 42),
    onNext(290, 43),
    onCompleted(300)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(230, 300)
  ]);

  t.end();
});

test('Observable#delaySubscription relative hot', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function() {
    return xs.delaySubscription(20, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(220, 250)
  ]);

  t.end();
});

test('Observable#delaySubscription relative hot misses all', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function() {
    return xs.delaySubscription(200, scheduler);
  });

  reactiveAssert(t, results.messages, [
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(400, 1000)
  ]);

  t.end();
});

test('Observable#delaySubscription relative hot cancel', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function() {
    return xs.delaySubscription(20, scheduler);
  }, { disposed: 210 });

  reactiveAssert(t, results.messages, [
  ]);

  reactiveAssert(t, xs.subscriptions, [
  ]);

  t.end();
});

test('Observable#delaySubscription relative error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(50, 42),
    onNext(60, 43),
    onError(70, error)
  );

  var results = scheduler.startScheduler(function() {
    return xs.delaySubscription(30, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(280, 42),
    onNext(290, 43),
    onError(300, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(230, 300)
  ]);

  t.end();
});

test('Observable#delaySubscription absolute', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(50, 42),
    onNext(60, 43),
    onCompleted(70)
  );

  var results = scheduler.startScheduler(function() {
    return xs.delaySubscription(new Date(230), scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(280, 42),
    onNext(290, 43),
    onCompleted(300)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(230, 300)
  ]);

  t.end();
});

test('Observable#delaySubscription absolute hot', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function() {
    return xs.delaySubscription(new Date(220), scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(220, 250)
  ]);

  t.end();
});

test('Observable#delaySubscription relative hot misses all', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function() {
    return xs.delaySubscription(new Date(400), scheduler);
  });

  reactiveAssert(t, results.messages, [
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(400, 1000)
  ]);

  t.end();
});

test('Observable#delaySubscription relative hot cancel', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function() {
    return xs.delaySubscription(new Date(220), scheduler);
  }, { disposed: 210 });

  reactiveAssert(t, results.messages, [
  ]);

  reactiveAssert(t, xs.subscriptions, [
  ]);

  t.end();
});

test('Observable#delaySubscription absolute error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(50, 42),
    onNext(60, 43),
    onError(70, error)
  );

  var results = scheduler.startScheduler(function() {
    return xs.delaySubscription(new Date(230), scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(280, 42),
    onNext(290, 43),
    onError(300, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(230, 300)
  ]);

  t.end();
});
