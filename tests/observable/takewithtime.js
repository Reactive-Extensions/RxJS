(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('takeWithTime');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('takeWithTime zero', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onCompleted(230)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeWithTime(0, scheduler);
    });

    results.messages.assertEqual(
      onCompleted(201)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 201)
    );
  });

  test('takeWithTime some', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onNext(230, 3),
      onCompleted(240)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeWithTime(25, scheduler);
    });

    results.messages.assertEqual(
      onNext(210, 1),
      onNext(220, 2),
      onCompleted(225)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 225)
    );
  });

  test('takeWithTime late', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onCompleted(230)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeWithTime(50, scheduler);
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

  test('takeWithTime error', function () {
    var scheduler = new TestScheduler();

    var error = new Error();

    var xs = scheduler.createHotObservable(
      onError(210, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeWithTime(50, scheduler);
    });

    results.messages.assertEqual(
      onError(210, error)
    );

    xs.subscriptions.assertEqual(subscribe(200, 210));
  });

  test('takeWithTime never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable();

    var results = scheduler.startScheduler(function () {
      return xs.takeWithTime(50, scheduler);
    });

    results.messages.assertEqual(
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );
  });

  test('takeWithTime twice 1', function () {
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
      return xs.takeWithTime(55, scheduler).takeWithTime(35, scheduler);
    });

    results.messages.assertEqual(
      onNext(210, 1),
      onNext(220, 2),
      onNext(230, 3),
      onCompleted(235)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 235)
    );
  });

  test('takeWithTime twice 2', function () {
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
      return xs.takeWithTime(35, scheduler).takeWithTime(55, scheduler);
    });

    results.messages.assertEqual(
      onNext(210, 1),
      onNext(220, 2),
      onNext(230, 3),
      onCompleted(235)
    );

    xs.subscriptions.assertEqual(subscribe(200, 235));
  });

}());
