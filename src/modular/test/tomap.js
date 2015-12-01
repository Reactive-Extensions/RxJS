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
  toMap: require('../observable/tomap')
});

function extractValues(x) {
  var arr = [];
  x.forEach(function (value, key) {
    arr.push(key, value);
  });
  return arr;
}

test('Observable#toMap completed', function (t) {
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
    return xs.toMap(function (x) { return x * 2; }, function (x) { return x * 4; }).map(extractValues);
  });

  reactiveAssert(t, results.messages, [
    onNext(660, [4, 8, 6, 12, 8, 16, 10, 20]),
    onCompleted(660)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 660)
  ]);

  t.end();
});

test('Observable#toMap error', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(220, 2),
    onNext(330, 3),
    onNext(440, 4),
    onNext(550, 5),
    onError(660, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.toMap(function (x) { return x * 2; }, function (x) { return x * 4; }).map(extractValues);
  });

  reactiveAssert(t, results.messages, [
    onError(660, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 660)
  ]);

  t.end();
});

test('Observable#toMap key selector throws', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(220, 2),
    onNext(330, 3),
    onNext(440, 4),
    onNext(550, 5),
    onCompleted(600)
  );

  var results = scheduler.startScheduler(function () {
    return xs.toMap(function (x) { if (x < 4) { return x * 2; } else { throw error; } }, function (x) { return x * 4; }).map(extractValues);
  });

  reactiveAssert(t, results.messages, [
    onError(440, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 440)
  ]);

  t.end();
});

test('Observable#toMap element selector throws', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(220, 2),
    onNext(330, 3),
    onNext(440, 4),
    onNext(550, 5),
    onCompleted(600)
  );

  var results = scheduler.startScheduler(function () {
    return xs.toMap(function (x) { return x * 2; }, function (x) { if (x < 4) { return x * 4; } else { throw error; } }).map(extractValues);
  });

  reactiveAssert(t, results.messages, [
    onError(440, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 440)
  ]);

  t.end();
});

test('Observable#toMap disposed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(220, 2),
    onNext(330, 3),
    onNext(440, 4),
    onNext(550, 5)
  );

  var results = scheduler.startScheduler(function () {
    return xs.toMap(function (x) { return x * 2; }, function (x) { return x * 4; }).map(extractValues);
  });

  reactiveAssert(t, results.messages, [
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});
