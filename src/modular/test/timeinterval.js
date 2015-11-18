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
  timeInterval: require('../observable/timeinterval')
});

function TimeInterval(value, interval) {
  this.value = value;
  this.interval = interval;
}

test('Observable#timeInterval regular', function (t) {
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
    return xs.timeInterval(scheduler).map(function (x) {
      return new TimeInterval(x.value, x.interval);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, new TimeInterval(2, 10)),
    onNext(230, new TimeInterval(3, 20)),
    onNext(260, new TimeInterval(4, 30)),
    onNext(300, new TimeInterval(5, 40)),
    onNext(350, new TimeInterval(6, 50)),
    onCompleted(400)
  ]);

  t.end();
});

test('Observable#timeInterval empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(201)
  );

  var results = scheduler.startScheduler(function () {
    return xs.timeInterval(scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(201)
  ]);

  t.end();
});

test('Observable#timeInterval error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(201, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.timeInterval(scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(201, error)
  ]);

  t.end();
});

test('Observable#timeInterval never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.timeInterval(scheduler);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});
