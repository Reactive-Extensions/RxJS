'use strict';

var test = require('tape');
var Observable = require('../observable');
var EmptyError = require('../internal/errors').EmptyError;
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe;

Observable.addToPrototype({
  average: require('../observable/average')
});

test('Observable#average number Empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.average();
  });

  reactiveAssert(t, results.messages, [
    onError(250, function (n) { return n.error instanceof EmptyError; })
  ]);

  t.end();
});

test('Observable#average number return', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.average();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 2),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#average number some', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 3),
    onNext(220, 4),
    onNext(230, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.average();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 3),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#average number throw', function (t) {
  var error = new Error();
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.average();
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#average number never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.average();
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable#average selector regular number', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 'b'),
    onNext(220, 'fo'),
    onNext(230, 'qux'),
    onCompleted(240)
  );

  var results = scheduler.startScheduler(function () {
    return xs.average(function (x) { return x.length; });
  });

  reactiveAssert(t, results.messages, [
    onNext(240, 2),
    onCompleted(240)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 240)
  ]);

  t.end();
});

test('Observable#average selector throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 'b'),
    onNext(220, 'fo'),
    onNext(230, 'qux'),
    onCompleted(240)
  );

  var results = scheduler.startScheduler(function () {
    return xs.average(function () { throw error; });
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 210)
  ]);

  t.end();
});
