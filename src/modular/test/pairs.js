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
  pairs: require('../observable/pairs')
});

test('Observable.pairs empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = {};

  var results = scheduler.startScheduler(function () {
    return Observable.pairs(xs, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(201)
  ]);
  t.end();
});

test('Observable.pairs normal', function (t) {
  var scheduler = new TestScheduler();

  var xs = {foo: 42, bar: 56, baz: 78};

  var results = scheduler.startScheduler(function () {
    return Observable.pairs(xs, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, ['foo', 42]),
    onNext(202, ['bar', 56]),
    onNext(203, ['baz', 78]),
    onCompleted(204)
  ]);
  t.end();
});

test('Observable.pairs dispose', function (t) {
  var xs = {foo: 42, bar: 56, baz: 78, quux: 104};

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.pairs(xs, scheduler);
  }, { disposed: 204 });

  reactiveAssert(t, results.messages, [
    onNext(201, ['foo', 42]),
    onNext(202, ['bar', 56]),
    onNext(203, ['baz', 78]),
  ]);
  t.end();
});
