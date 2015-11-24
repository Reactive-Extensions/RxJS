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
  find: require('../observable/find')
});

test('Observable#find never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.find(function () { return true; });
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#find empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(210)
  );

  var results = scheduler.startScheduler(function () {
    return xs.find(function () { return true; });
  });

  reactiveAssert(t, results.messages, [
    onCompleted(210)
  ]);

  t.end();
});

test('Observable#find single', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(220)
  );

  var results = scheduler.startScheduler(function () {
    return xs.find(function (x) { return x === 2; });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onCompleted(210)
  ]);

  t.end();
});

test('Observable#find not found', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(220)
  );

  var results = scheduler.startScheduler(function () {
    return xs.find(function (x) { return x === 3; });
  });

  reactiveAssert(t, results.messages, [
    onCompleted(220)
  ]);

  t.end();
});

test('Observable#find error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(220, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.find(function (x) { return x === 3; });
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('Observable#find throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(220)
  );

  var results = scheduler.startScheduler(function () {
    return xs.find(function () { throw error; });
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});
