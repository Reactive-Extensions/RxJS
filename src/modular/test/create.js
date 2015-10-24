'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var Observable = require('../observable');
var Disposable = require('../disposable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
    onError = ReactiveTest.onError,
    onCompleted = ReactiveTest.onCompleted;

Observable.addToObject({
  create: require('../observable/create')
});

function noop () { }

test('create next', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.create(function (o) {
      o.onNext(1);
      o.onNext(2);
      return Disposable.empty;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(200, 1),
    onNext(200, 2)
  ]);
  t.end();
});

test('create completed', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.create(function (o) {
      o.onCompleted();
      o.onNext(100);
      o.onError(new Error());
      o.onCompleted();
      return Disposable.empty;
    });
  });

  reactiveAssert(t, results.messages, [
    onCompleted(200)
  ]);
  t.end();
});

test('create Error', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error();

  var results = scheduler.startScheduler(function () {
    return Observable.create(function (o) {
      o.onError(error);
      o.onNext(100);
      o.onError(new Error());
      o.onCompleted();
      return Disposable.empty;
    });
  });

  reactiveAssert(t, results.messages, [
    onError(200, error)
  ]);
  t.end();
});

test('create noop next', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.create(function (o) {
      o.onNext(1);
      o.onNext(2);
      return noop;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(200, 1),
    onNext(200, 2)
  ]);
  t.end();
});

test('create no op completed', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.create(function (o) {
      o.onCompleted();
      o.onNext(100);
      o.onError(new Error());
      o.onCompleted();
      return noop;
    });
  });

  reactiveAssert(t, results.messages, [
    onCompleted(200)
  ]);
  t.end();
});

test('create no op Error', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error();

  var results = scheduler.startScheduler(function () {
    return Observable.create(function (o) {
      o.onError(error);
      o.onNext(100);
      o.onError('foo');
      o.onCompleted();
      return noop;
    });
  });

  reactiveAssert(t, results.messages, [
    onError(200, error)
  ]);
  t.end();
});

test('create throws errors', function (t) {
  t.throws(function () {
    Observable.create(function () { throw new Error(); }).subscribe();
  });
});

test('create dispose', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.create(function (o) {
      var isStopped = false;

      o.onNext(1);
      o.onNext(2);

      scheduler.scheduleFuture(null, 600, function () {
        !isStopped && o.onNext(3);
      });

      scheduler.scheduleFuture(null, 700, function () {
        !isStopped && o.onNext(4);
      });

      scheduler.scheduleFuture(null, 900, function () {
        !isStopped && o.onNext(5);
      });

      scheduler.scheduleFuture(null, 1100, function () {
        !isStopped && o.onNext(6);
      });

      return function () { isStopped = true; };
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(200, 1),
    onNext(200, 2),
    onNext(800, 3),
    onNext(900, 4)
  ]);
  t.end();
});

test('create observer does not catch', function (t) {
  t.throws(function () {
    Observable.create(function (o) { o.onNext(1); })
      .subscribe(function () { throw new Error(); });
  });

  t.throws(function () {
    Observable.create(function (o) { o.onError(new Error()); })
      .subscribe(noop, function () { throw new Error(); });
  });

  t.throws(function () {
    Observable.create(function (o) { o.onCompleted(); })
      .subscribe(noop, noop, function () { throw new Error(); });
  });
  
  t.end();
});
