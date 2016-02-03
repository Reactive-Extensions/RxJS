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
  bufferTime: require('../observable/buffertime')
});

test('Observable#bufferTime Basic', function (t) {
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
    return xs.bufferTime(100, 70, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(300, [2,3,4]),
    onNext(370, [4,5,6]),
    onNext(440, [6,7,8]),
    onNext(510, [8,9]),
    onNext(580, []),
    onNext(600, []),
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});

test('Observable#bufferTime Error', function (t) {
  var error = new Error();

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
    onError(600, error));

  var results = scheduler.startScheduler(function () {
    return xs.bufferTime(100, 70, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(300, [2,3,4]),
    onNext(370, [4,5,6]),
    onNext(440, [6,7,8]),
    onNext(510, [8,9]),
    onNext(580, []),
    onError(600, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});

test('Observable#bufferTime Disposed', function (t) {
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
    return xs.bufferTime(100, 70, scheduler);
  }, {disposed: 370});

  reactiveAssert(t, results.messages, [
    onNext(300, [2,3,4])
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 370)
  ]);

  t.end();
});

test('Observable#bufferTime Basic Same', function (t) {
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
    onCompleted(600)
  );

  var results = scheduler.startScheduler(function () {
    return xs.bufferTime(100, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(300, [2,3,4]),
    onNext(400, [5,6,7]),
    onNext(500, [8,9]),
    onNext(600, []),
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});
