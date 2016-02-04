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
  disposed = ReactiveTest.disposed;

Observable.addToObject({
  never: require('../observable/never')
});

Observable.addToPrototype({
  repeat: require('../observable/repeat'),
  replay: require('../observable/replay'),
  take: require('../observable/take')
});

test('Observable#replay count basic', function (t) {
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
    ys = xs.replay(null, 3, null, scheduler);
  });

  scheduler.scheduleAbsolute(null, 450, function () {
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
    onNext(451, 5),
    onNext(452, 6),
    onNext(453, 7),
    onNext(521, 11)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(300, 400),
    subscribe(500, 550),
    subscribe(650, 800)
  ]);

  t.end();
});

test('Observable#replay count error', function (t) {
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
     ys = xs.replay(null, 3, null, scheduler);
  });

  scheduler.scheduleAbsolute(null, 450, function () {
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
    onNext(451, 5),
    onNext(452, 6),
    onNext(453, 7),
    onNext(521, 11),
    onNext(561, 20),
    onError(601, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(300, 400),
    subscribe(500, 600)
  ]);

  t.end();
});

test('Observable#replay count complete', function (t) {
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
    ys = xs.replay(null, 3, null, scheduler);
  });

  scheduler.scheduleAbsolute(null, 450, function () {
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
    onNext(451, 5),
    onNext(452, 6),
    onNext(453, 7),
    onNext(521, 11),
    onNext(561, 20),
    onCompleted(601)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(300, 400),
    subscribe(500, 600)
  ]);

  t.end();
});

test('Observable#replay count dispose', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));

  var results = scheduler.createObserver();

  var ys;
  var subscription;
  var connection;

  scheduler.scheduleAbsolute(null, created, function () {
    ys = xs.replay(null, 3, null, scheduler);
  });

  scheduler.scheduleAbsolute(null, 450, function () {
    subscription = ys.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, 475, function () {
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
    onNext(451, 5),
    onNext(452, 6),
    onNext(453, 7)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(300, 400),
    subscribe(500, 550),
    subscribe(650, 800)
  ]);

  t.end();
});

test('Observable#replay count multiple connections', function (t) {
  var xs = Observable.never();
  var ys = xs.replay(null, 3);

  var connection1 = ys.connect();
  var connection2 = ys.connect();
  t.ok(connection1 === connection2);

  connection1.dispose();
  connection2.dispose();

  var connection3 = ys.connect();
  t.ok(connection1 !== connection3);

  t.end();
});

test('Observable#replay count function zip complete', function (t) {
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
    return xs.replay(function (_xs) {
      return _xs.take(6).repeat();
    }, 3, null, scheduler);
  }, {disposed: 610 });

  reactiveAssert(t, results.messages, [
    onNext(221, 3),
    onNext(281, 4),
    onNext(291, 1),
    onNext(341, 8),
    onNext(361, 5),
    onNext(371, 6),
    onNext(372, 8),
    onNext(373, 5),
    onNext(374, 6),
    onNext(391, 7),
    onNext(411, 13),
    onNext(431, 2),
    onNext(432, 7),
    onNext(433, 13),
    onNext(434, 2),
    onNext(451, 9),
    onNext(521, 11),
    onNext(561, 20),
    onNext(562, 9),
    onNext(563, 11),
    onNext(564, 20),
    onNext(602, 9),
    onNext(603, 11),
    onNext(604, 20),
    onNext(606, 9),
    onNext(607, 11),
    onNext(608, 20)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});

test('Observable#replay count function zip error', function (t) {
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
    return xs.replay(function (_xs) {
      return _xs.take(6).repeat();
    }, 3, null, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(221, 3),
    onNext(281, 4),
    onNext(291, 1),
    onNext(341, 8),
    onNext(361, 5),
    onNext(371, 6),
    onNext(372, 8),
    onNext(373, 5),
    onNext(374, 6),
    onNext(391, 7),
    onNext(411, 13),
    onNext(431, 2),
    onNext(432, 7),
    onNext(433, 13),
    onNext(434, 2),
    onNext(451, 9),
    onNext(521, 11),
    onNext(561, 20),
    onNext(562, 9),
    onNext(563, 11),
    onNext(564, 20),
    onError(601, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});

test('Observable#replay count function zip dispose', function (t) {
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
    return xs.replay(function (_xs) {
      return _xs.take(6).repeat();
    }, 3, null, scheduler);
  }, { disposed: 470 });

  reactiveAssert(t, results.messages, [
    onNext(221, 3),
    onNext(281, 4),
    onNext(291, 1),
    onNext(341, 8),
    onNext(361, 5),
    onNext(371, 6),
    onNext(372, 8),
    onNext(373, 5),
    onNext(374, 6),
    onNext(391, 7),
    onNext(411, 13),
    onNext(431, 2),
    onNext(432, 7),
    onNext(433, 13),
    onNext(434, 2),
    onNext(451, 9)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 470)
  ]);

  t.end();
});

test('Observable#replay time basic', function (t) {
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
    ys = xs.replay(null, null, 150, scheduler);
  });

  scheduler.scheduleAbsolute(null, 450, function () {
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
    onNext(451, 8),
    onNext(452, 5),
    onNext(453, 6),
    onNext(454, 7),
    onNext(521, 11)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(300, 400),
    subscribe(500, 550),
    subscribe(650, 800)
  ]);

  t.end();
});

test('Observable#replay time error', function (t) {
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
    ys = xs.replay(null, null, 75, scheduler);
  });

  scheduler.scheduleAbsolute(null, 450, function () {
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
    onNext(451, 7),
    onNext(521, 11),
    onNext(561, 20),
    onError(601, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(300, 400),
    subscribe(500, 600)
  ]);

  t.end();
});

test('Observable#replay time complete', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));

  var results = scheduler.createObserver();

  var ys;
  var subscription;
  var connection;

  scheduler.scheduleAbsolute(null, created, function () {
    ys = xs.replay(null, null, 85, scheduler);
  });

  scheduler.scheduleAbsolute(null, 450, function () {
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
    onNext(451, 6),
    onNext(452, 7),
    onNext(521, 11),
    onNext(561, 20),
    onCompleted(601)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(300, 400),
    subscribe(500, 600)
  ]);

  t.end();
});

test('Observable#replay time dispose', function (t) {
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
      ys = xs.replay(null, null, 100, scheduler);
  });

  scheduler.scheduleAbsolute(null, 450, function () {
    subscription = ys.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, 475, function () {
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
    onNext(451, 5),
    onNext(452, 6),
    onNext(453, 7)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(300, 400),
    subscribe(500, 550),
    subscribe(650, 800)
  ]);

  t.end();
});

test('Observable#replay time multiple connections', function (t) {
  var xs = Observable.never();
  var ys = xs.replay(null, null, 100);

  var connection1 = ys.connect();
  var connection2 = ys.connect();
  t.ok(connection1 === connection2);

  connection1.dispose();
  connection2.dispose();

  var connection3 = ys.connect();
  t.ok(connection1 !== connection3);

  t.end();
});

test('Observable#replay time function zip complete', function (t) {
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
    return xs.replay(function (_xs) {
      return _xs.take(6).repeat();
    }, null, 50, scheduler);
  }, { disposed: 610 });

  reactiveAssert(t, results.messages, [
    onNext(221, 3),
    onNext(281, 4),
    onNext(291, 1),
    onNext(341, 8),
    onNext(361, 5),
    onNext(371, 6),
    onNext(372, 8),
    onNext(373, 5),
    onNext(374, 6),
    onNext(391, 7),
    onNext(411, 13),
    onNext(431, 2),
    onNext(432, 7),
    onNext(433, 13),
    onNext(434, 2),
    onNext(451, 9),
    onNext(521, 11),
    onNext(561, 20),
    onNext(562, 11),
    onNext(563, 20),
    onNext(602, 20),
    onNext(604, 20),
    onNext(606, 20),
    onNext(608, 20)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});

test('Observable#replay time function zip error', function (t) {
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
    return xs.replay(function (_xs) {
      return _xs.take(6).repeat();
    }, null, 50, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(221, 3),
    onNext(281, 4),
    onNext(291, 1),
    onNext(341, 8),
    onNext(361, 5),
    onNext(371, 6),
    onNext(372, 8),
    onNext(373, 5),
    onNext(374, 6),
    onNext(391, 7),
    onNext(411, 13),
    onNext(431, 2),
    onNext(432, 7),
    onNext(433, 13),
    onNext(434, 2),
    onNext(451, 9),
    onNext(521, 11),
    onNext(561, 20),
    onNext(562, 11),
    onNext(563, 20),
    onError(601, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});

test('Observable#replay time function zip dispose', function (t) {
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
    return xs.replay(function (_xs) {
      return _xs.take(6).repeat();
    }, null, 50, scheduler);
  }, { disposed: 470 });

  reactiveAssert(t, results.messages, [
    onNext(221, 3),
    onNext(281, 4),
    onNext(291, 1),
    onNext(341, 8),
    onNext(361, 5),
    onNext(371, 6),
    onNext(372, 8),
    onNext(373, 5),
    onNext(374, 6),
    onNext(391, 7),
    onNext(411, 13),
    onNext(431, 2),
    onNext(432, 7),
    onNext(433, 13),
    onNext(434, 2),
    onNext(451, 9)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 470)
  ]);

  t.end();
});
