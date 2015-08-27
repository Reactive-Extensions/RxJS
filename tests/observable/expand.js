(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('Expand');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('expand empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onCompleted(300));

    var results = scheduler.startScheduler(function () {
      return xs.expand(function () {
        return scheduler.createColdObservable(
          onNext(100, 1),
          onNext(200, 2),
          onCompleted(300));
      }, scheduler);
    });

    results.messages.assertEqual(
      onCompleted(300));

    xs.subscriptions.assertEqual(
      subscribe(201, 300));
  });

  test('expand error', function () {
    var scheduler = new TestScheduler();
    var error = new Error();

    var xs = scheduler.createHotObservable(
      onError(300, error));

    var results = scheduler.startScheduler(function () {
      return xs.expand(function (x) {
        return scheduler.createColdObservable(
          onNext(100 + x, 2 * x),
          onNext(200 + x, 3 * x),
          onCompleted(300 + x));
      }, scheduler);
    });

    results.messages.assertEqual(
      onError(300, error));

    xs.subscriptions.assertEqual(
      subscribe(201, 300));
  });

  test('expand never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable();

    var results = scheduler.startScheduler(function () {
      return xs.expand(function (x) {
        return scheduler.createColdObservable(
          onNext(100 + x, 2 * x),
          onNext(200 + x, 3 * x),
          onCompleted(300 + x));
      }, scheduler);
    });

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(
      subscribe(201, 1000));
  });

  test('expand basic', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(550, 1),
      onNext(850, 2),
      onCompleted(950));

    var results = scheduler.startScheduler(function () {
      return xs.expand(function (x) {
        return scheduler.createColdObservable(
          onNext(100, 2 * x),
          onNext(200, 3 * x),
          onCompleted(300));
      }, scheduler);
    });

    results.messages.assertEqual(
      onNext(550, 1),
      onNext(651, 2),
      onNext(751, 3),
      onNext(752, 4),
      onNext(850, 2),
      onNext(852, 6),
      onNext(852, 6),
      onNext(853, 8),
      onNext(951, 4),
      onNext(952, 9),
      onNext(952, 12),
      onNext(953, 12),
      onNext(953, 12),
      onNext(954, 16));

    xs.subscriptions.assertEqual(
      subscribe(201, 950));
  });

  test('expand throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(550, 1),
      onNext(850, 2),
      onCompleted(950));

    var results = scheduler.startScheduler(function () {
      return xs.expand(function () {
        throw error;
      }, scheduler);
    });

    results.messages.assertEqual(
      onNext(550, 1),
      onError(550, error));

    xs.subscriptions.assertEqual(
      subscribe(201, 550));
  });

}());
