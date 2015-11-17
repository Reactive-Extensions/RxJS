'use strict';

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onCompleted = ReactiveTest.onCompleted;

Observable.addToObject({
  timer: require('../observable/timer')
});

function noop () { }

test('Observable.timer one shot relative time basic', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.timer(300, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(500, 0),
    onCompleted(500)
  ]);

  t.end();
});

test('Observable.timer one shot relative time zero', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.timer(0, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 0),
    onCompleted(201)
  ]);

  t.end();
});

test('Observable.timer one shot relative time negative', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.timer(-1, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 0),
    onCompleted(201)
  ]);

  t.end();
});

test('Observable.timer one shot relative time disposed', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.timer(1000, scheduler);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable.timer one shot relative time observer throws', function (t) {
  var scheduler1 = new TestScheduler();

  var xs = Observable.timer(1, scheduler1);
  xs.subscribe(function () { throw new Error(); });
  t.throws(function () { scheduler1.start(); });

  var scheduler2 = new TestScheduler();

  var ys = Observable.timer(1, scheduler2);
  ys.subscribe(noop, noop, function () { throw new Error(); });
  t.throws(function () { scheduler2.start(); });

  t.end();
});

test('Observable.timer relative start and periodically repeat', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function() {
    return Observable.timer(300, 100, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(500, 0),
    onNext(600, 1),
    onNext(700, 2),
    onNext(800, 3),
    onNext(900, 4)
  ]);

  t.end();
});
