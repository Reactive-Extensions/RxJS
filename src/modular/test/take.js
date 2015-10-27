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
  take: require('../observable/take')
});

test('Observable#take complete after', function (t) {
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
    return xs.take(20);
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

test('Observable#take complete same', function (t) {
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
    return xs.take(17);
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
    onCompleted(630)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 630)
  ]);

  t.end();
});

test('Observable#take complete before', function (t) {
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
    return xs.take(10);
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
    onCompleted(415)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 415)
  ]);

  t.end();
});

test('Observable#take error after', function (t) {
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
    return xs.take(20);
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
    onError(690, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 690)
  ]);

  t.end();
});

test('Observable#take error same', function (t) {
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
    onError(690, new Error())
  );

  var results = scheduler.startScheduler(function () {
    return xs.take(17);
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
    onCompleted(630)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 630)
  ]);

  t.end();
});

test('Observable#take error before', function (t) {
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
    onError(690, new Error()));

  var results = scheduler.startScheduler(function () {
    return xs.take(3);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 9),
    onNext(230, 13),
    onNext(270, 7),
    onCompleted(270)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 270)
  ]);

  t.end();
});

test('Observable#take dispose before', function (t) {
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
    return xs.take(3);
  }, { disposed: 250 });

  reactiveAssert(t, results.messages, [
    onNext(210, 9),
    onNext(230, 13)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#take dispose after', function (t) {
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
    return xs.take(3);
  }, { disposed: 400 });

  reactiveAssert(t, results.messages, [
    onNext(210, 9),
    onNext(230, 13),
    onNext(270, 7),
    onCompleted(270)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 270)
  ]);

  t.end();
});
