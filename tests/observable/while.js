(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('while');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('while always false', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(50, 1),
      onNext(100, 2),
      onNext(150, 3),
      onNext(200, 4),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return Observable['while'](function () {
        return false;
      }, xs);
    });

    results.messages.assertEqual(
      onCompleted(200)
    );

    xs.subscriptions.assertEqual();
  });

  test('while always true', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(50, 1),
      onNext(100, 2),
      onNext(150, 3),
      onNext(200, 4),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return Observable['while'](function () {
        return true;
      }, xs);
    });

    results.messages.assertEqual(
      onNext(250, 1),
      onNext(300, 2),
      onNext(350, 3),
      onNext(400, 4),
      onNext(500, 1),
      onNext(550, 2),
      onNext(600, 3),
      onNext(650, 4),
      onNext(750, 1),
      onNext(800, 2),
      onNext(850, 3),
      onNext(900, 4)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 450),
      subscribe(450, 700),
      subscribe(700, 950),
      subscribe(950, 1000)
    );
  });

  test('while always true throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onError(50, error)
    );

    var results = scheduler.startScheduler(function () {
      return Observable['while'](function () {
        return true;
      }, xs);
    });

    results.messages.assertEqual(
      onError(250, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );
  });

  test('while always true infinite', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(onNext(50, 1));

    var results = scheduler.startScheduler(function () {
      return Observable['while'](function () {
        return true;
      }, xs);
    });

    results.messages.assertEqual(
      onNext(250, 1)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

  test('while sometimes true', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(50, 1),
      onNext(100, 2),
      onNext(150, 3),
      onNext(200, 4),
      onCompleted(250)
    );

    var n = 0;

    var results = scheduler.startScheduler(function () {
      return Observable['while'](function () {
        return ++n < 3;
      }, xs);
    });

    results.messages.assertEqual(
      onNext(250, 1),
      onNext(300, 2),
      onNext(350, 3),
      onNext(400, 4),
      onNext(500, 1),
      onNext(550, 2),
      onNext(600, 3),
      onNext(650, 4),
      onCompleted(700)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 450),
      subscribe(450, 700)
    );
  });

  test('while sometimes throws', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(50, 1),
      onNext(100, 2),
      onNext(150, 3),
      onNext(200, 4),
      onCompleted(250)
    );

    var n = 0;

    var error = new Error();

    var results = scheduler.startScheduler(function () {
      return Observable['while'](function () {
        if (++n < 3) { return true; }
        throw error;
      }, xs);
    });

    results.messages.assertEqual(
      onNext(250, 1),
      onNext(300, 2),
      onNext(350, 3),
      onNext(400, 4),
      onNext(500, 1),
      onNext(550, 2),
      onNext(600, 3),
      onNext(650, 4),
      onError(700, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 450),
      subscribe(450, 700)
    );
  });

}());
