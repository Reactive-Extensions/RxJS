'use strict';

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted;

Observable.addToObject({
  bindNodeCallback: require('../observable/bindnodecallback')
});

test('Observable.bindNodeCallback', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.bindNodeCallback(function (cb) { cb(null); })();
  });

  reactiveAssert(t, results.messages, [
    onNext(200, undefined),
    onCompleted(200)
  ]);

  t.end();
});

test('Observable.bindNodeCallback throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.bindNodeCallback(function () { throw error; })();
  });

  reactiveAssert(t, results.messages, [
    onError(200, error)
  ]);

  t.end();
});

test('Observable.bindNodeCallback single', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.bindNodeCallback(function (file, cb) { cb(null, file); })('foo');
  });

  reactiveAssert(t, results.messages, [
    onNext(200, 'foo'),
    onCompleted(200)
  ]);

  t.end();
});

test('Observable.bindNodeCallback selector', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.bindNodeCallback(
      function (f, s, t, cb) { cb(null, f, s, t); },
      null,
      function (f) { return f; })(1,2,3);
  });

  reactiveAssert(t, results.messages, [
    onNext(200, 1),
    onCompleted(200)
  ]);

  t.end();
});

test('Observable.bindNodeCallback selector throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.bindNodeCallback(
      function (f, s, t, cb) { cb(null, f, s, t); },
      null,
      function () { throw error; })(1,2,3);
  });

  reactiveAssert(t, results.messages, [
    onError(200, error)
  ]);

  t.end();
});

test('Observable.bindNodeCallback selector', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.bindNodeCallback(
      function (f, s, t, cb) { cb(null, f, s, t); },
      null,
      function (f) { return f; })(1,2,3);
  });

  reactiveAssert(t, results.messages, [
    onNext(200, 1),
    onCompleted(200)
  ]);

  t.end();
});

test('Observable.bindNodeCallback ctx', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.bindNodeCallback(
      function (cb) { t.equal(this, 42); cb(null); },
      42)();
  });

  reactiveAssert(t, results.messages, [
    onNext(200, undefined),
    onCompleted(200)
  ]);

  t.end();
});

test('Observable.bindNodeCallback Error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.bindNodeCallback(function (cb) { cb(error); })();
  });

  reactiveAssert(t, results.messages, [
    onError(200, error)
  ]);

  t.end();
});

test('Observable.bindNodeCallback resubscribe', function (t) {
  var count = 0;

  var res = Observable.bindNodeCallback( function(cb) { cb(null, ++count); })();

  res.subscribe(function (x) {
    t.equal(x, 1);
  }, function () {
    t.fail();
  }, function () {
    t.ok(true);
  });

  res.subscribe(function (x) {
    t.equal(x, 1);
  }, function () {
    t.fail();
  }, function () {
    t.ok(true);
  });

  t.equal(1, count);
  t.end();
});
