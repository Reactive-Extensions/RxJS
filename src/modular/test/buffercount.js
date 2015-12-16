'use strict';

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe;

Observable.addToPrototype({
  bufferCount: require('../observable/buffercount')
});

test('Observable#bufferCount partial window', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.bufferCount(5);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, [2,3,4,5]),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#bufferCount full windows', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.bufferCount(2);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, [2,3]),
    onNext(240, [4,5]),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#bufferCount full and partial windows', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.bufferCount(3);
  });

  reactiveAssert(t, results.messages, [
    onNext(230, [2,3,4]),
    onNext(250, [5]),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#bufferCount Error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onError(250, error));

  var results = scheduler.startScheduler(function () {
    return xs.bufferCount(5);
  });

  reactiveAssert(t, results.messages, [
    onError(250, error)
  ]);

  t.end();
});

test('Observable#bufferCount skip less', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.bufferCount(3, 1);
  });

  reactiveAssert(t, results.messages, [
    onNext(230, [2,3,4]),
    onNext(240, [3,4,5]),
    onNext(250, [4,5]),
    onNext(250, [5]),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#bufferCount skip more', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.bufferCount(2, 3);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, [2,3]),
    onNext(250, [5]),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#bufferCount basic', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(100, 1),
    onNext(210, 2),
    onNext(240, 3),
    onNext(280, 4),
    onNext(320, 5),
    onNext(350, 6),
    onNext(380, 7),
    onNext(420, 8),
    onNext(470, 9),
    onCompleted(600));

  var results = scheduler.startScheduler(function () {
    return xs.bufferCount(3, 2);
  });

  reactiveAssert(t, results.messages, [
    onNext(280, [2,3,4]),
    onNext(350, [4,5,6]),
    onNext(420, [6,7,8]),
    onNext(600, [8,9]),
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});

test('Observable#bufferCount disposed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(100, 1),
    onNext(210, 2),
    onNext(240, 3),
    onNext(280, 4),
    onNext(320, 5),
    onNext(350, 6),
    onNext(380, 7),
    onNext(420, 8),
    onNext(470, 9),
    onCompleted(600));

  var results = scheduler.startScheduler(function () {
    return xs.bufferCount(3, 2);
  }, {disposed: 370 });

  reactiveAssert(t, results.messages, [
    onNext(280, [2,3,4]),
    onNext(350, [4,5,6])
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 370)
  ]);

  t.end();
});
