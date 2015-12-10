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
  mergeAll: require('../observable/mergeall'),
  windowCount: require('../observable/windowcount')
});

test('Observable#windowCount basic', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(100, 1),
    onNext(210, 2),
    onNext(240, 3),
    onNext(280, 4),
    onNext(320, 5),
    onNext(350, 6),
    onNext(380, 7),
    onNext(420, 8),
    onNext(470, 9),
    onCompleted(600));

  var results = scheduler.startScheduler(function () {
    return xs.windowCount(3, 2).map(function (w, i) {
      return w.map(function (x) { return i + ' ' + x; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(210, '0 2'),
    onNext(240, '0 3'),
    onNext(280, '0 4'),
    onNext(280, '1 4'),
    onNext(320, '1 5'),
    onNext(350, '1 6'),
    onNext(350, '2 6'),
    onNext(380, '2 7'),
    onNext(420, '2 8'),
    onNext(420, '3 8'),
    onNext(470, '3 9'),
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});

test('Observable#windowCount disposed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(100, 1),
    onNext(210, 2),
    onNext(240, 3),
    onNext(280, 4),
    onNext(320, 5),
    onNext(350, 6),
    onNext(380, 7),
    onNext(420, 8),
    onNext(470, 9),
    onCompleted(600));

  var results = scheduler.startScheduler(function () {
    return xs.windowCount(3, 2).map(function (w, i) {
      return w.map(function (x) { return i + ' ' + x; });
    }).mergeAll();
  }, { disposed: 370 });

  reactiveAssert(t, results.messages, [
    onNext(210, '0 2'),
    onNext(240, '0 3'),
    onNext(280, '0 4'),
    onNext(280, '1 4'),
    onNext(320, '1 5'),
    onNext(350, '1 6'),
    onNext(350, '2 6')
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 370)
  ]);

  t.end();
});

test('Observable#windowCount error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(100, 1),
    onNext(210, 2),
    onNext(240, 3),
    onNext(280, 4),
    onNext(320, 5),
    onNext(350, 6),
    onNext(380, 7),
    onNext(420, 8),
    onNext(470, 9),
    onError(600, error));

  var results = scheduler.startScheduler(function () {
    return xs.windowCount(3, 2).map(function (w, i) {
      return w.map(function (x) { return i + ' ' + x; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(210, '0 2'),
    onNext(240, '0 3'),
    onNext(280, '0 4'),
    onNext(280, '1 4'),
    onNext(320, '1 5'),
    onNext(350, '1 6'),
    onNext(350, '2 6'),
    onNext(380, '2 7'),
    onNext(420, '2 8'),
    onNext(420, '3 8'),
    onNext(470, '3 9'),
    onError(600, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});
