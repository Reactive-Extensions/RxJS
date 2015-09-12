(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, ok */
  QUnit.module('skipUntil');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('skipUntil some data next', function () {
    var scheduler = new TestScheduler();

    var l = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var r = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(225, 99),
      onCompleted(230)
    );

    var results = scheduler.startScheduler(function () {
      return l.skipUntil(r);
    });
    results.messages.assertEqual(
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );
  });

  test('skipUntil some data error', function () {
    var scheduler = new TestScheduler();

    var error = new Error();

    var l = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var r = scheduler.createHotObservable(
      onNext(150, 1),
      onError(225, error)
    );

    var results = scheduler.startScheduler(function () {
      return l.skipUntil(r);
    });

    results.messages.assertEqual(
      onError(225, error)
    );
  });

  test('skipUntil some data empty', function () {
    var scheduler = new TestScheduler();

    var l = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var r = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(225)
    );

    var results = scheduler.startScheduler(function () {
      return l.skipUntil(r);
    });

    results.messages.assertEqual();
  });

  test('skipUntil never next', function () {
    var scheduler = new TestScheduler();

    var l = Observable.never();

    var r = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(225, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return l.skipUntil(r);
    });

    results.messages.assertEqual();
  });

  test('skipUntil never error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var l = Observable.never();

    var r = scheduler.createHotObservable(
      onNext(150, 1),
      onError(225, error));

    var results = scheduler.startScheduler(function () {
      return l.skipUntil(r);
    });

    results.messages.assertEqual(
      onError(225, error)
    );
  });

  test('skipUntil some data Never', function () {
    var scheduler = new TestScheduler();

    var l = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var r = Observable.never();

    var results = scheduler.startScheduler(function () {
      return l.skipUntil(r);
    });

    results.messages.assertEqual();
  });

  test('skipUntil never empty', function () {
    var scheduler = new TestScheduler();

    var l = Observable.never();

    var r = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(225)
    );

    var results = scheduler.startScheduler(function () {
      return l.skipUntil(r);
    });

    results.messages.assertEqual();
  });

  test('skipUntil never never', function () {
    var scheduler = new TestScheduler();

    var l = Observable.never();

    var r = Observable.never();

    var results = scheduler.startScheduler(function () {
      return l.skipUntil(r);
    });

    results.messages.assertEqual();
  });

  test('SkipUntil has completed causes disposal', function () {
    var scheduler = new TestScheduler();

    var disposed = false;

    var l = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var r = Observable.create(function () {
      return function () { disposed = true; };
    });

    var results = scheduler.startScheduler(function () {
      return l.skipUntil(r);
    });

    results.messages.assertEqual();

    ok(disposed);
  });

}());
