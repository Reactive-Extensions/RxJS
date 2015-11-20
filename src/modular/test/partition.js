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
  partition: require('../observable/partition')
});

function isEven(num) {
  return +num % 2 === 0;
}

test('Observable#partition empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 5),
    onCompleted(210)
  );

  var observables,
    subscription1,
    subscription2,
    results1 = scheduler.createObserver(),
    results2 = scheduler.createObserver();

  scheduler.scheduleAbsolute(null, ReactiveTest.created, function () {
    observables = xs.partition(isEven);
  });

  scheduler.scheduleAbsolute(null, ReactiveTest.subscribed, function () {
    subscription1 = observables[0].subscribe(results1);
    subscription2 = observables[1].subscribe(results2);
  });

  scheduler.scheduleAbsolute(null, ReactiveTest.disposed, function () {
    subscription1.dispose();
    subscription2.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results1.messages, [
    onCompleted(210)
  ]);

  reactiveAssert(t, results2.messages, [
    onCompleted(210)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 210),
    subscribe(200, 210)
  ]);

  t.end();
});

test('Observable#partition single', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 5),
    onNext(210, 4),
    onCompleted(220)
  );

  var observables,
    subscription1,
    subscription2,
    results1 = scheduler.createObserver(),
    results2 = scheduler.createObserver();

  scheduler.scheduleAbsolute(null, ReactiveTest.created, function () {
    observables = xs.partition(isEven);
  });

  scheduler.scheduleAbsolute(null, ReactiveTest.subscribed, function () {
    subscription1 = observables[0].subscribe(results1);
    subscription2 = observables[1].subscribe(results2);
  });

  scheduler.scheduleAbsolute(null, ReactiveTest.disposed, function () {
    subscription1.dispose();
    subscription2.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results1.messages, [
    onNext(210, 4),
    onCompleted(220)
  ]);

  reactiveAssert(t, results2.messages, [
    onCompleted(220)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 220),
    subscribe(200, 220)
  ]);

  t.end();
});

test('Observable#partition each', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 5),
    onNext(210, 4),
    onNext(220, 3),
    onCompleted(230)
  );

  var observables,
    subscription1,
    subscription2,
    results1 = scheduler.createObserver(),
    results2 = scheduler.createObserver();

  scheduler.scheduleAbsolute(null, ReactiveTest.created, function () {
    observables = xs.partition(isEven);
  });

  scheduler.scheduleAbsolute(null, ReactiveTest.subscribed, function () {
    subscription1 = observables[0].subscribe(results1);
    subscription2 = observables[1].subscribe(results2);
  });

  scheduler.scheduleAbsolute(null, ReactiveTest.disposed, function () {
    subscription1.dispose();
    subscription2.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results1.messages, [
    onNext(210, 4),
    onCompleted(230)
  ]);

  reactiveAssert(t, results2.messages, [
    onNext(220, 3),
    onCompleted(230)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 230),
    subscribe(200, 230)
  ]);

  t.end();
});

test('Observable#partition completed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 5),
    onNext(210, 4),
    onNext(240, 3),
    onNext(290, 2),
    onNext(350, 1),
    onCompleted(360)
  );

  var observables,
    subscription1,
    subscription2,
    results1 = scheduler.createObserver(),
    results2 = scheduler.createObserver();

  scheduler.scheduleAbsolute(null, ReactiveTest.created, function () {
    observables = xs.partition(isEven);
  });

  scheduler.scheduleAbsolute(null, ReactiveTest.subscribed, function () {
    subscription1 = observables[0].subscribe(results1);
    subscription2 = observables[1].subscribe(results2);
  });

  scheduler.scheduleAbsolute(null, ReactiveTest.disposed, function () {
    subscription1.dispose();
    subscription2.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results1.messages, [
    onNext(210, 4),
    onNext(290, 2),
    onCompleted(360)
  ]);

  reactiveAssert(t, results2.messages, [
    onNext(240, 3),
    onNext(350, 1),
    onCompleted(360)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 360),
    subscribe(200, 360)
  ]);

  t.end();
});

test('Observable#partition not completed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 5),
    onNext(210, 4),
    onNext(240, 3),
    onNext(290, 2),
    onNext(350, 1)
  );

  var observables,
    subscription1,
    subscription2,
    results1 = scheduler.createObserver(),
    results2 = scheduler.createObserver();

  scheduler.scheduleAbsolute(null, ReactiveTest.created, function () {
    observables = xs.partition(isEven);
  });

  scheduler.scheduleAbsolute(null, ReactiveTest.subscribed, function () {
    subscription1 = observables[0].subscribe(results1);
    subscription2 = observables[1].subscribe(results2);
  });

  scheduler.scheduleAbsolute(null, ReactiveTest.disposed, function () {
    subscription1.dispose();
    subscription2.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results1.messages, [
    onNext(210, 4),
    onNext(290, 2)
  ]);

  reactiveAssert(t, results2.messages, [
    onNext(240, 3),
    onNext(350, 1)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000),
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable#partition error', function (t) {
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

  var observables,
    subscription1,
    subscription2,
    results1 = scheduler.createObserver(),
    results2 = scheduler.createObserver();

  scheduler.scheduleAbsolute(null, ReactiveTest.created, function () {
    observables = xs.partition(isEven);
  });

  scheduler.scheduleAbsolute(null, ReactiveTest.subscribed, function () {
    subscription1 = observables[0].subscribe(results1);
    subscription2 = observables[1].subscribe(results2);
  });

  scheduler.scheduleAbsolute(null, ReactiveTest.disposed, function () {
    subscription1.dispose();
    subscription2.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results1.messages, [
    onNext(210, 4),
    onError(290, error)
  ]);

  reactiveAssert(t, results2.messages, [
    onNext(240, 3),
    onError(290, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 290),
    subscribe(200, 290)
  ]);

  t.end();
});

test('Observable#partition disposed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 5),
    onNext(210, 4),
    onNext(240, 3),
    onNext(290, 2),
    onNext(350, 1),
    onCompleted(360)
  );

  var observables,
    subscription1,
    subscription2,
    results1 = scheduler.createObserver(),
    results2 = scheduler.createObserver();

  scheduler.scheduleAbsolute(null, ReactiveTest.created, function () {
    observables = xs.partition(isEven);
  });

  scheduler.scheduleAbsolute(null, ReactiveTest.subscribed, function () {
    subscription1 = observables[0].subscribe(results1);
    subscription2 = observables[1].subscribe(results2);
  });

  scheduler.scheduleAbsolute(null, 280, function () {
    subscription1.dispose();
    subscription2.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results1.messages, [
    onNext(210, 4)
  ]);

  reactiveAssert(t, results2.messages, [
    onNext(240, 3)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 280),
    subscribe(200, 280)
  ]);

  t.end();
});
