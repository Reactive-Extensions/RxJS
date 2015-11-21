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
  includes: require('../observable/includes')
});

test('Observable#includes empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.includes(42);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, false),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#includes return positive', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.includes(2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, true),
    onCompleted(210)
  ]);

  t.end();
});

test('Observable#includes return negative', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.includes(-2);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, false),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#includes some positive', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.includes(3);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, true),
    onCompleted(220)
  ]);

  t.end();
});

test('Observable#includes some negative', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.includes(-3);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, false),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#includes throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.includes(42);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#includes never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.includes(42);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#includes fromIndex less than zero', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.includes(42, -1);
  });

  reactiveAssert(t, results.messages, [
    onNext(200, false),
    onCompleted(200)
  ]);

  t.end();
});

test('Observable#includes fromIndex Infinity', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.includes(2, Infinity);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, true),
    onCompleted(210)
  ]);

  t.end();
});

test('Observable#includes fromIndex zero', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.includes(2, 0);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, true),
    onCompleted(210)
  ]);

  t.end();
});

test('Observable#includes fromIndex greater than zero misses', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.includes(2, 1);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, false),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#includes fromIndex greater than zero no end', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5)
  );

  var results = scheduler.startScheduler(function () {
    return xs.includes(2, 1);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#includes fromIndex greater than zero hits', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.includes(3, 1);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, true),
    onCompleted(220)
  ]);

  t.end();
});

test('Observable#includes -0 equals 0', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, -0),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.includes(0);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, true),
    onCompleted(210)
  ]);

  t.end();
});

test('Observable#includes +0 equals 0', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, +0),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.includes(0);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, true),
    onCompleted(210)
  ]);

  t.end();
});

test('Observable#includes NaN equals NaN', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, NaN),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.includes(NaN);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, true),
    onCompleted(210)
  ]);

  t.end();
});
