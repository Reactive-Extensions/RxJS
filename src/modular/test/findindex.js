'use strict';

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted;

Observable.addToPrototype({
  findIndex: require('../observable/findindex')
});

test('findIndex never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.findIndex(function () { return true; });
  });

  reactiveAssert(t, results.messages, [
  ]);

  t.end();
});

test('findIndex empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(210)
  );

  var results = scheduler.startScheduler(function () {
    return xs.findIndex(function () { return true; });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, -1),
    onCompleted(210)
  ]);

  t.end();
});

test('findIndex single', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(220)
  );

  var results = scheduler.startScheduler(function () {
    return xs.findIndex(function (x) { return x === 2; });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 0),
    onCompleted(210)
  ]);

  t.end();
});

test('Observable#findIndex not found', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(220)
  );

  var results = scheduler.startScheduler(function () {
    return xs.findIndex(function (x) { return x === 3; });
  });

  reactiveAssert(t, results.messages, [
    onNext(220, -1),
    onCompleted(220)
  ]);

  t.end();
});

test('Observable#findIndex error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(220, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.findIndex(function (x) { return x === 3; });
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('Observable#findIndex throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(220)
  );

  var results = scheduler.startScheduler(function () {
    return xs.findIndex(function () { throw error; });
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});
