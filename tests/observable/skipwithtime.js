(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('skipWithTime');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('skipWithTime zero', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2), onCompleted(230));

    var results = scheduler.startScheduler(function () {
      return xs.skipWithTime(0, scheduler);
    });

    results.messages.assertEqual(
      onNext(210, 1),
      onNext(220, 2),
      onCompleted(230)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 230)
    );
  });

  test('skipWithTime some', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onCompleted(230)
    );

    var results = scheduler.startScheduler(function () {
      return xs.skipWithTime(15, scheduler);
    });

    results.messages.assertEqual(
      onNext(220, 2),
      onCompleted(230)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 230)
    );
  });

  test('skipWithTime late', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onCompleted(230));

    var results = scheduler.startScheduler(function () {
      return xs.skipWithTime(50, scheduler);
    });

    results.messages.assertEqual(
      onCompleted(230)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 230)
    );
  });

  test('skipWithTime error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onError(210, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.skipWithTime(50, scheduler);
    });

    results.messages.assertEqual(
      onError(210, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 210)
    );
  });

  test('skipWithTime never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable();

    var results = scheduler.startScheduler(function () {
      return xs.skipWithTime(50, scheduler);
    });

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

  test('skipWithTime twice 1', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onNext(230, 3),
      onNext(240, 4),
      onNext(250, 5),
      onNext(260, 6),
      onCompleted(270)
    );

    var results = scheduler.startScheduler(function () {
      return xs.skipWithTime(15, scheduler).skipWithTime(30, scheduler);
    });

    results.messages.assertEqual(
      onNext(240, 4),
      onNext(250, 5),
      onNext(260, 6),
      onCompleted(270)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 270)
    );
  });

  test('skipWithTime twice 2', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onNext(230, 3),
      onNext(240, 4),
      onNext(250, 5),
      onNext(260, 6),
      onCompleted(270)
    );

    var results = scheduler.startScheduler(function () {
      return xs.skipWithTime(30, scheduler).skipWithTime(15, scheduler);
    });

    results.messages.assertEqual(
      onNext(240, 4),
      onNext(250, 5),
      onNext(260, 6),
      onCompleted(270)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 270)
    );
  });

}());
