(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('doWhile');

  var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

  test('doWhile always false', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(50, 1),
      onNext(100, 2),
      onNext(150, 3),
      onNext(200, 4),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.doWhile(function () {
        return false;
      });
    });

    results.messages.assertEqual(
      onNext(250, 1),
      onNext(300, 2),
      onNext(350, 3),
      onNext(400, 4),
      onCompleted(450)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 450)
    );
  });

  test('doWhile always true', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(50, 1),
      onNext(100, 2),
      onNext(150, 3),
      onNext(200, 4),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.doWhile(function () {
        return true;
      });
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

  test('doWhile always true throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onError(50, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.doWhile(function () {
        return true;
      });
    });

    results.messages.assertEqual(
      onError(250, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );
  });

  test('doWhile always true infinite', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(50, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.doWhile(function () {
        return true;
      });
    });

    results.messages.assertEqual(
      onNext(250, 1)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

  test('doWhile sometimes true', function () {
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
      return xs.doWhile(function () {
        return ++n < 3;
      });
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
      onNext(900, 4),
      onCompleted(950)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 450),
      subscribe(450, 700),
      subscribe(700, 950)
    );
  });

  test('doWhile sometimes throws', function () {
    var error = new Error();

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
      return xs.doWhile(function () {
        if (++n < 3) {
          return true;
        } else {
          throw error;
        }
      });
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
      onNext(900, 4),
      onError(950, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 450),
      subscribe(450, 700),
      subscribe(700, 950)
    );
  });

}());
