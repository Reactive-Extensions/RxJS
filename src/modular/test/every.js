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
  every: require('../observable/every')
});

test('Observable#every empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.every(function (x) { return x > 0; });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, true),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#every return', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.every(function (x) { return x > 0; });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, true),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#every return no match', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, -2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.every(function (x) { return x > 0; });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, false),
    onCompleted(210)
  ]);

  t.end();
});

test('Observable#every none match', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, -2),
    onNext(220, -3),
    onNext(230, -4),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.every(function (x) { return x > 0; });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, false),
    onCompleted(210)
  ]);

  t.end();
});

test('Observable#every some match', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, -2),
    onNext(220, 3),
    onNext(230, -4),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.every(function (x) { return x > 0; });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, false),
    onCompleted(210)
  ]);

  t.end();
});

test('Observable#every all match', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.every(function (x) { return x > 0; });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, true),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#every throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.every(function (x) { return x > 0; });
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#every never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.every(function (x) { return x > 0; });
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});
