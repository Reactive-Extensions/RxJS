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
  bindCallback: require('../observable/bindcallback')
});

test('Observable.bindCallback', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.bindCallback(function (cb) { cb(true); })();
  });

  reactiveAssert(t, results.messages, [
    onNext(200, true),
    onCompleted(200)
  ]);

  t.end();
});

test('Observable.bindCallback throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.bindCallback(function () { throw error; })();
  });

  reactiveAssert(t, results.messages, [
    onError(200, error)
  ]);

  t.end();
});

test('Observable.bindCallback single argument', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.bindCallback(function (file, cb) { cb(file); })('file.txt');
  });

  reactiveAssert(t, results.messages, [
    onNext(200, 'file.txt'),
    onCompleted(200)
  ]);

  t.end();
});

test('Observable.bindCallback selector', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.bindCallback(
      function (f, s, t, cb) { cb(1,2,3); },
      null,
      function (f) { return f; })(1,2,3);
  });

  reactiveAssert(t, results.messages, [
    onNext(200, 1),
    onCompleted(200)
  ]);

  t.end();
});

test('Observable.bindCallback selector throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.bindCallback(
      function (f, s, t, cb) { cb(1,2,3); },
      null,
      function () { throw error; })(1,2,3);
  });

  reactiveAssert(t, results.messages, [
    onError(200, error)
  ]);

  t.end();
});

test('Observable.bindCallback ctx', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.bindCallback(
      function (cb) { t.equal(this, 42); cb(null); },
      42)();
  });

  reactiveAssert(t, results.messages, [
    onNext(200, null),
    onCompleted(200)
  ]);

  t.end();
});

test('Observable.bindCallback resubscribe', function (t) {
  var count = 0;

  var res = Observable.bindCallback( function(cb) { cb(++count); })();

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
