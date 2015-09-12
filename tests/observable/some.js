(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('some');

  var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted;

  test('some predicate empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.some(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(250, false),
      onCompleted(250)
    );
  });

  test('some predicate return', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.some(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(210, true),
      onCompleted(210)
    );
  });

  test('some predicate return not match', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, -2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.some(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(250, false),
      onCompleted(250)
    );
  });

  test('some predicate SomeNoneMatch', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, -2),
      onNext(220, -3),
      onNext(230, -4),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.some(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(250, false),
      onCompleted(250)
    );
  });

  test('some predicate some match', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, -2),
      onNext(220, 3),
      onNext(230, -4),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.some(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(220, true),
      onCompleted(220)
    );
  });

  test('some predicate throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.some(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

  test('some predicate throws error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, -2),
      onNext(220, 3),
      onNext(230, -4),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.some(function () { throw error; });
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

  test('some predicate never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.some(function (x) { return x > 0; });
    });

    results.messages.assertEqual();
  });
}());
