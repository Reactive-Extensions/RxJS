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
  'case': require('../observable/case')
});

test('Observable.case one', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(240, 2),
    onNext(270, 3),
    onCompleted(300)
  );

  var ys = scheduler.createHotObservable(
    onNext(220, 11),
    onNext(250, 12),
    onNext(280, 13),
    onCompleted(310)
  );

  var zs = scheduler.createHotObservable(
    onNext(230, 21),
    onNext(240, 22),
    onNext(290, 23),
    onCompleted(320)
  );

  var map = {
    1: xs,
    2: ys
  };

  var results = scheduler.startScheduler(function () {
    return Observable['case'](function () { return 1; }, map, zs);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 1),
    onNext(240, 2),
    onNext(270, 3),
    onCompleted(300)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 300)
  ]);

  reactiveAssert(t, ys.subscriptions, []);

  reactiveAssert(t, zs.subscriptions, []);

  t.end();
});

test('Observable.case two', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(240, 2),
    onNext(270, 3),
    onCompleted(300)
  );

  var ys = scheduler.createHotObservable(
    onNext(220, 11),
    onNext(250, 12),
    onNext(280, 13),
    onCompleted(310)
  );

  var zs = scheduler.createHotObservable(
    onNext(230, 21),
    onNext(240, 22),
    onNext(290, 23),
    onCompleted(320)
  );

  var map = {
    1: xs,
    2: ys
  };

  var results = scheduler.startScheduler(function () {
    return Observable['case'](function () { return 2; }, map, zs);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 11),
    onNext(250, 12),
    onNext(280, 13),
    onCompleted(310)
  ]);

  reactiveAssert(t, xs.subscriptions, []);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 310)
  ]);

  reactiveAssert(t, zs.subscriptions, []);

  t.end();
});

test('Observable.case three', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(240, 2),
    onNext(270, 3),
    onCompleted(300)
  );

  var ys = scheduler.createHotObservable(
    onNext(220, 11),
    onNext(250, 12),
    onNext(280, 13),
    onCompleted(310)
  );

  var zs = scheduler.createHotObservable(
    onNext(230, 21),
    onNext(240, 22),
    onNext(290, 23),
    onCompleted(320)
  );

  var map = {
    1: xs,
    2: ys
  };

  var results = scheduler.startScheduler(function () {
    return Observable['case'](function () { return 3; }, map, zs);
  });

  reactiveAssert(t, results.messages, [
    onNext(230, 21),
    onNext(240, 22),
    onNext(290, 23),
    onCompleted(320)
  ]);

  reactiveAssert(t, xs.subscriptions, []);

  reactiveAssert(t, ys.subscriptions, []);

  reactiveAssert(t, zs.subscriptions, [
    subscribe(200, 320)
  ]);

  t.end();
});

test('Observable.case Throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(240, 2),
    onNext(270, 3),
    onCompleted(300)
  );

  var ys = scheduler.createHotObservable(
    onNext(220, 11),
    onNext(250, 12),
    onNext(280, 13),
    onCompleted(310)
  );

  var zs = scheduler.createHotObservable(
    onNext(230, 21),
    onNext(240, 22),
    onNext(290, 23),
    onCompleted(320)
  );

  var map = {
    1: xs,
    2: ys
  };

  var results = scheduler.startScheduler(function () {
    return Observable['case'](function () { throw error; }, map, zs);
  });

  reactiveAssert(t, results.messages, [
    onError(200, error)
  ]);

  reactiveAssert(t, xs.subscriptions, []);

  reactiveAssert(t, ys.subscriptions, []);

  reactiveAssert(t, zs.subscriptions, []);

  t.end();
});

test('Observable.case with default one', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(240, 2),
    onNext(270, 3),
    onCompleted(300));

  var ys = scheduler.createHotObservable(
    onNext(220, 11),
    onNext(250, 12),
    onNext(280, 13),
    onCompleted(310));

  var map = {
    1: xs,
    2: ys
  };

  var results = scheduler.startScheduler(function () {
    return Observable['case'](function () { return 1; }, map, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 1),
    onNext(240, 2),
    onNext(270, 3),
    onCompleted(300)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 300)
  ]);

  reactiveAssert(t, ys.subscriptions, []);

  t.end();
});

test('Observable.case with default two', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(240, 2),
    onNext(270, 3),
    onCompleted(300)
  );

  var ys = scheduler.createHotObservable(
    onNext(220, 11),
    onNext(250, 12),
    onNext(280, 13),
    onCompleted(310)
  );

  var map = {
    1: xs,
    2: ys
  };

  var results = scheduler.startScheduler(function () {
    return Observable['case'](function () { return 2; }, map, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 11),
    onNext(250, 12),
    onNext(280, 13),
    onCompleted(310)
  ]);

  reactiveAssert(t, xs.subscriptions, []);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 310)
  ]);

  t.end();
});

test('case with default three', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(240, 2),
    onNext(270, 3),
    onCompleted(300));

  var ys = scheduler.createHotObservable(
    onNext(220, 11),
    onNext(250, 12),
    onNext(280, 13),
    onCompleted(310));

  var map = {
    1: xs,
    2: ys
  };

  var results = scheduler.startScheduler(function () {
    return Observable['case'](function () { return 3; }, map, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(201)
  ]);

  reactiveAssert(t, xs.subscriptions, []);

  reactiveAssert(t, ys.subscriptions, []);

  t.end();
});

test('Observable.case with default throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(240, 2),
    onNext(270, 3),
    onCompleted(300));

  var ys = scheduler.createHotObservable(
    onNext(220, 11),
    onNext(250, 12),
    onNext(280, 13),
    onCompleted(310));

  var map = {
    1: xs,
    2: ys
  };
  var results = scheduler.startScheduler(function () {
    return Observable['case'](function () { throw error; }, map, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(200, error)
  ]);

  reactiveAssert(t, xs.subscriptions, []);

  reactiveAssert(t, ys.subscriptions, []);

  t.end();
});
