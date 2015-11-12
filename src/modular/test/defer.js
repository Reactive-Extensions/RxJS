'use strict';

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe;

Observable.addToObject({
  defer: require('../observable/defer')
});

test('Observable.defer complete', function (t) {
  var invoked = 0;

  var scheduler = new TestScheduler();

  var xs;

  var results = scheduler.startScheduler(function () {
    return Observable.defer(function () {
      invoked++;
      xs = scheduler.createColdObservable(
        onNext(100, scheduler.clock),
        onCompleted(200));

      return xs;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(300, 200),
    onCompleted(400)
  ]);

  t.equal(1, invoked);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  t.end();
});

test('Observable.defer Error', function (t) {
  var scheduler = new TestScheduler();

  var invoked = 0;

  var error = new Error();

  var xs;

  var results = scheduler.startScheduler(function () {
    return Observable.defer(function () {
      invoked++;
      xs = scheduler.createColdObservable(
        onNext(100, scheduler.clock),
        onError(200, error));
      return xs;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(300, 200),
    onError(400, error)
  ]);

  t.equal(1, invoked);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  t.end();
});

test('Observable.defer dispose', function (t) {
  var scheduler = new TestScheduler();

  var invoked = 0;

  var xs;

  var results = scheduler.startScheduler(function () {
    return Observable.defer(function () {
      invoked++;
      xs = scheduler.createColdObservable(
        onNext(100, scheduler.clock),
        onNext(200, invoked),
        onNext(1100, 1000));

      return xs;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(300, 200),
    onNext(400, 1)
  ]);

  t.equal(1, invoked);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable.defer throw', function (t) {
  var scheduler = new TestScheduler();

  var invoked = 0;

  var error = new Error();

  var results = scheduler.startScheduler(function () {
    return Observable.defer(function () {
      invoked++;
      throw error;
    });
  });

  reactiveAssert(t, results.messages, [
    onError(200, error)
  ]);

  t.equal(1, invoked);

  t.end();
});
