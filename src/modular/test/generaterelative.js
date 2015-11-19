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
  generateRelative: require('../observable/generaterelative')
});

test('Observable.generateRelative finite', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.generateRelative(0, function (x) {
      return x <= 3;
    }, function (x) {
      return x + 1;
    }, function (x) {
      return x;
    }, function (x) {
      return x + 1;
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

test('Observable.generateRelative throw condition', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.generateRelative(0, function () {
      throw error;
    }, function (x) {
      return x + 1;
    }, function (x) {
      return x;
    }, function (x) {
      return x + 1;
    }, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(201, error)
  ]);

  t.end();
});

test('Observable.generateRelative throw result selector', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.generateRelative(0, function () {
      return true;
    }, function (x) {
      return x + 1;
    }, function () {
      throw error;
    }, function (x) {
      return x + 1;
    }, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(201, error)
  ]);

  t.end();
});

test('Observable.generateRelative throw iterate', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.generateRelative(0, function () {
      return true;
    }, function () {
      throw error;
    }, function (x) {
      return x;
    }, function (x) {
      return x + 1;
    }, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(202, 0),
    onError(202, error)
  ]);

  t.end();
});

test('Observable.generateRelative throw time selector', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.generateRelative(0, function () {
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

test('Observable.generateRelative dispose', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.generateRelative(0, function () {
      return true;
    }, function (x) {
      return x + 1;
    }, function (x) {
      return x;
    }, function (x) {
      return x + 1;
    }, scheduler);
  }, { disposed: 210 });

  reactiveAssert(t, results.messages, [
    onNext(202, 0),
    onNext(204, 1),
    onNext(207, 2)
  ]);

  t.end();
});
