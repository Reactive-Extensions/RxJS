(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('throttle');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('throttle completed', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(250, 3),
      onNext(310, 4),
      onNext(350, 5),
      onNext(410, 6),
      onNext(450, 7),
      onCompleted(500)
    );

    var results = scheduler.startScheduler(function () {
      return xs.throttle(200, scheduler);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(410, 6),
      onCompleted(500)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 500)
    );
  });

  test('throttle never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.throttle(200, scheduler);
    });

    results.messages.assertEqual(
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

  test('throttle empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(500)
    );

    var results = scheduler.startScheduler(function () {
      return xs.throttle(200, scheduler);
    });

    results.messages.assertEqual(
      onCompleted(500)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 500)
    );
  });

  test('throttle error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(250, 3),
      onNext(310, 4),
      onNext(350, 5),
      onError(410, error),
      onNext(450, 7),
      onCompleted(500)
    );

    var results = scheduler.startScheduler(function () {
      return xs.throttle(200, scheduler);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onError(410, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 410)
    );
  });

  test('throttle no end', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(250, 3),
      onNext(310, 4),
      onNext(350, 5),
      onNext(410, 6),
      onNext(450, 7)
    );

    var results = scheduler.startScheduler(function () {
      return xs.throttle(200, scheduler);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(410, 6)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });
}());
