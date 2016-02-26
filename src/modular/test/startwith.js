'use strict';

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted;

Observable.addToPrototype({
  startWith: require('../observable/startwith')
});

global._Rx || (global._Rx = {});
if (!global._Rx.currentThreadScheduler) {
  require('../scheduler/currentthreadscheduler');
}

test('Observable#startWith normal', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.startWith(1);
  });

  reactiveAssert(t, results.messages, [
    onNext(200, 1),
    onNext(220, 2),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#startWith never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.startWith(scheduler, 1);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 1)
  ]);

  t.end();
});

test('Observable#startWith empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.startWith(scheduler, 1);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 1),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#startWith one', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.startWith(scheduler, 1);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 1),
    onNext(220, 2),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#startWith multiple', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 4),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.startWith(scheduler, 1, 2, 3);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 1),
    onNext(202, 2),
    onNext(203, 3),
    onNext(220, 4),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#startWith error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(250, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.startWith(scheduler, 1, 2, 3);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 1),
    onNext(202, 2),
    onNext(203, 3),
    onError(250, error)
  ]);

  t.end();
});

test('Observable#startWith is unaffected by currentThread scheduler', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 2),
    onCompleted(250)
  );

  var results;

  global._Rx.currentThreadScheduler.schedule(null, function () {
    results = scheduler.startScheduler(function () {
      return xs.startWith(scheduler, 1);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 1),
    onNext(220, 2),
    onCompleted(250)
  ]);

  t.end();
});
