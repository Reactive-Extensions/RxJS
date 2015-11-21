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
  last: require('../observable/last')
});

test('Observable#last empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.last();
  });

  reactiveAssert(t, results.messages, [
    onError(250, function (n) { return n.error instanceof EmptyError; })
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#last default value', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.last({defaultValue: 42});
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

test('Observable#last one', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.last();
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

test('Observable#last many', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.last();
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

test('Observable#last error', function (t) {
  var ex = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, ex)
  );

  var results = scheduler.startScheduler(function () {
    return xs.last();
  });

  reactiveAssert(t, results.messages, [
    onError(210, ex)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 210)
  ]);

  t.end();
});

test('Observable#last predicate', function (t) {
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
    return xs.last(function (x) {
      return x % 2 === 1;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 5),
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#last obj predicate', function (t) {
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
    return xs.last({
      predicate: function (x) {
        return x % 2 === 1;
      }
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 5),
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#last predicate thisArg', function (t) {
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
    return xs.last(function (x) {
      t.equal(this, 42);
      return x % 2 === 1;
    }, 42);
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 5),
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#last obj predicate', function (t) {
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
    return xs.last({
      predicate: function (x) {
        t.equal(this, 42);
        return x % 2 === 1;
      },
      thisArg: 42
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(250, 5),
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#last predicate None', function (t) {
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
    return xs.last(function (x) {
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

test('Observable#last obj predicate none default', function (t) {
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
    return xs.last({
      predicate: function (x) {
        return x > 10;
      },
      defaultValue: 42
    });
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

test('Observable#last predicate throw', function (t) {
  var ex = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, ex)
  );

  var results = scheduler.startScheduler(function () {
    return xs.last(function (x) {
      return x % 2 === 1;
    });
  });

  reactiveAssert(t, results.messages, [
    onError(210, ex)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 210)
  ]);

  t.end();
});

test('Observable#last predicate throws', function (t) {
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
    return xs.last(function (x) {
      if (x < 4) {
        return x % 2 === 1;
      }
      throw ex;
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
