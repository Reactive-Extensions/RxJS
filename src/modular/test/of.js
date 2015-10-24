'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
    onCompleted = ReactiveTest.onCompleted;

Observable.addToObject({
  of: require('../observable/of'),
  ofScheduled: require('../observable/ofscheduled')
});

test('of', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.of(1,2,3,4,5);
  });

  reactiveAssert(t, results.messages, [
    onNext(200, 1),
    onNext(200, 2),
    onNext(200, 3),
    onNext(200, 4),
    onNext(200, 5),
    onCompleted(200)
  ]);
  t.end();
});

test('of empty', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.of();
  });

  reactiveAssert(t, results.messages, [
    onCompleted(200)
  ]);
  t.end();
});

test('ofScheduled', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.ofScheduled(scheduler, 1,2,3,4,5);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 1),
    onNext(202, 2),
    onNext(203, 3),
    onNext(204, 4),
    onNext(205, 5),
    onCompleted(206)
  ]);
  t.end();
});

test('ofScheduled empty', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.ofScheduled(scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(201)
  ]);
  t.end();
});
