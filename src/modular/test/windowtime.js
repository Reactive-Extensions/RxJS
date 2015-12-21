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
  just: require('../observable/just')
});

Observable.addToPrototype({
  concat: require('../observable/concat'),
  map: require('../observable/map'),
  mergeAll: require('../observable/mergeall'),
  windowTime: require('../observable/windowtime')
});

test('Observable#windowTime basic', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(240, 3),
    onNext(270, 4),
    onNext(320, 5),
    onNext(360, 6),
    onNext(390, 7),
    onNext(410, 8),
    onNext(460, 9),
    onNext(470, 10),
    onCompleted(490)
  );

  var results = scheduler.startScheduler(function () {
    return xs.windowTime(100, scheduler).map(function (ys, i) {
      return ys.map(function (y) { return i + ' ' + y; }).concat(Observable.just(i + ' end'));
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(210, '0 2'),
    onNext(240, '0 3'),
    onNext(270, '0 4'),
    onNext(300, '0 end'),
    onNext(320, '1 5'),
    onNext(360, '1 6'),
    onNext(390, '1 7'),
    onNext(400, '1 end'),
    onNext(410, '2 8'),
    onNext(460, '2 9'),
    onNext(470, '2 10'),
    onNext(490, '2 end'),
    onCompleted(490)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 490)
  ]);

  t.end();
});

test('Observable#windowTime basic both', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(240, 3),
    onNext(270, 4),
    onNext(320, 5),
    onNext(360, 6),
    onNext(390, 7),
    onNext(410, 8),
    onNext(460, 9),
    onNext(470, 10),
    onCompleted(490));

  var results = scheduler.startScheduler(function () {
    return xs.windowTime(100, 50, scheduler).map(function (ys, i) {
      return ys.map(function (y) { return i + ' ' + y; }).concat(Observable.just(i + ' end'));
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(210, '0 2'),
    onNext(240, '0 3'),
    onNext(270, '0 4'),
    onNext(270, '1 4'),
    onNext(300, '0 end'),
    onNext(320, '1 5'),
    onNext(320, '2 5'),
    onNext(350, '1 end'),
    onNext(360, '2 6'),
    onNext(360, '3 6'),
    onNext(390, '2 7'),
    onNext(390, '3 7'),
    onNext(400, '2 end'),
    onNext(410, '3 8'),
    onNext(410, '4 8'),
    onNext(450, '3 end'),
    onNext(460, '4 9'),
    onNext(460, '5 9'),
    onNext(470, '4 10'),
    onNext(470, '5 10'),
    onNext(490, '4 end'),
    onNext(490, '5 end'),
    onCompleted(490)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 490)
  ]);

  t.end();
});

test('Observable#windowTime basic', function (t) {
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
    return xs.windowTime(100, 70, scheduler).map(function (w, i) {
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

test('Observable#windowTime Error', function (t) {
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
    return xs.windowTime(100, 70, scheduler).map(function (w, i) {
      return w.map(function (x) { return i + ' ' + x;   });
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

test('Observable#windowTime disposed', function (t) {
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
    return xs.windowTime(100, 70, scheduler).map(function (w, i) {
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

test('Observable#windowTime basic same', function (t) {
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
    return xs.windowTime(100, scheduler).map(function (w, i) {
      return w.map(function (x) { return i + ' ' + x; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(210, '0 2'),
    onNext(240, '0 3'),
    onNext(280, '0 4'),
    onNext(320, '1 5'),
    onNext(350, '1 6'),
    onNext(380, '1 7'),
    onNext(420, '2 8'),
    onNext(470, '2 9'),
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});
