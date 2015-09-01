(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('isEmpty');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('isEmpty Empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    var results = scheduler.startScheduler(function () {
        return xs.isEmpty();
    });
    results.messages.assertEqual(onNext(250, true), onCompleted(250));
    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('isEmpty Return', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    var results = scheduler.startScheduler(function () {
        return xs.isEmpty();
    });

    results.messages.assertEqual(
      onNext(210, false),
      onCompleted(210));

    xs.subscriptions.assertEqual(
      subscribe(200, 210));
  });

  test('isEmpty Throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error));

    var results = scheduler.startScheduler(function () {
      return xs.isEmpty();
    });

    results.messages.assertEqual(
      onError(210, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 210));
  });

  test('isEmpty Never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1));

    var results = scheduler.startScheduler(function () {
      return xs.isEmpty();
    });

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(
      subscribe(200, 1000));
  });

}());
