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
  sample: require('../observable/sample')
});

test('Observable#sample regular', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(230, 3),
    onNext(260, 4),
    onNext(300, 5),
    onNext(350, 6),
    onNext(380, 7),
    onCompleted(390)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sample(50, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 3),
    onNext(300, 5),
    onNext(350, 6),
    onNext(400, 7),
    onCompleted(400)
  ]);

  t.end();
});

test('Observable#sample error in flight', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(230, 3),
    onNext(260, 4),
    onNext(300, 5),
    onNext(310, 6),
    onError(330, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sample(50, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 3),
    onNext(300, 5),
    onError(330, error)
  ]);

  t.end();
});

test('Observable#sample empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sample(0, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#sample Error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sample(0, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#sample never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sample(0, scheduler);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#sample sampler simple 1', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(300, 5),
    onNext(310, 6),
    onCompleted(400)
  );

  var ys = scheduler.createHotObservable(
    onNext(150, ''),
    onNext(210, 'bar'),
    onNext(250, 'foo'),
    onNext(260, 'qux'),
    onNext(320, 'baz'),
    onCompleted(500)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sample(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 3),
    onNext(320, 6),
    onCompleted(500 /* on sampling boundaries only */)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 500)
  ]);

  t.end();
});

test('Observable#sample sampler simple 2', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(300, 5),
    onNext(310, 6),
    onNext(360, 7),
    onCompleted(400)
  );

  var ys = scheduler.createHotObservable(
    onNext(150, ''),
    onNext(210, 'bar'),
    onNext(250, 'foo'),
    onNext(260, 'qux'),
    onNext(320, 'baz'),
    onCompleted(500)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sample(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 3),
    onNext(320, 6),
    onNext(500, 7),
    onCompleted(500 /* on sampling boundaries only */)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 500)
  ]);

  t.end();
});

test('Observable#sample sampler simple 3', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 2),
    onNext(240, 3),
    onNext(290, 4),
    onCompleted(300)
  );

  var ys = scheduler.createHotObservable(
    onNext(150, ''),
    onNext(210, 'bar'),
    onNext(250, 'foo'),
    onNext(260, 'qux'),
    onNext(320, 'baz'),
    onCompleted(500)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sample(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 3),
    onNext(320, 4),
    onCompleted(320 /* on sampling boundaries only */)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 300)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 320)
  ]);

  t.end();
});

test('Observable#sample completes if earlier completes', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 2),
    onNext(240, 3),
    onNext(290, 4),
    onCompleted(300)
  );

  var ys = scheduler.createHotObservable(
    onNext(150, ''),
    onCompleted(210)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sample(ys);
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 300)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable#sample sampler source throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(300, 5),
    onNext(310, 6),
    onError(320, error)
  );

  var ys = scheduler.createHotObservable(
    onNext(150, ''),
    onNext(210, 'bar'),
    onNext(250, 'foo'),
    onNext(260, 'qux'),
    onNext(330, 'baz'),
    onCompleted(400)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sample(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 3),
    onError(320, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 320)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 320)
  ]);

  t.end();
});
