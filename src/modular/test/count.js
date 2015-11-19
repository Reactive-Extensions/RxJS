'use strict';

var test = require('tape');
var Observable = require('../observable');
var range = require('../observable/range');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe;

Observable.addToPrototype({
  count: require('../observable/count'),
  skip: require('../observable/skip'),
  take: require('../observable/take')
});

test('Observable#count empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.count();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 0),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#count some', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.count();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 3),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#count throw', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.count();
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('Observable#count never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.count();
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable#count predicate empty true', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.count(function () { return true; });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 0),
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#count predicate empty false', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.count(function () { return false; });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 0),
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#count predicate return true', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.count(function () { return true; });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 1), onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#count predicate return false', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.count(function () { return false; });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 0),
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#count predicate all matched', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.count(function (x) { return x < 10; });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 3),
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#count predicate none matched', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.count(function (x) { return x > 10; });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 0),
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#count predicate some even', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.count(function (x) { return x % 2 === 0; });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 2),
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#count predicate throw true', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.count(function () { return true; });
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 210)
  ]);

  t.end();
});

test('Observable#count predicate throw false', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.count(function () { return false; });
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 210)
  ]);

  t.end();
});

test('Observable#count predicate never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1));

  var results = scheduler.startScheduler(function () {
    return xs.count(function () { return true; });
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable#count predicate throws error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(230, 3),
    onCompleted(240)
  );

  var results = scheduler.startScheduler(function () {
    return xs.count(function (x) {
      if (x === 3) { throw error; }
      return true;
    });
  });

  reactiveAssert(t, results.messages, [
    onError(230, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 230)
  ]);

  t.end();
});

test('Observable#count after range', function (t) {
  var scheduler = new TestScheduler();

  var xs = range(1, 10, scheduler);

  var results = scheduler.startScheduler(function(){
    return xs.count();
  });

  reactiveAssert(t, results.messages, [
    onNext(211, 10),
    onCompleted(211)
  ]);

  t.end();
});

test('Observable#count After Skip', function (t) {
  var scheduler = new TestScheduler();

  var xs = range(1, 10, scheduler).skip(1);

  var results = scheduler.startScheduler(function () {
    return xs.count();
  });

  reactiveAssert(t, results.messages, [
    onNext(211, 9),
    onCompleted(211)
  ]);

  t.end();
});

test('Observable#count after take', function (t) {
  var scheduler = new TestScheduler();

  var xs = range(1, 10, scheduler).take(1);

  var results = scheduler.startScheduler(function(){
    return xs.count();
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 1),
    onCompleted(201)
  ]);

  t.end();
});
