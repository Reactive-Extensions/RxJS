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
  ignoreElements: require('../observable/ignoreelements')
});

test('Observable#ignoreElements basic', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 1),
    onNext(210, 2),
    onNext(250, 3),
    onNext(270, 4),
    onNext(310, 5),
    onNext(360, 6),
    onNext(380, 7),
    onNext(410, 8),
    onNext(590, 9));

  var results = scheduler.startScheduler(function () {
    return xs.ignoreElements();
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable#ignoreElements Completed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 1),
    onNext(210, 2),
    onNext(250, 3),
    onNext(270, 4),
    onNext(310, 5),
    onNext(360, 6),
    onNext(380, 7),
    onNext(410, 8),
    onNext(590, 9),
    onCompleted(610));

  var results = scheduler.startScheduler(function () {
    return xs.ignoreElements();
  });

  reactiveAssert(t, results.messages, [
    onCompleted(610)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 610)
  ]);

  t.end();
});

test('Observable#ignoreElements Error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 1),
    onNext(210, 2),
    onNext(250, 3),
    onNext(270, 4),
    onNext(310, 5),
    onNext(360, 6),
    onNext(380, 7),
    onNext(410, 8),
    onNext(590, 9),
    onError(610, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.ignoreElements();
  });

  reactiveAssert(t, results.messages, [
    onError(610, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 610)
  ]);

  t.end();
});
