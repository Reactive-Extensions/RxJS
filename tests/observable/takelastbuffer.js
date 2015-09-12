(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('takeLastBuffer');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('takeLastBuffer zero completed', function () {
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
        return xs.takeLastBuffer(0);
    });

    results.messages.assertEqual(
      onNext(650, []),
      onCompleted(650)
    );

    xs.subscriptions.assertEqual(subscribe(200, 650));
  });

  test('takeLastBuffer zero error', function () {
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
      return xs.takeLastBuffer(0);
    });

    results.messages.assertEqual(onError(650, error));

    xs.subscriptions.assertEqual(subscribe(200, 650));
  });

  test('takeLastBuffer zero disposed', function () {
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
      return xs.takeLastBuffer(0);
    });

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(subscribe(200, 1000));
  });

  test('takeLastBuffer one completed', function () {
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
      return xs.takeLastBuffer(1);
    });

    results.messages.assertEqual(
      onNext(650, [9]),
      onCompleted(650)
    );

    xs.subscriptions.assertEqual(subscribe(200, 650));
  });

  test('takeLastBuffer one error', function () {
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
        return xs.takeLastBuffer(1);
    });

    results.messages.assertEqual(onError(650, error));

    xs.subscriptions.assertEqual(subscribe(200, 650));
  });

  test('takeLastBuffer one disposed', function () {
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
      return xs.takeLastBuffer(1);
    });

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(subscribe(200, 1000));
  });

  test('takeLastBuffer three completed', function () {
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
      return xs.takeLastBuffer(3);
    });

    results.messages.assertEqual(
      onNext(650, [7, 8, 9]),
      onCompleted(650)
    );

    xs.subscriptions.assertEqual(subscribe(200, 650));
  });

  test('takeLastBuffer three error', function () {
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
        return xs.takeLastBuffer(3);
    });

    results.messages.assertEqual(onError(650, error));

    xs.subscriptions.assertEqual(subscribe(200, 650));
  });

  test('takeLastBuffer three disposed', function () {
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
        return xs.takeLastBuffer(3);
    });

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(subscribe(200, 1000));
  });

}());
