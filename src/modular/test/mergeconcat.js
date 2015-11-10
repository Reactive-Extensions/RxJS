'use strict';
/* jshint undef: true, unused: true */

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
  mergeConcat: require('../observable/mergeconcat')
});

test('Observable#mergeConcat basic', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))),
    onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(200))),
    onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onCompleted(130))),
    onNext(320, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))),
    onCompleted(400)
  );

  var results = scheduler.startScheduler(function () {
    return xs.mergeConcat(2);
  });

  reactiveAssert(t, results.messages, [
    onNext(260, 1),
    onNext(280, 4),
    onNext(310, 2),
    onNext(330, 3),
    onNext(330, 5),
    onNext(360, 6),
    onNext(440, 7),
    onNext(460, 8),
    onNext(670, 9),
    onNext(700, 10),
    onCompleted(760)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 760)
  ]);

  t.end();
});

test('Observable#mergeConcat basic Long', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))),
    onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(300))),
    onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onCompleted(130))),
    onNext(320, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))),
    onCompleted(400)
  );

  var results = scheduler.startScheduler(function () {
    return xs.mergeConcat(2);
  });

  reactiveAssert(t, results.messages, [
    onNext(260, 1),
    onNext(280, 4),
    onNext(310, 2),
    onNext(330, 3),
    onNext(330, 5),
    onNext(360, 6),
    onNext(440, 7),
    onNext(460, 8),
    onNext(690, 9),
    onNext(720, 10),
    onCompleted(780)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 780)
  ]);

  t.end();
});

test('Observable#mergeConcat basic Wide', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))),
    onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(300))),
    onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onCompleted(130))),
    onNext(420, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))),
    onCompleted(450)
  );

  var results = scheduler.startScheduler(function () {
    return xs.mergeConcat(3);
  });

  reactiveAssert(t, results.messages, [
    onNext(260, 1),
    onNext(280, 4),
    onNext(280, 6),
    onNext(310, 2),
    onNext(330, 3),
    onNext(330, 5),
    onNext(360, 7),
    onNext(380, 8),
    onNext(630, 9),
    onNext(660, 10),
    onCompleted(720)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 720)
  ]);

  t.end();
});

test('Observable#mergeConcat basic late', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))),
    onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(300))),
    onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onCompleted(130))),
    onNext(420, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))),
    onCompleted(750)
  );

  var results = scheduler.startScheduler(function () {
    return xs.mergeConcat(3);
  });

  reactiveAssert(t, results.messages, [
    onNext(260, 1),
    onNext(280, 4),
    onNext(280, 6),
    onNext(310, 2),
    onNext(330, 3),
    onNext(330, 5),
    onNext(360, 7),
    onNext(380, 8),
    onNext(630, 9),
    onNext(660, 10),
    onCompleted(750)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 750)
  ]);

  t.end();
});

test('Observable#mergeConcat disposed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))),
    onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(200))),
    onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onCompleted(130))),
    onNext(320, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))),
    onCompleted(400)
  );

  var results = scheduler.startScheduler(function () {
      return xs.mergeConcat(2);
  }, { disposed: 450 });

  reactiveAssert(t, results.messages, [
    onNext(260, 1),
    onNext(280, 4),
    onNext(310, 2),
    onNext(330, 3),
    onNext(330, 5),
    onNext(360, 6),
    onNext(440, 7)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 450)
  ]);

  t.end();
});

test('Observable#mergeConcat inner error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))),
    onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(200))),
    onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onCompleted(130))),
    onNext(320, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))),
    onError(400, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.mergeConcat(2);
  });

  reactiveAssert(t, results.messages, [
    onNext(260, 1),
    onNext(280, 4),
    onNext(310, 2),
    onNext(330, 3),
    onNext(330, 5),
    onNext(360, 6),
    onError(400, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  t.end();
});

test('Observable#mergeConcat outer error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))),
    onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(200))),
    onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onError(140, error))),
    onNext(320, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))),
    onCompleted(400)
  );

  var results = scheduler.startScheduler(function () {
    return xs.mergeConcat(2);
  });

  reactiveAssert(t, results.messages, [
    onNext(260, 1),
    onNext(280, 4),
    onNext(310, 2),
    onNext(330, 3),
    onNext(330, 5),
    onNext(360, 6),
    onNext(440, 7),
    onNext(460, 8),
    onError(490, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 490)
  ]);

  t.end();
});
