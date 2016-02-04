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
  repeat: require('../observable/repeatvalue'),
  'throw': require('../observable/throw')
});

Observable.addToPrototype({
  repeat: require('../observable/repeat')
});

test('Observable#repeat value count zero', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.repeat(42, 0, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(200)
  ]);

  t.end();
});

test('Observable#repeat value count one', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.repeat(42, 1, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 42),
    onCompleted(201)
  ]);

  t.end();
});

test('Observable#repeat value count ten', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.repeat(42, 10, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 42),
    onNext(202, 42),
    onNext(203, 42),
    onNext(204, 42),
    onNext(205, 42),
    onNext(206, 42),
    onNext(207, 42),
    onNext(208, 42),
    onNext(209, 42),
    onNext(210, 42),
    onCompleted(210)
  ]);

  t.end();
});

test('Observable#repeat value count dispose', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.repeat(42, 10, scheduler);
  }, { disposed: 207 });

  reactiveAssert(t, results.messages, [
    onNext(201, 42),
    onNext(202, 42),
    onNext(203, 42),
    onNext(204, 42),
    onNext(205, 42),
    onNext(206, 42)
  ]);

  t.end();
});

test('Observable#repeat value', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.repeat(42, -1, scheduler);
  }, { disposed: 207 });

  reactiveAssert(t, results.messages, [
    onNext(201, 42),
    onNext(202, 42),
    onNext(203, 42),
    onNext(204, 42),
    onNext(205, 42),
    onNext(206, 42)
  ]);

  t.end();
});

function noop() { }

test('Observable#repeat Observable basic', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(100, 1),
    onNext(150, 2),
    onNext(200, 3),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.repeat();
  });

  reactiveAssert(t, results.messages, [
    onNext(300, 1),
    onNext(350, 2),
    onNext(400, 3),
    onNext(550, 1),
    onNext(600, 2),
    onNext(650, 3),
    onNext(800, 1),
    onNext(850, 2),
    onNext(900, 3)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 450),
    subscribe(450, 700),
    subscribe(700, 950),
    subscribe(950, 1000)
  ]);

  t.end();
});

test('Observable#repeat Observable infinite', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(100, 1),
    onNext(150, 2),
    onNext(200, 3));

  var results = scheduler.startScheduler(function () {
    return xs.repeat();
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

test('Observable#repeat Observable error', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error();

  var xs = scheduler.createColdObservable(
    onNext(100, 1),
    onNext(150, 2),
    onNext(200, 3),
    onError(250, error));

  var results = scheduler.startScheduler(function () {
    return xs.repeat();
  });

  reactiveAssert(t, results.messages, [
    onNext(300, 1),
    onNext(350, 2),
    onNext(400, 3),
    onError(450, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 450)
  ]);

  t.end();
});

test('Observable#repeat Observable throws', function (t) {
  var scheduler1 = new TestScheduler();
  var xs = Observable.just(1, scheduler1).repeat();

  xs.subscribe(function () {
    throw new Error();
  });

  t.throws(function () {
    scheduler1.start();
  });

  var scheduler2 = new TestScheduler();
  var ys = Observable['throw'](new Error(), scheduler2).repeat();

  ys.subscribe(noop, function () {
    throw new Error();
  });

  t.throws(function () {
    scheduler2.start();
  });

  var scheduler3 = new TestScheduler();
  var zs = Observable.just(1, scheduler3).repeat();

  var d = zs.subscribe(noop, noop, function () { throw new Error(); });

  scheduler3.scheduleAbsolute(null, 210, function () {
    d.dispose();
  });

  scheduler3.start();

  var xss = Observable.create(function () { throw new Error(); }).repeat();

  t.throws(function () {
    xss.subscribe();
  });

  t.end();
});

test('Observable#repeat Observable repeat count Basic', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(5, 1),
    onNext(10, 2),
    onNext(15, 3),
    onCompleted(20));

  var results = scheduler.startScheduler(function () {
    return xs.repeat(3);
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
    onCompleted(260)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 220),
    subscribe(220, 240),
    subscribe(240, 260)
  ]);

  t.end();
});

test('Observable#repeat Observable repeat count dispose', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(5, 1),
    onNext(10, 2),
    onNext(15, 3),
    onCompleted(20));

  var results = scheduler.startScheduler(function () {
    return xs.repeat(3);
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

test('Observable#repeat Observable repeat count infinite', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(100, 1),
    onNext(150, 2),
    onNext(200, 3)
  );

  var results = scheduler.startScheduler(function () {
    return xs.repeat(3);
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

test('Observable#repeat Observable repeat count error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(100, 1),
    onNext(150, 2),
    onNext(200, 3),
    onError(250, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.repeat(3);
  });

  reactiveAssert(t, results.messages, [
    onNext(300, 1),
    onNext(350, 2),
    onNext(400, 3),
    onError(450, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 450)
  ]);

  t.end();
});

test('Observable#repeat Observable repeat count throws', function (t) {
  var scheduler1 = new TestScheduler();
  var xs = Observable.just(1, scheduler1).repeat(3);

  xs.subscribe(function () { throw new Error(); });

  t.throws(function () {
    return scheduler1.start();
  });

  var scheduler2 = new TestScheduler();
  var ys = Observable['throw'](new Error(), scheduler2).repeat(3);

  ys.subscribe(noop, function () { throw new Error(); });

  t.throws(function () {
    scheduler2.start();
  });

  var scheduler3 = new TestScheduler();
  var zs = Observable.just(1, scheduler3).repeat(100);

  var d = zs.subscribe(noop, noop, function () { throw new Error(); });

  scheduler3.scheduleAbsolute(null, 10, function () {
    d.dispose();
  });

  scheduler3.start();

  var xss = Observable.create(function () { throw new Error(); }).repeat(3);

  t.throws(function () {
    xss.subscribe();
  });

  t.end();
});
