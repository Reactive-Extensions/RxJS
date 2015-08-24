/* jshint undef: true, unused: true */
/* globals QUnit, test, Rx */

(function () {
  QUnit.module('defaultIfEmpty');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('defaultIfEmpty non-empty 1', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(280, 42),
      onNext(360, 43),
      onCompleted(420));

    var results = scheduler.startScheduler(function () {
      return xs.defaultIfEmpty();
    });

    results.messages.assertEqual(
      onNext(280, 42),
      onNext(360, 43),
      onCompleted(420));

    xs.subscriptions.assertEqual(
      subscribe(200, 420));
  });

  test('defaultIfEmpty non-empty 2', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(280, 42),
      onNext(360, 43),
      onCompleted(420));

    var results = scheduler.startScheduler(function () {
      return xs.defaultIfEmpty(-1);
    });

    results.messages.assertEqual(
      onNext(280, 42),
      onNext(360, 43),
      onCompleted(420));

    xs.subscriptions.assertEqual(
      subscribe(200, 420));
  });

  test('defaultIfEmpty empty 1', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onCompleted(420));

    var results = scheduler.startScheduler(function () {
      return xs.defaultIfEmpty(null);
    });

    results.messages.assertEqual(
      onNext(420, null),
      onCompleted(420));

    xs.subscriptions.assertEqual(
      subscribe(200, 420));
  });

  test('defaultIfEmpty empty 2', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onCompleted(420));

    var results = scheduler.startScheduler(function () {
      return xs.defaultIfEmpty(-1);
    });

    results.messages.assertEqual(
      onNext(420, -1),
      onCompleted(420));

    xs.subscriptions.assertEqual(
      subscribe(200, 420));
  });
}());
