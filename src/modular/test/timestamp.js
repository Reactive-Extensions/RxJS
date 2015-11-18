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
  timestamp: require('../observable/timestamp')
});

function Timestamp(value, timestamp) {
  this.value = value;
  this.timestamp = timestamp;
}

test('Observable#timestamp regular', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(230, 3),
    onNext(260, 4),
    onNext(300, 5),
    onNext(350, 6),
    onCompleted(400)
  );

  var results = scheduler.startScheduler(function () {
    return xs.timestamp(scheduler).map(function (x) {
      return new Timestamp(x.value, x.timestamp);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, new Timestamp(2, 210)),
    onNext(230, new Timestamp(3, 230)),
    onNext(260, new Timestamp(4, 260)),
    onNext(300, new Timestamp(5, 300)),
    onNext(350, new Timestamp(6, 350)),
    onCompleted(400)
  ]);

  t.end();
});

test('Observable#timestamp empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(201)
  );

  var results = scheduler.startScheduler(function () {
    return xs.timestamp(scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(201)
  ]);

  t.end();
});

test('Observable#timestamp error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(201, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.timestamp(scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(201, error)
  ]);

  t.end();
});

test('Observable#timestamp never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.timestamp(scheduler);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});
