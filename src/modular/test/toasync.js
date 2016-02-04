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
  toAsync: require('../observable/toasync')
});

test('Observable.toAsync context', function (t) {
  var context = { value: 42 };

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.toAsync(function (x) {
      return this.value + x;
    }, context, scheduler)(42);
  });

  reactiveAssert(t, results.messages, [
    onNext(200, 84),
    onCompleted(200)
  ]);

  t.end();
});

test('Observable.toAsync 0', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.toAsync(function () {
      return 0;
    }, null, scheduler)();
  });

  reactiveAssert(t, results.messages, [
    onNext(200, 0),
    onCompleted(200)
  ]);

  t.end();
});

test('Observable.toAsync 1', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.toAsync(function (x) {
      return x;
    }, null, scheduler)(1);
  });

  reactiveAssert(t, results.messages, [
    onNext(200, 1),
    onCompleted(200)
  ]);

  t.end();
});

test('Observable.toAsync 2', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.toAsync(function (x, y) {
        return x + y;
    }, null, scheduler)(1, 2);
  });

  reactiveAssert(t, results.messages, [
    onNext(200, 3),
    onCompleted(200)
  ]);

  t.end();
});

test('Observable.toAsync 3', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.toAsync(function (x, y, z) {
      return x + y + z;
    }, null, scheduler)(1, 2, 3);
  });

  reactiveAssert(t, results.messages, [
    onNext(200, 6),
    onCompleted(200)
  ]);

  t.end();
});

test('Observable.toAsync 4', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.toAsync(function (a, b, c, d) {
      return a + b + c + d;
    }, null, scheduler)(1, 2, 3, 4);
  });

  reactiveAssert(t, results.messages, [
    onNext(200, 10),
    onCompleted(200)
  ]);

  t.end();
});

test('Observable.toAsync error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.toAsync(function () {
      throw error;
    }, null, scheduler)();
  });

  reactiveAssert(t, results.messages, [
    onError(200, error)
  ]);

  t.end();
});
