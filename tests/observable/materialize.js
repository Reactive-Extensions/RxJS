(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('materialize');

  var Notification = Rx.Notification,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('materialize never', function () {
      var scheduler = new TestScheduler();
      var results = scheduler.startScheduler(function () {
        return Rx.Observable.never().materialize();
      });

      results.messages.assertEqual();
  });

  test('materialize empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1), onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.materialize();
    });

    results.messages.assertEqual(
      onNext(250, Notification.createOnCompleted()),
      onCompleted(250)
    );
  });

  test('materialize return', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.materialize();
    });

    results.messages.assertEqual(
      onNext(210, Notification.createOnNext(2)),
      onNext(250, Notification.createOnCompleted()),
      onCompleted(250)
    );
  });

  test('materialize throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(250, error));

    var results = scheduler.startScheduler(function () {
      return xs.materialize();
    });

    results.messages.assertEqual(
      onNext(250, Notification.createOnError(error)),
      onCompleted(250)
    );
  });

  test('materialize dematerialize never', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Rx.Observable.never().materialize().dematerialize();
    });

    results.messages.assertEqual();
  });

  test('materialize dematerialize empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.materialize().dematerialize();
    });

    results.messages.assertEqual(
      onCompleted(250)
    );
  });

  test('materialize dematerialize return', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.materialize().dematerialize();
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onCompleted(250)
    );
  });

  test('materialize dematerialize throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(250, error));

    var results = scheduler.startScheduler(function () {
      return xs.materialize().dematerialize();
    });

    results.messages.assertEqual(
      onError(250, error)
    );
  });

}());
