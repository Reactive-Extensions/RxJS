/* jshint undef: true, unused: true */
/* globals QUnit, test, Rx */

(function () {
  QUnit.module('delay');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('delay relative time simple 1', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onCompleted(550));

    var results = scheduler.startScheduler(function () {
      return xs.delay(100, scheduler);
    });

    results.messages.assertEqual(
      onNext(350, 2),
      onNext(450, 3),
      onNext(550, 4),
      onCompleted(650));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('delay absolute time simple 1 implementation', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onCompleted(550));

    var results = scheduler.startScheduler(function () {
      return xs.delay(new Date(300), scheduler);
    });

    results.messages.assertEqual(
      onNext(350, 2),
      onNext(450, 3),
      onNext(550, 4),
      onCompleted(650));

    xs.subscriptions.assertEqual(subscribe(200, 550));
  });

  test('delay relative time simple 2 implementation', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onCompleted(550));

    var results = scheduler.startScheduler(function () {
      return xs.delay(50, scheduler);
    });

    results.messages.assertEqual(
      onNext(300, 2),
      onNext(400, 3),
      onNext(500, 4),
      onCompleted(600));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
});

  test('delay absolute time simple 2 implementation', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onCompleted(550));

    var results = scheduler.startScheduler(function () {
      return xs.delay(new Date(250), scheduler);
    });

    results.messages.assertEqual(
      onNext(300, 2),
      onNext(400, 3),
      onNext(500, 4),
      onCompleted(600));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('delay relative time simple 3 implementation', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onCompleted(550));

    var results = scheduler.startScheduler(function () {
      return xs.delay(150, scheduler);
    });

    results.messages.assertEqual(
      onNext(400, 2),
      onNext(500, 3),
      onNext(600, 4),
      onCompleted(700));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('delay absolute time simple 3 implementation', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onCompleted(550));

    var results = scheduler.startScheduler(function () {
      return xs.delay(new Date(350), scheduler);
    });

    results.messages.assertEqual(
      onNext(400, 2),
      onNext(500, 3),
      onNext(600, 4),
      onCompleted(700));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('delay relative time error 1 implementation', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onError(550, error));

    var results = scheduler.startScheduler(function () {
      return xs.delay(50, scheduler);
    });

    results.messages.assertEqual(
      onNext(300, 2),
      onNext(400, 3),
      onNext(500, 4),
      onError(550, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('delay absolute time error 1 implementation', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onError(550, error));

    var results = scheduler.startScheduler(function () {
      return xs.delay(new Date(250), scheduler);
    });
    results.messages.assertEqual(
      onNext(300, 2),
      onNext(400, 3),
      onNext(500, 4),
      onError(550, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('delay relative time error 2 implementation', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onError(550, error));

    var results = scheduler.startScheduler(function () {
      return xs.delay(150, scheduler);
    });

    results.messages.assertEqual(
      onNext(400, 2),
      onNext(500, 3),
      onError(550, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('delay absolute time error 2 implementation', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onError(550, error));

    var results = scheduler.startScheduler(function () {
      return xs.delay(new Date(350), scheduler);
    });

    results.messages.assertEqual(
      onNext(400, 2),
      onNext(500, 3),
      onError(550, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('delay empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(550));

    var results = scheduler.startScheduler(function () {
      return xs.delay(10, scheduler);
    });

    results.messages.assertEqual(
      onCompleted(560));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('delay error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(550, error));

    var results = scheduler.startScheduler(function () {
      return xs.delay(10, scheduler);
    });

    results.messages.assertEqual(onError(550, error));

    xs.subscriptions.assertEqual(subscribe(200, 550));
  });

  test('delay never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1));

    var results = scheduler.startScheduler(function () {
      return xs.delay(10, scheduler);
    });

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(
      subscribe(200, 1000));
  });

}());
