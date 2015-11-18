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
  skipWhile: require('../observable/skipwhile')
});

function isPrime(i) {
  if (i <= 1) { return false; }
  var max = Math.floor(Math.sqrt(i));
  for (var j = 2; j <= max; ++j) {
    if (i % j === 0) { return false; }
  }
  return true;
}

test('Observable#skipWhile complete before', function (t) {
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
    return xs.skipWhile(function (x) {
      invoked++;
      return isPrime(x);
    });
  });

  reactiveAssert(t, results.messages, [
    onCompleted(330)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 330)
  ]);

  t.equal(4, invoked);

  t.end();
});

test('Observable#skipWhile complete after', function (t) {
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
    return xs.skipWhile(function (x) {
        invoked++;
        return isPrime(x);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(390, 4),
    onNext(410, 17),
    onNext(450, 8),
    onNext(500, 23),
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.equal(6, invoked);

  t.end();
});

test('Observable#skipWhile error before', function (t) {
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
    onNext(500, 23),
    onCompleted(600)
  );

  var invoked = 0;

  var results = scheduler.startScheduler(function () {
    return xs.skipWhile(function (x) {
      invoked++;
      return isPrime(x);
    });
  });

  reactiveAssert(t, results.messages, [
    onError(270, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 270)
  ]);

  t.equal(2, invoked);

  t.end();
});

test('Observable#skipWhile error after', function (t) {
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
    onError(600, error)
  );

  var invoked = 0;

  var results = scheduler.startScheduler(function () {
    return xs.skipWhile(function (x) {
      invoked++;
      return isPrime(x);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(390, 4),
    onNext(410, 17),
    onNext(450, 8),
    onNext(500, 23),
    onError(600, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.equal(6, invoked);

  t.end();
});

test('Observable#skipWhile dispose before', function (t) {
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
    return xs.skipWhile(function (x) {
      invoked++;
      return isPrime(x);
    });
  }, { disposed: 300 });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 300)
  ]);

  t.equal(3, invoked);

  t.end();
});

test('Observable#skipWhile dispose after', function (t) {
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
    return xs.skipWhile(function (x) {
      invoked++;
      return isPrime(x);
    });
  }, { disposed: 470 });

  reactiveAssert(t, results.messages, [
    onNext(390, 4),
    onNext(410, 17),
    onNext(450, 8)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 470)
  ]);

  t.equal(6, invoked);

  t.end();
});

test('Observable#skipWhile zero', function (t) {
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
    return xs.skipWhile(function (x) {
      invoked++;
      return isPrime(x);
    });
  });

  reactiveAssert(t, results.messages, [
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
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.equal(1, invoked);

  t.end();
});

test('Observable#skipWhile throw', function (t) {
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

  var error = new Error();

  var invoked = 0;

  var results = scheduler.startScheduler(function () {
    return xs.skipWhile(function (x) {
      invoked++;
      if (invoked === 3) { throw error; }
      return isPrime(x);
    });
  });

  reactiveAssert(t, results.messages, [
    onError(290, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 290)
  ]);

  t.equal(3, invoked);

  t.end();
});

test('Observable#skipWhile index', function (t) {
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

  var results = scheduler.startScheduler(function () {
    return xs.skipWhile(function (x, i) {
      return i < 5;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(390, 4),
    onNext(410, 17),
    onNext(450, 8),
    onNext(500, 23),
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});
