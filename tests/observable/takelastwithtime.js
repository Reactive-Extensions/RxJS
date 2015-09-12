(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('takeLastWithTime');

  var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

  test('takeLastWithTime zero 1', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onCompleted(230));

    var results = scheduler.startScheduler(function () {
      return xs.takeLastWithTime(0, scheduler);
    });

    results.messages.assertEqual(onCompleted(230));

    xs.subscriptions.assertEqual(subscribe(200, 230));
  });

  test('takeLastWithTime zero 2', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onNext(230, 3),
      onCompleted(230)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeLastWithTime(0, scheduler);
    });

    results.messages.assertEqual(onCompleted(230));

    xs.subscriptions.assertEqual(subscribe(200, 230));
  });

  test('takeLastWithTime some 1', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onNext(230, 3),
      onCompleted(240)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeLastWithTime(25, scheduler);
    });

    results.messages.assertEqual(
      onNext(240, 2),
      onNext(240, 3),
      onCompleted(240)
    );

    xs.subscriptions.assertEqual(subscribe(200, 240));
  });

  test('takeLastWithTime some 2', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onNext(230, 3),
      onCompleted(300)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeLastWithTime(25, scheduler);
    });

    results.messages.assertEqual(
      onCompleted(300)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 300)
    );
  });

  test('takeLastWithTime some 3', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onNext(230, 3),
      onNext(240, 4),
      onNext(250, 5),
      onNext(260, 6),
      onNext(270, 7),
      onNext(280, 8),
      onNext(290, 9),
      onCompleted(300)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeLastWithTime(45, scheduler);
    });

    results.messages.assertEqual(
      onNext(300, 6),
      onNext(300, 7),
      onNext(300, 8),
      onNext(300, 9),
      onCompleted(300)
    );

    xs.subscriptions.assertEqual(subscribe(200, 300));
  });

  test('takeLastWithTime some 4', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(240, 2),
      onNext(250, 3),
      onNext(280, 4),
      onNext(290, 5),
      onNext(300, 6),
      onCompleted(350)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeLastWithTime(25, scheduler);
    });

    results.messages.assertEqual(
      onCompleted(350)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 350)
    );
  });

  test('takeLastWithTime all', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onCompleted(230)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeLastWithTime(50, scheduler);
    });

    results.messages.assertEqual(
      onNext(230, 1),
      onNext(230, 2),
      onCompleted(230)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 230)
    );
  });

  test('takeLastWithTime error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onError(210, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeLastWithTime(50, scheduler);
    });

    results.messages.assertEqual(
      onError(210, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 210)
    );
  });

  test('takeLastWithTime never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable();

    var results = scheduler.startScheduler(function () {
      return xs.takeLastWithTime(50, scheduler);
    });

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

}());
