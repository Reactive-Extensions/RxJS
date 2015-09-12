(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('takeLast');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('takeLast zero completed', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(180, 1),
      onNext(210, 2),
      onNext(250, 3),
      onNext(270, 4),
      onNext(310, 5),
      onNext(360, 6),
      onNext(380, 7),
      onNext(410, 8),
      onNext(590, 9),
      onCompleted(650)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeLast(0);
    });

    results.messages.assertEqual(
      onCompleted(650)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 650)
    );
  });

  test('takeLast zero error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(180, 1),
      onNext(210, 2),
      onNext(250, 3),
      onNext(270, 4),
      onNext(310, 5),
      onNext(360, 6),
      onNext(380, 7),
      onNext(410, 8),
      onNext(590, 9),
      onError(650, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeLast(0);
    });

    results.messages.assertEqual(
      onError(650, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 650)
    );
  });

  test('takeLast zero disposed', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(180, 1),
      onNext(210, 2),
      onNext(250, 3),
      onNext(270, 4),
      onNext(310, 5),
      onNext(360, 6),
      onNext(380, 7),
      onNext(410, 8),
      onNext(590, 9)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeLast(0);
    });

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

  test('takeLast one completed', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(180, 1),
      onNext(210, 2),
      onNext(250, 3),
      onNext(270, 4),
      onNext(310, 5),
      onNext(360, 6),
      onNext(380, 7),
      onNext(410, 8),
      onNext(590, 9),
      onCompleted(650)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeLast(1);
    });

    results.messages.assertEqual(
      onNext(650, 9),
      onCompleted(650)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 650)
    );
  });

  test('takeLast one error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(180, 1),
      onNext(210, 2),
      onNext(250, 3),
      onNext(270, 4),
      onNext(310, 5),
      onNext(360, 6),
      onNext(380, 7),
      onNext(410, 8),
      onNext(590, 9),
      onError(650, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeLast(1);
    });

    results.messages.assertEqual(
      onError(650, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 650)
    );
  });

  test('takeLast one disposed', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(180, 1),
      onNext(210, 2),
      onNext(250, 3),
      onNext(270, 4),
      onNext(310, 5),
      onNext(360, 6),
      onNext(380, 7),
      onNext(410, 8),
      onNext(590, 9)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeLast(1);
    });

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

  test('takeLast three completed', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(180, 1),
      onNext(210, 2),
      onNext(250, 3),
      onNext(270, 4),
      onNext(310, 5),
      onNext(360, 6),
      onNext(380, 7),
      onNext(410, 8),
      onNext(590, 9),
      onCompleted(650)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeLast(3);
    });

    results.messages.assertEqual(
      onNext(650, 7),
      onNext(650, 8),
      onNext(650, 9),
      onCompleted(650)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 650)
    );
  });

  test('takeLast three error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(180, 1),
      onNext(210, 2),
      onNext(250, 3),
      onNext(270, 4),
      onNext(310, 5),
      onNext(360, 6),
      onNext(380, 7),
      onNext(410, 8),
      onNext(590, 9),
      onError(650, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeLast(3);
    });

    results.messages.assertEqual(
      onError(650, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 650)
    );
  });

  test('takeLast three disposed', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(180, 1),
      onNext(210, 2),
      onNext(250, 3),
      onNext(270, 4),
      onNext(310, 5),
      onNext(360, 6),
      onNext(380, 7),
      onNext(410, 8),
      onNext(590, 9)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeLast(3);
    });

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

}());
