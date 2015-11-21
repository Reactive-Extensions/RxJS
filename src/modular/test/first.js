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
  first: require('../observable/first')
});

// First Async
test('Observable#first empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.first();
  });

  reactiveAssert(t, results.messages, [
    onError(250, function (n) { return n.error instanceof EmptyError; })
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#first default', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(
    function () {
      return xs.first({defaultValue: 42});
    });

  reactiveAssert(t, results.messages, [
    onNext(250, 42),
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#first one', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.first();
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onCompleted(210)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 210)
  ]);

  t.end();
});

test('Observable#first many', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.first();
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onCompleted(210)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 210)
  ]);

  t.end();
});

test('Observable#first Error', function (t) {
  var ex = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, ex)
  );

  var results = scheduler.startScheduler(function () {
    return xs.first();
  });

  reactiveAssert(t, results.messages, [
    onError(210, ex)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 210)
  ]);

  t.end();
});

test('Observable#first predicate', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.first(function (x) {
      return x % 2 === 1;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 3), onCompleted(220)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 220)
  ]);

  t.end();
});

test('Observable#first Predicate Obj', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.first({
      predicate: function (x) {
        return x % 2 === 1;
      }
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 3), onCompleted(220)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 220)
  ]);

  t.end();
});

test('Observable#first Predicate thisArg', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.first(function (x) {
      t.equal(this, 42);
      return x % 2 === 1;
    }, 42);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 3),
    onCompleted(220)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 220)
  ]);

  t.end();
});

test('Observable#first Predicate Obj thisArg', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.first({
      predicate: function (x) {
        t.equal(this, 42);
        return x % 2 === 1;
      },
      thisArg: 42
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 3),
    onCompleted(220)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 220)
  ]);

  t.end();
});

test('Observable#first Predicate None', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.first(function (x) {
      return x > 10;
    });
  });

  reactiveAssert(t, results.messages, [
    onError(250, function (n) { return n.error instanceof EmptyError; })
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#first Predicate Obj None', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.first({
      predicate: function (x) {
        return x > 10;
      }
    });
  });

  reactiveAssert(t, results.messages, [
    onError(250, function (n) { return n.error instanceof EmptyError; })
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#first Predicate Obj None Default', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.first({
      predicate: function (x) {
        return x > 10;
      },
      defaultValue: 42
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 42), onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#first Predicate Error', function (t) {
  var ex = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(220, ex)
  );

  var results = scheduler.startScheduler(function () {
    return xs.first(function (x) {
      return x % 2 === 1;
    });
  });

  reactiveAssert(t, results.messages, [
    onError(220, ex)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 220)
  ]);

  t.end();
});

test('Observable#first PredicateThrows', function (t) {
  var ex = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.first(function (x) {
      if (x < 4) {
        return false;
      } else {
        throw ex;
      }
    });
  });

  reactiveAssert(t, results.messages, [
    onError(230, ex)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 230)
  ]);

  t.end();
});
