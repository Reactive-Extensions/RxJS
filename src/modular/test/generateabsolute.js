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
  generateAbsolute: require('../observable/generateabsolute')
});

test('Observable.generateAbsolute absolute time finite', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.generateAbsolute(0, function (x) {
      return x <= 3;
    }, function (x) {
      return x + 1;
    }, function (x) {
      return x;
    }, function (x) {
      return new Date(scheduler.now() + x + 1);
    }, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(202, 0),
    onNext(204, 1),
    onNext(207, 2),
    onNext(211, 3),
    onCompleted(211)
  ]);

  t.end();
});

test('Observable.generateAbsolute absolute time throw condition', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.generateAbsolute(0, function () {
      throw error;
    }, function (x) {
      return x + 1;
    }, function (x) {
      return x;
    }, function (x) {
      return new Date(scheduler.now() + x + 1);
    }, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(201, error)
  ]);

  t.end();
});

test('Observable.generateAbsolute absolute time throw result selector', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.generateAbsolute(0, function () {
      return true;
    }, function (x) {
      return x + 1;
    }, function () {
      throw error;
    }, function (x) {
      return new Date(scheduler.now() + x + 1);
    }, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(201, error)
  ]);

  t.end();
});

test('Observable.generateAbsolute absolute time throw iterate', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.generateAbsolute(0, function () {
      return true;
    }, function () {
      throw error;
    }, function (x) {
      return x;
    }, function (x) {
      return new Date(scheduler.now() + x + 1);
    }, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(202, 0),
    onError(202, error)
  ]);

  t.end();
});

test('Observable.generateAbsolute absolute time throw time selector', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.generateAbsolute(0, function () {
      return true;
    }, function (x) {
      return x + 1;
    }, function (x) {
      return x;
    }, function () {
      throw error;
    }, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(201, error)
  ]);

  t.end();
});

test('Observable.generateAbsolute absolute time dispose', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
      return Observable.generateAbsolute(0, function () {
        return true;
      }, function (x) {
        return x + 1;
      }, function (x) {
        return x;
      }, function (x) {
        return new Date(scheduler.now() + x + 1);
      }, scheduler);
  }, { disposed: 210 });

  reactiveAssert(t, results.messages, [
    onNext(202, 0),
    onNext(204, 1),
    onNext(207, 2)
  ]);

  t.end();
});

test('generateWithAbsoluteTime resultSelection', function(t) {

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function() {
    return Observable.generateAbsolute(0, function(x) {
      return x < 3;
    }, function(x) {
      return x + 1;
    }, function(x) {
      return 2 * x + 1;
    }, function(x) {
      return 10 * x;
    }, scheduler);
  });

  reactiveAssert(t, results.messages,
    [onNext(202, 1),
      onNext(212, 3),
      onNext(232, 5),
      onCompleted(232)]
  );

  t.end();

});
