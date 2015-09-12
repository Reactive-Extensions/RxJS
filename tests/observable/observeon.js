(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('observeOn');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('observeOn normal', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.observeOn(scheduler);
    });

    results.messages.assertEqual(
      onNext(211, 2),
      onCompleted(251));

    xs.subscriptions.assertEqual(
      subscribe(200, 251));
  });

  test('observeOn Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();


    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.observeOn(scheduler);
    });

    results.messages.assertEqual(
      onError(211, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 211)
    );
  });

  test('observeOn empty', function () {
      var scheduler = new TestScheduler();

      var xs = scheduler.createHotObservable(
        onNext(150, 1),
        onCompleted(250)
      );

      var results = scheduler.startScheduler(function () {
        return xs.observeOn(scheduler);
      });

      results.messages.assertEqual(
        onCompleted(251)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 251)
      );
  });

  test('observeOn never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.observeOn(scheduler);
    });

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

}());
