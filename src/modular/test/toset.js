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
  map: require('../observable/map'),
  toSet: require('../observable/toset')
});

function extractValues(x) {
  var arr = [];
  x.forEach(function (item) {
    arr.push(item);
  });
  return arr;
}

test('Observable#toSet completed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(220, 2),
    onNext(330, 3),
    onNext(440, 4),
    onNext(550, 5),
    onCompleted(660)
  );

  var results = scheduler.startScheduler(function () {
    return xs.toSet().map(extractValues);
  });

  reactiveAssert(t, results.messages, [
    onNext(660, [2,3,4,5]),
    onCompleted(660)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 660)
  ]);

  t.end();
});

test('Observable#toSet error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(220, 2),
    onNext(330, 3),
    onNext(440, 4),
    onNext(550, 5),
    onError(660, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.toSet().map(extractValues);
  });

  reactiveAssert(t, results.messages, [
    onError(660, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 660)
  ]);

  t.end();
});

test('Observable#toSet disposed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(220, 2),
    onNext(330, 3),
    onNext(440, 4),
    onNext(550, 5)
  );

  var results = scheduler.startScheduler(function () {
    return xs.toSet().map(extractValues);
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});
