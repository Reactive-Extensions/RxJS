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
  delay: require('../observable/delay')
});

test('Observable#delay relative time simple 1', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(250, 2),
    onNext(350, 3),
    onNext(450, 4),
    onCompleted(550));

  var results = scheduler.startScheduler(function () {
    return xs.delay(100, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(350, 2),
    onNext(450, 3),
    onNext(550, 4),
    onCompleted(650)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 550)
  ]);

  t.end();
});

test('Observable#delay absolute time simple 1 implementation', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(250, 2),
    onNext(350, 3),
    onNext(450, 4),
    onCompleted(550));

  var results = scheduler.startScheduler(function () {
    return xs.delay(new Date(300), scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(350, 2),
    onNext(450, 3),
    onNext(550, 4),
    onCompleted(650)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 550)
  ]);

  t.end();
});

test('Observable#delay relative time simple 2 implementation', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(250, 2),
    onNext(350, 3),
    onNext(450, 4),
    onCompleted(550));

  var results = scheduler.startScheduler(function () {
    return xs.delay(50, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(300, 2),
    onNext(400, 3),
    onNext(500, 4),
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 550)
  ]);

  t.end();
});

test('Observable#delay absolute time simple 2 implementation', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(250, 2),
    onNext(350, 3),
    onNext(450, 4),
    onCompleted(550));

  var results = scheduler.startScheduler(function () {
    return xs.delay(new Date(250), scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(300, 2),
    onNext(400, 3),
    onNext(500, 4),
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 550)
  ]);

  t.end();
});

test('Observable#delay relative time simple 3 implementation', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(250, 2),
    onNext(350, 3),
    onNext(450, 4),
    onCompleted(550));

  var results = scheduler.startScheduler(function () {
    return xs.delay(150, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(400, 2),
    onNext(500, 3),
    onNext(600, 4),
    onCompleted(700)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 550)
  ]);

  t.end();
});

test('Observable#delay absolute time simple 3 implementation', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(250, 2),
    onNext(350, 3),
    onNext(450, 4),
    onCompleted(550));

  var results = scheduler.startScheduler(function () {
    return xs.delay(new Date(350), scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(400, 2),
    onNext(500, 3),
    onNext(600, 4),
    onCompleted(700)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 550)
  ]);

  t.end();
});

test('Observable#delay relative time error 1 implementation', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(250, 2),
    onNext(350, 3),
    onNext(450, 4),
    onError(550, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.delay(50, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(300, 2),
    onNext(400, 3),
    onNext(500, 4),
    onError(550, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 550)
  ]);

  t.end();
});

test('Observable#delay absolute time error 1 implementation', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(250, 2),
    onNext(350, 3),
    onNext(450, 4),
    onError(550, error));

  var results = scheduler.startScheduler(function () {
    return xs.delay(new Date(250), scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(300, 2),
    onNext(400, 3),
    onNext(500, 4),
    onError(550, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 550)
  ]);

  t.end();
});

test('Observable#delay relative time error 2 implementation', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(250, 2),
    onNext(350, 3),
    onNext(450, 4),
    onError(550, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.delay(150, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(400, 2),
    onNext(500, 3),
    onError(550, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 550)
  ]);

  t.end();
});

test('Observable#delay absolute time error 2 implementation', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(250, 2),
    onNext(350, 3),
    onNext(450, 4),
    onError(550, error));

  var results = scheduler.startScheduler(function () {
    return xs.delay(new Date(350), scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(400, 2),
    onNext(500, 3),
    onError(550, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 550)
  ]);

  t.end();
});

test('Observable#delay empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(550));

  var results = scheduler.startScheduler(function () {
    return xs.delay(10, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(560)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 550)
  ]);

  t.end();
});

test('Observable#delay error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(550, error));

  var results = scheduler.startScheduler(function () {
    return xs.delay(10, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(550, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 550)
  ]);

  t.end();
});

test('Observable#delay never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1));

  var results = scheduler.startScheduler(function () {
    return xs.delay(10, scheduler);
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

// delay with selector
test('Observable#delay duration simple 1', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 10),
    onNext(220, 30),
    onNext(230, 50),
    onNext(240, 35),
    onNext(250, 20),
    onCompleted(260));

  var results = scheduler.startScheduler(function () {
    return xs.delay(function (x) {
      return scheduler.createColdObservable(onNext(x, '!'));
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210 + 10, 10),
    onNext(220 + 30, 30),
    onNext(250 + 20, 20),
    onNext(240 + 35, 35),
    onNext(230 + 50, 50),
    onCompleted(280)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 260)
  ]);

  t.end();
});

test('Observable#delay duration simple 2', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onNext(250, 6),
    onCompleted(300)
  );

  var ys = scheduler.createColdObservable(
    onNext(10, '!')
  );

  var results = scheduler.startScheduler(function () {
    return xs.delay(function () { return ys; });
  });

  reactiveAssert(t, results.messages, [
    onNext(210 + 10, 2),
    onNext(220 + 10, 3),
    onNext(230 + 10, 4),
    onNext(240 + 10, 5),
    onNext(250 + 10, 6),
    onCompleted(300)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 300)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(210, 220),
    subscribe(220, 230),
    subscribe(230, 240),
    subscribe(240, 250),
    subscribe(250, 260)
  ]);

  t.end();
});

test('Observable#delay duration simple 3', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onNext(250, 6),
    onCompleted(300)
  );

  var ys = scheduler.createColdObservable(
    onNext(100, '!')
  );

  var results = scheduler.startScheduler(function () {
    return xs.delay(function () { return ys; });
  });

  reactiveAssert(t, results.messages, [
    onNext(210 + 100, 2),
    onNext(220 + 100, 3),
    onNext(230 + 100, 4),
    onNext(240 + 100, 5),
    onNext(250 + 100, 6),
    onCompleted(350)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 300)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(210, 310),
    subscribe(220, 320),
    subscribe(230, 330),
    subscribe(240, 340),
    subscribe(250, 350)
  ]);

  t.end();
});

test('Observable#delay duration simple 4 inner empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onNext(250, 6),
    onCompleted(300)
  );

  var ys = scheduler.createColdObservable(
    onCompleted(100)
  );

  var results = scheduler.startScheduler(function () {
    return xs.delay(function () { return ys; });
  });

  reactiveAssert(t, results.messages, [
    onNext(210 + 100, 2),
    onNext(220 + 100, 3),
    onNext(230 + 100, 4),
    onNext(240 + 100, 5),
    onNext(250 + 100, 6),
    onCompleted(350)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 300)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(210, 310),
    subscribe(220, 320),
    subscribe(230, 330),
    subscribe(240, 340),
    subscribe(250, 350)
  ]);

  t.end();
});

test('Observable#delay duration dispose 1', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onNext(250, 6),
    onCompleted(300)
  );

  var ys = scheduler.createColdObservable(
    onNext(200, '!')
  );

  var results = scheduler.startScheduler(function () {
    return xs.delay(function () { return ys; });
  }, { disposed: 425 });

  reactiveAssert(t, results.messages, [
    onNext(210 + 200, 2),
    onNext(220 + 200, 3)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 300)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(210, 410),
    subscribe(220, 420),
    subscribe(230, 425),
    subscribe(240, 425),
    subscribe(250, 425)
  ]);

  t.end();
});

test('Observable#delay duration dispose 2', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(400, 3),
    onCompleted(500));

  var ys = scheduler.createColdObservable(
    onNext(50, '!'));

  var results = scheduler.startScheduler(function () {
      return xs.delay(function () { return ys; });
  }, { disposed: 300 });

  reactiveAssert(t, results.messages, [
    onNext(210 + 50, 2)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 300)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(210, 260)
  ]);

  t.end();
});
