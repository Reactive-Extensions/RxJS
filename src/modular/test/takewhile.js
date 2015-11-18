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
  takeWhile: require('../observable/takewhile')
});

function isPrime(i) {
  if (i <= 1) { return false; }
  var max = Math.floor(Math.sqrt(i));
  for (var j = 2; j <= max; ++j) {
    if (i % j === 0) { return false; }
  }

  return true;
}

test('Observable#takeWhile complete before', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(90, -1),
    onNext(110, -1),
    onNext(210, 2),
    onNext(260, 5),
    onNext(290, 13),
    onNext(320, 3),
    onCompleted(330),
    onNext(350, 7),
    onNext(390, 4),
    onNext(410, 17),
    onNext(450, 8),
    onNext(500, 23),
    onCompleted(600)
  );

  var invoked = 0;

  var results = scheduler.startScheduler(function () {
    return xs.takeWhile(function (x) {
      invoked++;
      return isPrime(x);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(260, 5),
    onNext(290, 13),
    onNext(320, 3),
    onCompleted(330)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 330)
  ]);

  t.equal(4, invoked);

  t.end();
});

test('Observable#takeWhile complete after', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(90, -1),
    onNext(110, -1),
    onNext(210, 2),
    onNext(260, 5),
    onNext(290, 13),
    onNext(320, 3),
    onNext(350, 7),
    onNext(390, 4),
    onNext(410, 17),
    onNext(450, 8),
    onNext(500, 23),
    onCompleted(600)
  );

  var invoked = 0;

  var results = scheduler.startScheduler(function () {
    return xs.takeWhile(function (x) {
      invoked++;
      return isPrime(x);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(260, 5),
    onNext(290, 13),
    onNext(320, 3),
    onNext(350, 7),
    onCompleted(390)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 390)
  ]);

  t.equal(6, invoked);

  t.end();
});

test('Observable#takeWhile error before', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(90, -1),
    onNext(110, -1),
    onNext(210, 2),
    onNext(260, 5),
    onError(270, error),
    onNext(290, 13),
    onNext(320, 3),
    onNext(350, 7),
    onNext(390, 4),
    onNext(410, 17),
    onNext(450, 8),
    onNext(500, 23)
  );

  var invoked = 0;

  var results = scheduler.startScheduler(function () {
    return xs.takeWhile(function (x) {
      invoked++;
      return isPrime(x);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(260, 5),
    onError(270, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 270)
  ]);

  t.equal(2, invoked);

  t.end();
});

test('Observable#takeWhile error after', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(90, -1),
    onNext(110, -1),
    onNext(210, 2),
    onNext(260, 5),
    onNext(290, 13),
    onNext(320, 3),
    onNext(350, 7),
    onNext(390, 4),
    onNext(410, 17),
    onNext(450, 8),
    onNext(500, 23),
    onError(600, new Error())
  );

  var invoked = 0;

  var results = scheduler.startScheduler(function () {
    return xs.takeWhile(function (x) {
      invoked++;
      return isPrime(x);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(260, 5),
    onNext(290, 13),
    onNext(320, 3),
    onNext(350, 7),
    onCompleted(390)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 390)
  ]);

  t.equal(6, invoked);

  t.end();
});

test('Observable#takeWhile dispose before', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(90, -1),
    onNext(110, -1),
    onNext(210, 2),
    onNext(260, 5),
    onNext(290, 13),
    onNext(320, 3),
    onNext(350, 7),
    onNext(390, 4),
    onNext(410, 17),
    onNext(450, 8),
    onNext(500, 23),
    onCompleted(600)
  );

  var invoked = 0;

  var results = scheduler.startScheduler(function () {
    return xs.takeWhile(function (x) {
      invoked++;
      return isPrime(x);
    });
  }, { disposed: 300 });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(260, 5),
    onNext(290, 13)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 300)
  ]);

  t.equal(3, invoked);

  t.end();
});

test('Observable#takeWhile dispose after', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(90, -1),
    onNext(110, -1),
    onNext(210, 2),
    onNext(260, 5),
    onNext(290, 13),
    onNext(320, 3),
    onNext(350, 7),
    onNext(390, 4),
    onNext(410, 17),
    onNext(450, 8),
    onNext(500, 23),
    onCompleted(600)
  );

  var invoked = 0;

  var results = scheduler.startScheduler(function () {
    return xs.takeWhile(function (x) {
      invoked++;
      return isPrime(x);
    });
  }, { disposed: 400 });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(260, 5),
    onNext(290, 13),
    onNext(320, 3),
    onNext(350, 7),
    onCompleted(390)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 390)
  ]);

  t.equal(6, invoked);

  t.end();
});

test('Observable#takeWhile zero', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(90, -1),
    onNext(110, -1),
    onNext(205, 100),
    onNext(210, 2),
    onNext(260, 5),
    onNext(290, 13),
    onNext(320, 3),
    onNext(350, 7),
    onNext(390, 4),
    onNext(410, 17),
    onNext(450, 8),
    onNext(500, 23),
    onCompleted(600)
  );

  var invoked = 0;

  var results = scheduler.startScheduler(function () {
    return xs.takeWhile(function (x) {
      invoked++;
      return isPrime(x);
    });
  }, { disposed: 300 });

  reactiveAssert(t, results.messages, [
    onCompleted(205)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 205)
  ]);

  t.equal(1, invoked);

  t.end();
});

test('Observable#takeWhile throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(90, -1),
    onNext(110, -1),
    onNext(210, 2),
    onNext(260, 5),
    onNext(290, 13),
    onNext(320, 3),
    onNext(350, 7),
    onNext(390, 4),
    onNext(410, 17),
    onNext(450, 8),
    onNext(500, 23),
    onCompleted(600)
  );

  var invoked = 0;

  var results = scheduler.startScheduler(function () {
    return xs.takeWhile(function (x) {
      invoked++;
      if (invoked === 3) { throw error; }
      return isPrime(x);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(260, 5),
    onError(290, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 290)
  ]);

  t.equal(3, invoked);

  t.end();
});

test('Observable#takeWhile index', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(90, -1),
    onNext(110, -1),
    onNext(205, 100),
    onNext(210, 2),
    onNext(260, 5),
    onNext(290, 13),
    onNext(320, 3),
    onNext(350, 7),
    onNext(390, 4),
    onNext(410, 17),
    onNext(450, 8),
    onNext(500, 23),
    onCompleted(600)
  );

  var results = scheduler.startScheduler(function () {
    return xs.takeWhile(function (x, i) {
      return i < 5;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(205, 100),
    onNext(210, 2),
    onNext(260, 5),
    onNext(290, 13),
    onNext(320, 3),
    onCompleted(350)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 350)
  ]);

  t.end();
});
