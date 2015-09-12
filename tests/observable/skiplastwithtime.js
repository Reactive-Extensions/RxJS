(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('skipLastWithTime');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('skipLastWithTime zero 1', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onCompleted(230)
    );

    var results = scheduler.startScheduler(function () {
      return xs.skipLastWithTime(0, scheduler);
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

  test('skipLastWithTime zero 2', function () {

      var scheduler = new TestScheduler();
      var xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(230));
      var results = scheduler.startScheduler(function () {
          return xs.skipLastWithTime(0, scheduler);
      });
      results.messages.assertEqual(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(230));
      xs.subscriptions.assertEqual(subscribe(200, 230));
  });

  test('skipLastWithTime some 1', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onNext(230, 3),
      onCompleted(230)
    );

    var results = scheduler.startScheduler(function () {
      return xs.skipLastWithTime(15, scheduler);
    });

    results.messages.assertEqual(
      onNext(230, 1),
      onCompleted(230)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 230)
    );
  });

  test('skipLastWithTime some 2', function () {
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
      return xs.skipLastWithTime(45, scheduler);
    });

    results.messages.assertEqual(
      onNext(260, 1),
      onNext(270, 2),
      onNext(280, 3),
      onNext(290, 4),
      onNext(300, 5),
      onCompleted(300)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 300)
    );
  });

  test('SkipLast_Some all', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onCompleted(230)
    );

    var results = scheduler.startScheduler(function () {
      return xs.skipLastWithTime(45, scheduler);
    });

    results.messages.assertEqual(
      onCompleted(230)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 230)
    );
  });

  test('skipLastWithTime error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onError(210, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.skipLastWithTime(45, scheduler);
    });

    results.messages.assertEqual(
      onError(210, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 210)
    );
  });

  test('skipLastWithTimeNever', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable();

    var results = scheduler.startScheduler(function () {
      return xs.skipLastWithTime(50, scheduler);
    });

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

}());
