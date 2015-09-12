(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('skipLast');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('skipLast zero completed', function () {
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
      return xs.skipLast(0);
    });

    results.messages.assertEqual(
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

    xs.subscriptions.assertEqual(
      subscribe(200, 650)
    );
  });

  test('skipLast zero error', function () {
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
      return xs.skipLast(0);
    });

    results.messages.assertEqual(
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

    xs.subscriptions.assertEqual(
      subscribe(200, 650)
    );
  });

  test('skipLast zero disposed', function () {
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
      return xs.skipLast(0);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(250, 3),
      onNext(270, 4),
      onNext(310, 5),
      onNext(360, 6),
      onNext(380, 7),
      onNext(410, 8),
      onNext(590, 9)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

  test('skipLast one completed', function () {
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
      return xs.skipLast(1);
    });

    results.messages.assertEqual(
      onNext(250, 2),
      onNext(270, 3),
      onNext(310, 4),
      onNext(360, 5),
      onNext(380, 6),
      onNext(410, 7),
      onNext(590, 8),
      onCompleted(650)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 650)
    );
  });

  test('skipLast one error', function () {
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
      return xs.skipLast(1);
    });

    results.messages.assertEqual(
      onNext(250, 2),
      onNext(270, 3),
      onNext(310, 4),
      onNext(360, 5),
      onNext(380, 6),
      onNext(410, 7),
      onNext(590, 8),
      onError(650, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 650)
    );
  });

  test('skipLast one disposed', function () {
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
      return xs.skipLast(1);
    });

    results.messages.assertEqual(
      onNext(250, 2),
      onNext(270, 3),
      onNext(310, 4),
      onNext(360, 5),
      onNext(380, 6),
      onNext(410, 7),
      onNext(590, 8)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

  test('skipLast three completed', function () {
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
      return xs.skipLast(3);
    });

    results.messages.assertEqual(
      onNext(310, 2),
      onNext(360, 3),
      onNext(380, 4),
      onNext(410, 5),
      onNext(590, 6),
      onCompleted(650)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 650)
    );
  });

  test('skipLast three error', function () {
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
      return xs.skipLast(3);
    });

    results.messages.assertEqual(
      onNext(310, 2),
      onNext(360, 3),
      onNext(380, 4),
      onNext(410, 5),
      onNext(590, 6),
      onError(650, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 650)
    );
  });

  test('skipLast three disposed', function () {
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
      return xs.skipLast(3);
    });

    results.messages.assertEqual(
      onNext(310, 2),
      onNext(360, 3),
      onNext(380, 4),
      onNext(410, 5),
      onNext(590, 6)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

}());
