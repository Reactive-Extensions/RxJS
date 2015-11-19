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

Observable.addToPrototype({
  sum: require('../observable/sum')
});

test('Observable#sum number empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sum();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 0),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#sum number return', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sum();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 2),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#sum number some', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sum();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 2 + 3 + 4),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#sum number throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sum();
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#sum number never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sum();
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#sum with selector regular number', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 'fo'),
    onNext(220, 'b'),
    onNext(230, 'qux'),
    onCompleted(240)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sum(function (x) {
      return x.length;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(240, 6),
    onCompleted(240)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 240)
  ]);

  t.end();
});
