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
  fromArray: require('../observable/fromarray')
});

test('fromArray normal', function (t) {
  var array = [1, 2, 3, 4, 5];

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.fromArray(array, scheduler);
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

test('fromArray empty', function (t) {
  var array = [];

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.fromArray(array, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(201)
  ]);
  t.end();
});

test('fromArray one', function (t) {
  var array = [1];

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.fromArray(array, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 1),
    onCompleted(202)
  ]);
  t.end();
});

test('fromArray dispose', function (t) {
  var array = [1, 2, 3, 4, 5];

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.fromArray(array, scheduler);
  }, { disposed: 204 });

  reactiveAssert(t, results.messages, [
    onNext(201, 1),
    onNext(202, 2),
    onNext(203, 3)
  ]);
  t.end();
});
