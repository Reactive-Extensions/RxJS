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
  skip: require('../observable/skip')
});

test('Observable#skip complete after', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(70, 6),
    onNext(150, 4),
    onNext(210, 9),
    onNext(230, 13),
    onNext(270, 7),
    onNext(280, 1),
    onNext(300, -1),
    onNext(310, 3),
    onNext(340, 8),
    onNext(370, 11),
    onNext(410, 15),
    onNext(415, 16),
    onNext(460, 72),
    onNext(510, 76),
    onNext(560, 32),
    onNext(570, -100),
    onNext(580, -3),
    onNext(590, 5),
    onNext(630, 10),
    onCompleted(690)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skip(20);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(690)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 690)
  ]);

  t.end();
});

test('Observable#skip complete same', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(70, 6),
    onNext(150, 4),
    onNext(210, 9),
    onNext(230, 13),
    onNext(270, 7),
    onNext(280, 1),
    onNext(300, -1),
    onNext(310, 3),
    onNext(340, 8),
    onNext(370, 11),
    onNext(410, 15),
    onNext(415, 16),
    onNext(460, 72),
    onNext(510, 76),
    onNext(560, 32),
    onNext(570, -100),
    onNext(580, -3),
    onNext(590, 5),
    onNext(630, 10),
    onCompleted(690)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skip(17);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(690)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 690)
  ]);

  t.end();
});

test('Observable#skip complete before', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(70, 6),
    onNext(150, 4),
    onNext(210, 9),
    onNext(230, 13),
    onNext(270, 7),
    onNext(280, 1),
    onNext(300, -1),
    onNext(310, 3),
    onNext(340, 8),
    onNext(370, 11),
    onNext(410, 15),
    onNext(415, 16),
    onNext(460, 72),
    onNext(510, 76),
    onNext(560, 32),
    onNext(570, -100),
    onNext(580, -3),
    onNext(590, 5),
    onNext(630, 10),
    onCompleted(690)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skip(10);
  });

  reactiveAssert(t, results.messages, [
    onNext(460, 72),
    onNext(510, 76),
    onNext(560, 32),
    onNext(570, -100),
    onNext(580, -3),
    onNext(590, 5),
    onNext(630, 10),
    onCompleted(690)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 690)
  ]);

  t.end();
});

test('Observable#skip complete zero', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(70, 6),
    onNext(150, 4),
    onNext(210, 9),
    onNext(230, 13),
    onNext(270, 7),
    onNext(280, 1),
    onNext(300, -1),
    onNext(310, 3),
    onNext(340, 8),
    onNext(370, 11),
    onNext(410, 15),
    onNext(415, 16),
    onNext(460, 72),
    onNext(510, 76),
    onNext(560, 32),
    onNext(570, -100),
    onNext(580, -3),
    onNext(590, 5),
    onNext(630, 10),
    onCompleted(690)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skip(0);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 9),
    onNext(230, 13),
    onNext(270, 7),
    onNext(280, 1),
    onNext(300, -1),
    onNext(310, 3),
    onNext(340, 8),
    onNext(370, 11),
    onNext(410, 15),
    onNext(415, 16),
    onNext(460, 72),
    onNext(510, 76),
    onNext(560, 32),
    onNext(570, -100),
    onNext(580, -3),
    onNext(590, 5),
    onNext(630, 10),
    onCompleted(690)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 690)
  ]);

  t.end();
});

test('Observable#skip error after', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(70, 6),
    onNext(150, 4),
    onNext(210, 9),
    onNext(230, 13),
    onNext(270, 7),
    onNext(280, 1),
    onNext(300, -1),
    onNext(310, 3),
    onNext(340, 8),
    onNext(370, 11),
    onNext(410, 15),
    onNext(415, 16),
    onNext(460, 72),
    onNext(510, 76),
    onNext(560, 32),
    onNext(570, -100),
    onNext(580, -3),
    onNext(590, 5),
    onNext(630, 10),
    onError(690, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skip(20);
  });

  reactiveAssert(t, results.messages, [
    onError(690, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 690)
  ]);

  t.end();
});

test('Observable#skip error same', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(70, 6),
    onNext(150, 4),
    onNext(210, 9),
    onNext(230, 13),
    onNext(270, 7),
    onNext(280, 1),
    onNext(300, -1),
    onNext(310, 3),
    onNext(340, 8),
    onNext(370, 11),
    onNext(410, 15),
    onNext(415, 16),
    onNext(460, 72),
    onNext(510, 76),
    onNext(560, 32),
    onNext(570, -100),
    onNext(580, -3),
    onNext(590, 5),
    onNext(630, 10),
    onError(690, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skip(17);
  });

  reactiveAssert(t, results.messages, [
    onError(690, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 690)
  ]);

  t.end();
});

test('Observable#skip error before', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(70, 6),
    onNext(150, 4),
    onNext(210, 9),
    onNext(230, 13),
    onNext(270, 7),
    onNext(280, 1),
    onNext(300, -1),
    onNext(310, 3),
    onNext(340, 8),
    onNext(370, 11),
    onNext(410, 15),
    onNext(415, 16),
    onNext(460, 72),
    onNext(510, 76),
    onNext(560, 32),
    onNext(570, -100),
    onNext(580, -3),
    onNext(590, 5),
    onNext(630, 10),
    onError(690, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skip(3);
  });

  reactiveAssert(t, results.messages, [
    onNext(280, 1),
    onNext(300, -1),
    onNext(310, 3),
    onNext(340, 8),
    onNext(370, 11),
    onNext(410, 15),
    onNext(415, 16),
    onNext(460, 72),
    onNext(510, 76),
    onNext(560, 32),
    onNext(570, -100),
    onNext(580, -3),
    onNext(590, 5),
    onNext(630, 10),
    onError(690, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 690)
  ]);

  t.end();
});

test('Observable#skip dispose before', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(70, 6),
    onNext(150, 4),
    onNext(210, 9),
    onNext(230, 13),
    onNext(270, 7),
    onNext(280, 1),
    onNext(300, -1),
    onNext(310, 3),
    onNext(340, 8),
    onNext(370, 11),
    onNext(410, 15),
    onNext(415, 16),
    onNext(460, 72),
    onNext(510, 76),
    onNext(560, 32),
    onNext(570, -100),
    onNext(580, -3),
    onNext(590, 5),
    onNext(630, 10)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skip(3);
  }, { disposed: 250 });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#skip dispose after', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(70, 6),
    onNext(150, 4),
    onNext(210, 9),
    onNext(230, 13),
    onNext(270, 7),
    onNext(280, 1),
    onNext(300, -1),
    onNext(310, 3),
    onNext(340, 8),
    onNext(370, 11),
    onNext(410, 15),
    onNext(415, 16),
    onNext(460, 72),
    onNext(510, 76),
    onNext(560, 32),
    onNext(570, -100),
    onNext(580, -3),
    onNext(590, 5),
    onNext(630, 10)
  );

  var results = scheduler.startScheduler(function () {
    return xs.skip(3);
  }, { disposed: 400 });

  reactiveAssert(t, results.messages, [
    onNext(280, 1),
    onNext(300, -1),
    onNext(310, 3),
    onNext(340, 8),
    onNext(370, 11)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  t.end();
});
