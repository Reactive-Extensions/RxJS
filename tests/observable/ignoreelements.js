(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('ignoreElements');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('ignoreElements Basic', function () {
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
      onNext(590, 9));

    var results = scheduler.startScheduler(function () {
      return xs.ignoreElements();
    });

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(subscribe(200, 1000));
  });

  test('ignoreElements Completed', function () {
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
      onCompleted(610));

    var results = scheduler.startScheduler(function () {
      return xs.ignoreElements();
    });

    results.messages.assertEqual(
      onCompleted(610));

    xs.subscriptions.assertEqual(
      subscribe(200, 610));
  });

  test('ignoreElements Error', function () {
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
      onError(610, error));

    var results = scheduler.startScheduler(function () {
      return xs.ignoreElements();
    });

    results.messages.assertEqual(
      onError(610, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 610));
  });

}());
