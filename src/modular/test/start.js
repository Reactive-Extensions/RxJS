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
  start: require('../observable/start'),
  startAsync: require('../observable/startAsync')
});

function noop() {}

// Polyfilling
require('lie/polyfill');

test('Observable.startAsync', function (t) {
  var source = Observable.startAsync(function () {
    return new Promise(function (res) { res(42); });
  });

  source.subscribe(function (x) {
    t.equal(42, x);
    t.end();
  });
});

test('Observable.startAsync Error', function (t) {
  var source = Observable.startAsync(function () {
    return new Promise(function (res, rej) { rej(42); });
  });

  source.subscribe(noop, function (err) {
    t.equal(42, err);
    t.end();
  });
});

test('Observable.start action 2', function (t) {
  var scheduler = new TestScheduler();

  var done = false;

  var results = scheduler.startScheduler(function () {
    return Observable.start(function () {
      done = true;
    }, null, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(200, undefined),
    onCompleted(200)
  ]);

  t.ok(done);

  t.end();
});

test('Observable.start function 2', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.start(function () {
      return 1;
    }, null, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(200, 1),
    onCompleted(200)
  ]);

  t.end();
});

test('Observable.start with error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.start(function () {
      throw error;
    }, null, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(200, error)
  ]);

  t.end();
});

test('Observable.start with context', function (t) {
  var context = { value: 42 };

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.start(function () {
      return this.value;
    }, context, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(200, 42),
    onCompleted(200)
  ]);

  t.end();
});
