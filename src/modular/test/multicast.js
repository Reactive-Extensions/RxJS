'use strict';

var test = require('tape');
var Observable = require('../observable');
var Subject = require('../subject');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe;

Observable.addToObject({
  create: require('../observable/create')
});

Observable.addToPrototype({
  multicast: require('../observable/multicast'),
  zip: require('../observable/zip')
});

test('Observable#multicast hot 1', function (t) {
  var scheduler = new TestScheduler();

  var s = new Subject();

  var xs = scheduler.createHotObservable(
    onNext(40, 0),
    onNext(90, 1),
    onNext(150, 2),
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5),
    onNext(330, 6),
    onNext(340, 7),
    onCompleted(390)
  );

  var c;
  var o = scheduler.createObserver();
  var d1;
  var d2;

  scheduler.scheduleAbsolute(null, 50, function () {
    c = xs.multicast(s);
  });

  scheduler.scheduleAbsolute(null, 100, function () {
    d1 = c.subscribe(o);
  });

  scheduler.scheduleAbsolute(null, 200, function () {
    d2 = c.connect();
  });

  scheduler.scheduleAbsolute(null, 300, function () {
    d1.dispose();
  });

  scheduler.start();

  reactiveAssert(t, o.messages, [
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 390)
  ]);

  t.end();
});

test('Observable#multicast hot 2', function (t) {
  var scheduler = new TestScheduler();

  var s = new Subject();

  var xs = scheduler.createHotObservable(
    onNext(40, 0),
    onNext(90, 1),
    onNext(150, 2),
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5),
    onNext(330, 6),
    onNext(340, 7),
    onCompleted(390)
  );

  var c;
  var o = scheduler.createObserver();
  var d1;
  var d2;

  scheduler.scheduleAbsolute(null, 50, function () {
    c = xs.multicast(s);
  });

  scheduler.scheduleAbsolute(null, 100, function () {
    d2 = c.connect();
  });

  scheduler.scheduleAbsolute(null, 200, function () {
    d1 = c.subscribe(o);
  });

  scheduler.scheduleAbsolute(null, 300, function () {
    d1.dispose();
  });

  scheduler.start();

  reactiveAssert(t, o.messages, [
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(100, 390)
  ]);

  t.end();
});

test('Observable#multicast hot 2', function (t) {
  var scheduler = new TestScheduler();

  var s = new Subject();

  var xs = scheduler.createHotObservable(
    onNext(40, 0),
    onNext(90, 1),
    onNext(150, 2),
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5),
    onNext(330, 6),
    onNext(340, 7),
    onCompleted(390));

  var c;
  var o = scheduler.createObserver();
  var d1;
  var d2;

  scheduler.scheduleAbsolute(null, 50, function () {
    c = xs.multicast(s);
  });

  scheduler.scheduleAbsolute(null, 100, function () {
    d2 = c.connect();
  });

  scheduler.scheduleAbsolute(null, 200, function () {
    d1 = c.subscribe(o);
  });

  scheduler.scheduleAbsolute(null, 300, function () {
    d1.dispose();
  });

  scheduler.start();

  reactiveAssert(t, o.messages, [
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(100, 390)
  ]);

  t.end();
});

test('Observable#multicast hot 3', function (t) {
  var scheduler = new TestScheduler();

  var s = new Subject();

  var xs = scheduler.createHotObservable(
    onNext(40, 0),
    onNext(90, 1),
    onNext(150, 2),
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5),
    onNext(330, 6),
    onNext(340, 7),
    onCompleted(390)
  );

  var c;
  var o = scheduler.createObserver();
  var d1;
  var d2;

  scheduler.scheduleAbsolute(null, 50, function () {
    c = xs.multicast(s);
  });

  scheduler.scheduleAbsolute(null, 100, function () {
    d2 = c.connect();
  });

  scheduler.scheduleAbsolute(null, 200, function () {
    d1 = c.subscribe(o);
  });

  scheduler.scheduleAbsolute(null, 300, function () {
    d2.dispose();
  });

  scheduler.scheduleAbsolute(null, 335, function () {
    d2 = c.connect();
  });

  scheduler.start();

  reactiveAssert(t, o.messages, [
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5),
    onNext(340, 7),
    onCompleted(390)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(100, 300),
    subscribe(335, 390)
  ]);

  t.end();
});

test('Observable#multicast hot 4', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var s = new Subject();

  var xs = scheduler.createHotObservable(
    onNext(40, 0),
    onNext(90, 1),
    onNext(150, 2),
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5),
    onNext(330, 6),
    onNext(340, 7),
    onError(390, error)
  );

  var c;
  var o = scheduler.createObserver();
  var d1;
  var d2;

  scheduler.scheduleAbsolute(null, 50, function () {
    c = xs.multicast(s);
  });

  scheduler.scheduleAbsolute(null, 100, function () {
    d2 = c.connect();
  });

  scheduler.scheduleAbsolute(null, 200, function () {
    d1 = c.subscribe(o);
  });

  scheduler.scheduleAbsolute(null, 300, function () {
    d2.dispose();
  });

  scheduler.scheduleAbsolute(null, 335, function () {
    d2 = c.connect();
  });

  scheduler.start();

  reactiveAssert(t, o.messages, [
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5),
    onNext(340, 7),
    onError(390, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(100, 300),
    subscribe(335, 390)
  ]);

  t.end();
});

test('Observable#multicast hot 5', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var s = new Subject();

  var xs = scheduler.createHotObservable(
    onNext(40, 0),
    onNext(90, 1),
    onNext(150, 2),
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5),
    onNext(330, 6),
    onNext(340, 7),
    onError(390, error));

  var c;
  var o = scheduler.createObserver();
  var d1;
  var d2;

  scheduler.scheduleAbsolute(null, 50, function () {
    c = xs.multicast(s);
  });

  scheduler.scheduleAbsolute(null, 100, function () {
    d2 = c.connect();
  });

  scheduler.scheduleAbsolute(null, 400, function () {
    d1 = c.subscribe(o);
  });

  scheduler.start();

  reactiveAssert(t, o.messages, [
    onError(400, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(100, 390)
  ]);

  t.end();
});

test('Observable#multicast hot 6', function (t) {
  var scheduler = new TestScheduler();

  var s = new Subject();

  var xs = scheduler.createHotObservable(
    onNext(40, 0),
    onNext(90, 1),
    onNext(150, 2),
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5),
    onNext(330, 6),
    onNext(340, 7),
    onCompleted(390)
  );

  var c;
  var o = scheduler.createObserver();
  var d1;
  var d2;

  scheduler.scheduleAbsolute(null, 50, function () {
    c = xs.multicast(s);
  });

  scheduler.scheduleAbsolute(null, 100, function () {
    d2 = c.connect();
  });

  scheduler.scheduleAbsolute(null, 400, function () {
    d1 = c.subscribe(o);
  });

  scheduler.start();

  reactiveAssert(t, o.messages, [
    onCompleted(400)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(100, 390)
  ]);

  t.end();
});

test('Observable#multicast cold completed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(40, 0),
    onNext(90, 1),
    onNext(150, 2),
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5),
    onNext(330, 6),
    onNext(340, 7),
    onCompleted(390)
  );

  var results = scheduler.startScheduler(function () {
    return xs.multicast(function () { return new Subject(); }, function (ys) { return ys; });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5),
    onNext(330, 6),
    onNext(340, 7),
    onCompleted(390)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 390)
  ]);

  t.end();
});

test('Observable#multicast cold Error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(40, 0),
    onNext(90, 1),
    onNext(150, 2),
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5),
    onNext(330, 6),
    onNext(340, 7),
    onError(390, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.multicast(
      function () { return new Subject(); },
      function (ys) { return ys; });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5),
    onNext(330, 6),
    onNext(340, 7),
    onError(390, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 390)
  ]);

  t.end();
});

test('Observable#multicast cold dispose', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(40, 0),
    onNext(90, 1),
    onNext(150, 2),
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5),
    onNext(330, 6),
    onNext(340, 7));

  var results = scheduler.startScheduler(function () {
    return xs.multicast(function () { return new Subject(); }, function (ys) { return ys; });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5),
    onNext(330, 6),
    onNext(340, 7)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable#multicast cold zip', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(40, 0),
    onNext(90, 1),
    onNext(150, 2),
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5),
    onNext(330, 6),
    onNext(340, 7),
    onCompleted(390)
  );

  var results = scheduler.startScheduler(function () {
    return xs.multicast(function () {
      return new Subject();
    }, function (ys) {
      return ys.zip(ys, function (a, b) { return a + b; });
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 6),
    onNext(240, 8),
    onNext(270, 10),
    onNext(330, 12),
    onNext(340, 14),
    onCompleted(390)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 390)
  ]);

  t.end();
});

// adapted from issue Reactive-Extensions/RxJS#1112
test('multicast should not reconnect when stopped', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.createObserver();

  var calls = 0;

  function request(v) {
    calls++;
    return v * 2;
  }

  var xs = scheduler.createColdObservable(
    onNext(1, 1),
    onNext(2, 2),
    onNext(3, 3),
    onCompleted(4));

  var c, s;

  scheduler.scheduleAbsolute(null, 300, function () {
    c = Observable.create(function (o) {
      return xs.subscribe(
        function (x) { o.onNext(request(x)); },
        function (e) { o.onError(e); },
        function () { o.onCompleted(); });
    }).multicast(new Subject());
    c.subscribe(results);
    s = c.connect();
  });

  scheduler.scheduleAbsolute(null, 400, function () {
    s.dispose();
    c.connect();
  });

  scheduler.start();

  t.equal(calls, 3);

  reactiveAssert(t, results.messages, [
    onNext(301, 2),
    onNext(302, 4),
    onNext(303, 6),
    onCompleted(304)
  ]);

  t.end();
});
