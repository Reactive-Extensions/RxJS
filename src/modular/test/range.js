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
  range: require('../observable/range')
});

test('range zero', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.range(0, 0, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(201)
  ]);
  t.end();
});

test('range one', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.range(0, 1, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 0),
    onCompleted(202)
  ]);
  t.end();
});

test('range five', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.range(10, 5, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 10),
    onNext(202, 11),
    onNext(203, 12),
    onNext(204, 13),
    onNext(205, 14),
    onCompleted(206)
  ]);
  t.end();
});

test('range dispose', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.range(-10, 5, scheduler);
  }, { disposed: 204 });

  reactiveAssert(t, results.messages, [
    onNext(201, -10),
    onNext(202, -9),
    onNext(203, -8)
  ]);
  t.end();
});
