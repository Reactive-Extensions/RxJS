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

Observable.addToObject({
  create: require('../observable/create'),
  just: require('../observable/just'),
  'throw': require('../observable/throw')
});

Observable.addToPrototype({
  retry: require('../observable/retry')
});

function noop() { }

test('Observable#retry Observable basic', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(100, 1),
    onNext(150, 2),
    onNext(200, 3),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.retry();
  });

  reactiveAssert(t, results.messages, [
    onNext(300, 1),
    onNext(350, 2),
    onNext(400, 3),
    onCompleted(450)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 450)
  ]);

  t.end();
});

test('Observable#retry Observable infinite', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(100, 1),
    onNext(150, 2),
    onNext(200, 3)
  );

  var results = scheduler.startScheduler(function () {
    return xs.retry();
  });

  reactiveAssert(t, results.messages, [
    onNext(300, 1),
    onNext(350, 2),
    onNext(400, 3)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable#retry Observable error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(100, 1),
    onNext(150, 2),
    onNext(200, 3),
    onError(250, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.retry();
  }, { disposed: 1100 });

  reactiveAssert(t, results.messages, [
    onNext(300, 1),
    onNext(350, 2),
    onNext(400, 3),
    onNext(550, 1),
    onNext(600, 2),
    onNext(650, 3),
    onNext(800, 1),
    onNext(850, 2),
    onNext(900, 3),
    onNext(1050, 1)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 450),
    subscribe(450, 700),
    subscribe(700, 950),
    subscribe(950, 1100)
  ]);

  t.end();
});

test('Observable#retry Observable throws', function (t) {
  var scheduler1 = new TestScheduler();

  var xs = Observable.just(1, scheduler1).retry();

  xs.subscribe(function () {
    throw new Error();
  });

  t.throws(function () {
    return scheduler1.start();
  });

  var scheduler2 = new TestScheduler();

  var ys = Observable['throw'](new Error(), scheduler2).retry();

  var d = ys.subscribe(noop, function (err) { throw err; });

  scheduler2.scheduleAbsolute(null, 210, function () {
    return d.dispose();
  });

  scheduler2.start();

  var scheduler3 = new TestScheduler();

  var zs = Observable.just(1, scheduler3).retry();

  zs.subscribe(noop, noop, function () { throw new Error(); });

  t.throws(function () {
    return scheduler3.start();
  });

  t.end();
});

test('Observable#retry Observable retry count basic', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error();

  var xs = scheduler.createColdObservable(
    onNext(5, 1),
    onNext(10, 2),
    onNext(15, 3),
    onError(20, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.retry(3);
  });

  reactiveAssert(t, results.messages, [
    onNext(205, 1),
    onNext(210, 2),
    onNext(215, 3),
    onNext(225, 1),
    onNext(230, 2),
    onNext(235, 3),
    onNext(245, 1),
    onNext(250, 2),
    onNext(255, 3),
    onError(260, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 220),
    subscribe(220, 240),
    subscribe(240, 260)
  ]);

  t.end();
});

test('Observable#retry Observable retry count dispose', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error();

  var xs = scheduler.createColdObservable(
    onNext(5, 1),
    onNext(10, 2),
    onNext(15, 3),
    onError(20, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.retry(3);
  }, { disposed: 231 });

  reactiveAssert(t, results.messages, [
    onNext(205, 1),
    onNext(210, 2),
    onNext(215, 3),
    onNext(225, 1),
    onNext(230, 2)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 220),
    subscribe(220, 231)
  ]);

  t.end();
});

test('Observable#retry retry count dispose', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(100, 1),
    onNext(150, 2),
    onNext(200, 3)
  );

  var results = scheduler.startScheduler(function () {
    return xs.retry(3);
  });

  reactiveAssert(t, results.messages, [
    onNext(300, 1),
    onNext(350, 2),
    onNext(400, 3)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable#retry Observable retry count dispose', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(100, 1),
    onNext(150, 2),
    onNext(200, 3),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.retry(3);
  });

  reactiveAssert(t, results.messages, [
    onNext(300, 1),
    onNext(350, 2),
    onNext(400, 3),
    onCompleted(450)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 450)
  ]);

  t.end();
});

test('Observable#retry Observable retry count Throws', function (t) {
  var scheduler1 = new TestScheduler();

  var xs = Observable.just(1, scheduler1).retry(3);

  xs.subscribe(function () {
    throw new Error();
  });

  t.throws(function () {
    return scheduler1.start();
  });

  var scheduler2 = new TestScheduler();

  var ys = Observable['throw'](new Error(), scheduler2).retry(100);

  var d = ys.subscribe(noop, function (err) { throw err; });

  scheduler2.scheduleAbsolute(null, 10, function () {
    return d.dispose();
  });

  scheduler2.start();

  var scheduler3 = new TestScheduler();

  var zs = Observable.just(1, scheduler3).retry(100);

  zs.subscribe(noop, noop, function () { throw new Error(); });

  t.throws(function () {
    return scheduler3.start();
  });

  var xss = Observable.create(function () { throw new Error(); }).retry(100);

  t.throws(function () {
    return xss.subscribe();
  });

  t.end();
});
