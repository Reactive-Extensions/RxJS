'use strict';

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe,
  created = ReactiveTest.created,
  disposed = ReactiveTest.disposed,
  subscribed = ReactiveTest.subscribed;

Observable.addToPrototype({
  publishValue: require('../observable/publishvalue'),
  skip: require('../observable/skip'),
  zip: require('../observable/zip')
});

function add(x, y) { return x + y; }

test('Observable#publishValue basic', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 7),
    onNext(220, 3),
    onNext(280, 4),
    onNext(290, 1),
    onNext(340, 8),
    onNext(360, 5),
    onNext(370, 6),
    onNext(390, 7),
    onNext(410, 13),
    onNext(430, 2),
    onNext(450, 9),
    onNext(520, 11),
    onNext(560, 20),
    onCompleted(600)
  );

  var results = scheduler.createObserver();

  var ys;
  var subscription;
  var connection;

  scheduler.scheduleAbsolute(null, created, function () {
    ys = xs.publishValue(1979);
  });

  scheduler.scheduleAbsolute(null, subscribed, function () {
    subscription = ys.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, disposed, function () {
    subscription.dispose();
  });

  scheduler.scheduleAbsolute(null, 300, function () {
    connection = ys.connect();
  });

  scheduler.scheduleAbsolute(null, 400, function () {
    connection.dispose();
  });

  scheduler.scheduleAbsolute(null, 500, function () {
    connection = ys.connect();
  });

  scheduler.scheduleAbsolute(null, 550, function () {
    connection.dispose();
  });

  scheduler.scheduleAbsolute(null, 650, function () {
    connection = ys.connect();
  });

  scheduler.scheduleAbsolute(null, 800, function () {
    connection.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(200, 1979),
    onNext(340, 8),
    onNext(360, 5),
    onNext(370, 6),
    onNext(390, 7),
    onNext(520, 11)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(300, 400),
    subscribe(500, 550),
    subscribe(650, 800)
  ]);

  t.end();
});

test('Observable#publishValue error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 7),
    onNext(220, 3),
    onNext(280, 4),
    onNext(290, 1),
    onNext(340, 8),
    onNext(360, 5),
    onNext(370, 6),
    onNext(390, 7),
    onNext(410, 13),
    onNext(430, 2),
    onNext(450, 9),
    onNext(520, 11),
    onNext(560, 20),
    onError(600, error)
  );

  var results = scheduler.createObserver();

  var ys;
  var subscription;
  var connection;

  scheduler.scheduleAbsolute(null, created, function () {
    ys = xs.publishValue(1979);
  });

  scheduler.scheduleAbsolute(null, subscribed, function () {
    subscription = ys.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, disposed, function () {
    subscription.dispose();
  });

  scheduler.scheduleAbsolute(null, 300, function () {
    connection = ys.connect();
  });

  scheduler.scheduleAbsolute(null, 400, function () {
    connection.dispose();
  });

  scheduler.scheduleAbsolute(null, 500, function () {
    connection = ys.connect();
  });

  scheduler.scheduleAbsolute(null, 800, function () {
    connection.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(200, 1979),
    onNext(340, 8),
    onNext(360, 5),
    onNext(370, 6),
    onNext(390, 7),
    onNext(520, 11),
    onNext(560, 20),
    onError(600, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(300, 400),
    subscribe(500, 600)
  ]);

  t.end();
});

test('Observable#publishValue complete', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 7),
    onNext(220, 3),
    onNext(280, 4),
    onNext(290, 1),
    onNext(340, 8),
    onNext(360, 5),
    onNext(370, 6),
    onNext(390, 7),
    onNext(410, 13),
    onNext(430, 2),
    onNext(450, 9),
    onNext(520, 11),
    onNext(560, 20),
    onCompleted(600)
  );

  var results = scheduler.createObserver();

  var ys;
  var subscription;
  var connection;

  scheduler.scheduleAbsolute(null, created, function () {
    ys = xs.publishValue(1979);
  });

  scheduler.scheduleAbsolute(null, subscribed, function () {
    subscription = ys.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, disposed, function () {
    subscription.dispose();
  });

  scheduler.scheduleAbsolute(null, 300, function () {
    connection = ys.connect();
  });

  scheduler.scheduleAbsolute(null, 400, function () {
    connection.dispose();
  });

  scheduler.scheduleAbsolute(null, 500, function () {
    connection = ys.connect();
  });

  scheduler.scheduleAbsolute(null, 800, function () {
    connection.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(200, 1979),
    onNext(340, 8),
    onNext(360, 5),
    onNext(370, 6),
    onNext(390, 7),
    onNext(520, 11),
    onNext(560, 20),
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(300, 400),
    subscribe(500, 600)
  ]);

  t.end();
});

test('Observable#publishValue dispose', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 7),
    onNext(220, 3),
    onNext(280, 4),
    onNext(290, 1),
    onNext(340, 8),
    onNext(360, 5),
    onNext(370, 6),
    onNext(390, 7),
    onNext(410, 13),
    onNext(430, 2),
    onNext(450, 9),
    onNext(520, 11),
    onNext(560, 20),
    onCompleted(600)
  );

  var ys;
  var subscription;
  var connection;

  var results = scheduler.createObserver();

  scheduler.scheduleAbsolute(null, created, function () {
    ys = xs.publishValue(1979);
  });

  scheduler.scheduleAbsolute(null, subscribed, function () {
    subscription = ys.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, 350, function () {
    subscription.dispose();
  });

  scheduler.scheduleAbsolute(null, 300, function () {
    connection = ys.connect();
  });

  scheduler.scheduleAbsolute(null, 400, function () {
    connection.dispose();
  });

  scheduler.scheduleAbsolute(null, 500, function () {
    connection = ys.connect();
  });

  scheduler.scheduleAbsolute(null, 550, function () {
    connection.dispose();
  });

  scheduler.scheduleAbsolute(null, 650, function () {
    connection = ys.connect();
  });

  scheduler.scheduleAbsolute(null, 800, function () {
    connection.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(200, 1979),
    onNext(340, 8)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(300, 400),
    subscribe(500, 550),
    subscribe(650, 800)
  ]);

  t.end();
});

test('Observable#publishValue multiple connections', function (t) {
  var xs = Observable.never();
  var ys = xs.publishValue(1979);

  var connection1 = ys.connect();
  var connection2 = ys.connect();

  t.ok(connection1 === connection2);

  connection1.dispose();
  connection2.dispose();

  var connection3 = ys.connect();
  t.ok(connection1 !== connection3);

  t.end();
});

test('Observable#publishValue zip complete', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 7),
    onNext(220, 3),
    onNext(280, 4),
    onNext(290, 1),
    onNext(340, 8),
    onNext(360, 5),
    onNext(370, 6),
    onNext(390, 7),
    onNext(410, 13),
    onNext(430, 2),
    onNext(450, 9),
    onNext(520, 11),
    onNext(560, 20),
    onCompleted(600)
  );

  var results = scheduler.startScheduler(function () {
    return xs.publishValue(function (_xs) {
      return _xs.zip(_xs.skip(1), add);
    }, 1979);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 1982),
    onNext(280, 7),
    onNext(290, 5),
    onNext(340, 9),
    onNext(360, 13),
    onNext(370, 11),
    onNext(390, 13),
    onNext(410, 20),
    onNext(430, 15),
    onNext(450, 11),
    onNext(520, 20),
    onNext(560, 31),
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});

test('Observable#publishValue zip error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 7),
    onNext(220, 3),
    onNext(280, 4),
    onNext(290, 1),
    onNext(340, 8),
    onNext(360, 5),
    onNext(370, 6),
    onNext(390, 7),
    onNext(410, 13),
    onNext(430, 2),
    onNext(450, 9),
    onNext(520, 11),
    onNext(560, 20),
    onError(600, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.publishValue(function (_xs) {
      return _xs.zip(_xs.skip(1), add);
    }, 1979);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 1982),
    onNext(280, 7),
    onNext(290, 5),
    onNext(340, 9),
    onNext(360, 13),
    onNext(370, 11),
    onNext(390, 13),
    onNext(410, 20),
    onNext(430, 15),
    onNext(450, 11),
    onNext(520, 20),
    onNext(560, 31),
    onError(600, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});

test('Observable#publishValue zip dispose', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 7),
    onNext(220, 3),
    onNext(280, 4),
    onNext(290, 1),
    onNext(340, 8),
    onNext(360, 5),
    onNext(370, 6),
    onNext(390, 7),
    onNext(410, 13),
    onNext(430, 2),
    onNext(450, 9),
    onNext(520, 11),
    onNext(560, 20),
    onCompleted(600)
  );

  var results = scheduler.startScheduler(function () {
    return xs.publishValue(function (_xs) {
      return _xs.zip(_xs.skip(1), add);
    }, 1979);
  }, { disposed: 470 });

  reactiveAssert(t, results.messages, [
    onNext(220, 1982),
    onNext(280, 7),
    onNext(290, 5),
    onNext(340, 9),
    onNext(360, 13),
    onNext(370, 11),
    onNext(390, 13),
    onNext(410, 20),
    onNext(430, 15),
    onNext(450, 11)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 470)
  ]);

  t.end();
});
