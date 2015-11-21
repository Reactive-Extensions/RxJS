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
  indexOf: require('../observable/indexof')
});

test('Observable#indexOf empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.indexOf(42);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, -1),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#indexOf return positive', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.indexOf(2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 0),
    onCompleted(210)
  ]);

  t.end();
});

test('Observable#indexOf return negative', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.indexOf(-2);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, -1),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#indexOf some positive', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.indexOf(3);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 1),
    onCompleted(220)
  ]);

  t.end();
});

test('Observable#indexOf some negative', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.indexOf(-3);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, -1),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#indexOf throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.indexOf(42);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#indexOf never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.indexOf(42);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#indexOf fromIndex less than zero', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.indexOf(42, -1);
  });

  reactiveAssert(t, results.messages, [
    onNext(200, -1),
    onCompleted(200)
  ]);

  t.end();
});

test('Observable#indexOf fromIndex Infinity', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.indexOf(2, Infinity);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 0),
    onCompleted(210)
  ]);

  t.end();
});

test('Observable#indexOf fromIndex zero', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.indexOf(2, 0);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 0),
    onCompleted(210)
  ]);

  t.end();
});

test('Observable#indexOf fromIndex greater than zero misses', function (t) {
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
    return xs.indexOf(2, 1);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, -1),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#indexOf fromIndex greater than zero no end', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5)
  );

  var results = scheduler.startScheduler(function () {
    return xs.indexOf(2, 1);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#indexOf fromIndex greater than zero hits', function (t) {
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
    return xs.indexOf(3, 1);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 1),
    onCompleted(220)
  ]);

  t.end();
});

test('Observable#indexOf -0 equals 0', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, -0),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.indexOf(0);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 0),
    onCompleted(210)
  ]);

  t.end();
});

test('Observable#indexOf +0 equals 0', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, +0),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.indexOf(0);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 0),
    onCompleted(210)
  ]);

  t.end();
});
