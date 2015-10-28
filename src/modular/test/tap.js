'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var Observable = require('../observable');
var create = require('../observer/create');
var noop = require('../helpers/noop');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
    onError = ReactiveTest.onError,
    onCompleted = ReactiveTest.onCompleted;

Observable.addToPrototype({
  tap: require('../observable/tap')
});

test('Observable#tap should see all values', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var i = 0;
  var sum = 2 + 3 + 4 + 5;

  scheduler.startScheduler(function () {
    return xs.tap(function (x) { i++; return sum -= x; });
  });

  t.equal(4, i);
  t.equal(0, sum);

  t.end();
});

test('Observable#tap plain action', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var i = 0;

  scheduler.startScheduler(function () {
    return xs.tap(function () { return i++; });
  });

  t.equal(4, i);

  t.end();
});

test('Observable#tap next completed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var i = 0;
  var sum = 2 + 3 + 4 + 5;
  var completed = false;

  scheduler.startScheduler(function () {
    return xs.tap(function (x) { i++; sum -= x; }, null, function () { completed = true; });
  });

  t.equal(4, i);
  t.equal(0, sum);
  t.ok(completed);

  t.end();
});

test('Observable#tap next completed never', function (t) {
  var scheduler = new TestScheduler();

  var i = 0;
  var completed = false;

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  scheduler.startScheduler(function () {
    return xs.tap(function () { i++; }, null, function () { completed = true; });
  });

  t.equal(0, i);
  t.ok(!completed);

  t.end();
});

test('Observable#tap next error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onError(250, error)
  );

  var i = 0;
  var sum = 2 + 3 + 4 + 5;
  var sawError = false;

  scheduler.startScheduler(function () {
    return xs.tap(function (x) { i++; sum -= x; }, function (e) { sawError = e === error; });
  });

  t.equal(4, i);
  t.equal(0, sum);
  t.ok(sawError);

  t.end();
});

test('Observable#tap next error not', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var i = 0;
  var sum = 2 + 3 + 4 + 5;
  var sawError = false;

  scheduler.startScheduler(function () {
    return xs.tap(function (x) { i++; sum -= x; }, function () { sawError = true; });
  });

  t.equal(4, i);
  t.equal(0, sum);
  t.ok(!sawError);

  t.end();
});

test('Observable#tap next error completed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var i = 0;
  var sum = 2 + 3 + 4 + 5;
  var sawError = false;
  var hasCompleted = false;

  scheduler.startScheduler(function () {
    return xs.tap(function (x) { i++; sum -= x; }, function () { sawError = true; }, function () { hasCompleted = true; });
  });

  t.equal(4, i);
  t.equal(0, sum);
  t.ok(!sawError);
  t.ok(hasCompleted);

  t.end();
});

test('Observable#tap next completed error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onError(250, error)
  );

  var i = 0;
  var sum = 2 + 3 + 4 + 5;
  var sawError = false;
  var hasCompleted = false;

  scheduler.startScheduler(function () {
    return xs.tap(function (x) { i++; sum -= x; }, function () { sawError = true; }, function () { hasCompleted = true; });
  });

  t.equal(4, i);
  t.equal(0, sum);
  t.ok(sawError);
  t.ok(!hasCompleted);

  t.end();
});

test('Observable#tap next error completed never', function (t) {
  var scheduler = new TestScheduler();

  var i = 0;
  var sawError = false;
  var hasCompleted = false;

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  scheduler.startScheduler(function () {
    return xs.tap(function () { i++; }, function () { sawError = true; }, function () { hasCompleted = true; });
  });

  t.equal(0, i);
  t.ok(!sawError);
  t.ok(!hasCompleted);

  t.end();
});

test('Observable#tap observer some data with error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onError(250, error)
  );

  var i = 0;
  var sum = 2 + 3 + 4 + 5;
  var sawError = false;
  var hasCompleted = false;

  scheduler.startScheduler(function () {
    return xs.tap(create(function (x) { i++; sum -= x; }, function (e) { sawError = e === error; }, function () { hasCompleted = true; }));
  });

  t.equal(4, i);
  t.equal(0, sum);
  t.ok(sawError);
  t.ok(!hasCompleted);

  t.end();
});

test('Observable#tap next throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.tap(function () { throw error; });
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#tap next completed next throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.tap(function () { throw error; }, null, noop);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#tap next competed completed throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
      return xs.tap(noop, null, function () { throw error; });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onError(250, error)
  ]);

  t.end();
});

test('Observable#tap next error next throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.tap(function () { throw error; }, noop);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#tap next error error throws', function (t) {
  var error1 = new Error();
  var error2 = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.tap(noop, function () { throw error2; });
  });

  reactiveAssert(t, results.messages, [
    onError(210, error2)
  ]);

  t.end();
});

test('Observable#tap next error completed next throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.tap(function () { throw error; }, noop, noop);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#tap next error completed error throws', function (t) {
  var error1 = new Error();
  var error2 = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.tap(noop, function () { throw error2; }, noop);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error2)
  ]);

  t.end();
});

test('Observable#tap next error completed completed throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.tap(noop, noop, function () { throw error; });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onError(250, error)
  ]);

  t.end();
});

test('Observable#tap observer next throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.tap(create(function () { throw error;  }, noop, noop));
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#tap observer error throws', function (t) {
  var error1 = new Error();
  var error2 = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.tap(create(noop, function () { throw error2; }, noop));
  });

  reactiveAssert(t, results.messages, [
    onError(210, error2)
  ]);

  t.end();
});

test('Observable#tap observer completed throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.tap(create(noop, noop, function () { throw error; }));
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onError(250, error)
  ]);

  t.end();
});
