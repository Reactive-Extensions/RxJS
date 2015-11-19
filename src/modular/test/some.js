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
  some: require('../observable/some')
});

test('Observable#some predicate empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.some(function (x) { return x > 0; });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, false),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#some predicate return', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.some(function (x) { return x > 0; });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, true),
    onCompleted(210)
  ]);

  t.end();
});

test('Observable#some predicate return not match', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, -2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.some(function (x) { return x > 0; });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, false),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#some predicate SomeNoneMatch', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, -2),
    onNext(220, -3),
    onNext(230, -4),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.some(function (x) { return x > 0; });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, false),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#some predicate some match', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, -2),
    onNext(220, 3),
    onNext(230, -4),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.some(function (x) { return x > 0; });
  });

  reactiveAssert(t, results.messages, [
    onNext(220, true),
    onCompleted(220)
  ]);

  t.end();
});

test('Observable#some predicate throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.some(function (x) { return x > 0; });
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#some predicate throws error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, -2),
    onNext(220, 3),
    onNext(230, -4),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.some(function () { throw error; });
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#some predicate never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.some(function (x) { return x > 0; });
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});
