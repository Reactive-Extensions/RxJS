(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, ok */
  QUnit.module('takeUntil');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('takeUntil preempt some data next', function () {
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
      return l.takeUntil(r);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(220, 3),
      onCompleted(225)
    );
  });

  test('takeUntil preempt some data error', function () {
    var error = new Error();

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
      onError(225, error)
    );

    var results = scheduler.startScheduler(function () {
      return l.takeUntil(r);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(220, 3),
      onError(225, error)
    );
  });

  test('takeUntil no preempt some data empty', function () {
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
      return l.takeUntil(r);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );
  });

  test('takeUntil no preempt some data never', function () {
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
      return l.takeUntil(r);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );
  });

  test('takeUntil preempt never next', function () {
    var scheduler = new TestScheduler();

    var l = Observable.never();

    var r = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(225, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return l.takeUntil(r);
    });

    results.messages.assertEqual(
      onCompleted(225)
    );
  });

  test('takeUntil preempt never error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var l = Observable.never();

    var r = scheduler.createHotObservable(
      onNext(150, 1),
      onError(225, error)
    );

    var results = scheduler.startScheduler(function () {
      return l.takeUntil(r);
    });

    results.messages.assertEqual(
      onError(225, error)
    );
  });

  test('takeUntil no preempt never empty', function () {
    var scheduler = new TestScheduler();

    var l = Observable.never();

    var r = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(225)
    );

    var results = scheduler.startScheduler(function () {
      return l.takeUntil(r);
    });

    results.messages.assertEqual();
  });

  test('takeUntil no preempt never never', function () {
    var scheduler = new TestScheduler();

    var l = Observable.never();

    var r = Observable.never();

    var results = scheduler.startScheduler(function () {
      return l.takeUntil(r);
    });

    results.messages.assertEqual();
  });

  test('takeUntil preempt before first produced', function () {
    var scheduler = new TestScheduler();

    var l = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(230, 2),
      onCompleted(240)
    );

    var r = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(220)
    );

    var results = scheduler.startScheduler(function () {
      return l.takeUntil(r);
    });

    results.messages.assertEqual(
      onCompleted(210)
    );
  });

  test('takeUntil preempt before first produced remain silent and proper disposed', function () {
    var scheduler = new TestScheduler();

    var sourceNotDisposed = false;

    var l = scheduler.createHotObservable(
      onNext(150, 1),
      onError(215, new Error()),
      onCompleted(240)
    ).tap(function () { sourceNotDisposed = true; });

    var r = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(220)
    );

    var results = scheduler.startScheduler(function () {
      return l.takeUntil(r);
    });

    results.messages.assertEqual(
      onCompleted(210)
    );

    ok(!sourceNotDisposed);
  });

  test('takeUntil no preempt after last produced proper disposed signal', function () {
    var scheduler = new TestScheduler();

    var signalNotDisposed = false;

    var l = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(230, 2),
      onCompleted(240)
    );

    var r = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onCompleted(260)
    ).tap(function () { signalNotDisposed = true; });

    var results = scheduler.startScheduler(function () {
      return l.takeUntil(r);
    });

    results.messages.assertEqual(
      onNext(230, 2),
      onCompleted(240)
    );

    ok(!signalNotDisposed);
  });

}());
