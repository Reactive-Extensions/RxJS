'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext;

Observable.addToObject({
  interval: require('../observable/interval')
});

test('Observable.interval relative time basic', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.interval(100, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(300, 0),
    onNext(400, 1),
    onNext(500, 2),
    onNext(600, 3),
    onNext(700, 4),
    onNext(800, 5),
    onNext(900, 6)
  ]);

  t.end();
});

test('Observable.interval relative time zero', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.interval(0, scheduler);
  }, { disposed: 210 });

  reactiveAssert(t, results.messages, [
    onNext(201, 0),
    onNext(202, 1),
    onNext(203, 2),
    onNext(204, 3),
    onNext(205, 4),
    onNext(206, 5),
    onNext(207, 6),
    onNext(208, 7),
    onNext(209, 8)
  ]);

  t.end();
});

test('Observable.interval relative time negative', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.interval(-1, scheduler);
  }, {disposed: 210 });

  reactiveAssert(t, results.messages, [
    onNext(201, 0),
    onNext(202, 1),
    onNext(203, 2),
    onNext(204, 3),
    onNext(205, 4),
    onNext(206, 5),
    onNext(207, 6),
    onNext(208, 7),
    onNext(209, 8)
  ]);

  t.end();
});

test('Observable.interval relative time disposed', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.interval(1000, scheduler);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable.interval relative time observer throws', function (t) {
  var scheduler = new TestScheduler();

  var xs = Observable.interval(1, scheduler);

  xs.subscribe(function () { throw new Error(); });

  t.throws(function () { return scheduler.start(); });

  t.end();
});
