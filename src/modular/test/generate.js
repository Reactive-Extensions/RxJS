'use strict';

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted;

Observable.addToObject({
  generate: require('../observable/generate')
});

test('Observable.generate finite', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.generate(0, function (x) {
      return x <= 3;
    }, function (x) {
      return x + 1;
    }, function (x) {
      return x;
    }, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 0),
    onNext(202, 1),
    onNext(203, 2),
    onNext(204, 3),
    onCompleted(205)
  ]);

  t.end();
});

test('Observable.generate throw condition', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error();

  var results = scheduler.startScheduler(function () {
    return Observable.generate(0, function () {
      throw error;
    }, function (x) {
      return x + 1;
    }, function (x) {
      return x;
    }, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(201, error)
  ]);

  t.end();
});

test('Observable.generate throw result selector', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error();

  var results = scheduler.startScheduler(function () {
    return Observable.generate(0, function () {
      return true;
    }, function (x) {
      return x + 1;
    }, function () {
      throw error;
    }, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(201, error)
  ]);

  t.end();
});

test('Observable.generate throw iterate', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error();

  var results = scheduler.startScheduler(function () {
    return Observable.generate(0, function () {
      return true;
    }, function () {
      throw error;
    }, function (x) {
      return x;
    }, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 0),
    onError(202, error)
  ]);

  t.end();
});

test('Observable.generate dispose', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.generate(0, function () {
      return true;
    }, function (x) {
      return x + 1;
    }, function (x) {
      return x;
    }, scheduler);
  }, {disposed: 203 });

  reactiveAssert(t, results.messages, [
    onNext(201, 0),
    onNext(202, 1)
  ]);

  t.end();
});
