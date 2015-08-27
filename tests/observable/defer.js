(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal */
  QUnit.module('defer');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('defer Complete', function () {
    var invoked = 0;

    var scheduler = new TestScheduler();

    var xs;

    var results = scheduler.startScheduler(function () {
      return Observable.defer(function () {
        invoked++;
        xs = scheduler.createColdObservable(
          onNext(100, scheduler.clock),
          onCompleted(200));

        return xs;
      });
    });

    results.messages.assertEqual(
      onNext(300, 200),
      onCompleted(400)
    );

    equal(1, invoked);

    xs.subscriptions.assertEqual(
      subscribe(200, 400));
  });

  test('defer Error', function () {
    var scheduler = new TestScheduler();

    var invoked = 0;

    var error = new Error();

    var xs;

    var results = scheduler.startScheduler(function () {
      return Observable.defer(function () {
        invoked++;
        xs = scheduler.createColdObservable(
          onNext(100, scheduler.clock),
          onError(200, error));
        return xs;
      });
    });

    results.messages.assertEqual(
      onNext(300, 200),
      onError(400, error));

    equal(1, invoked);

    xs.subscriptions.assertEqual(
      subscribe(200, 400));
  });

  test('defer Dispose', function () {
    var scheduler = new TestScheduler();

    var invoked = 0;

    var xs;

    var results = scheduler.startScheduler(function () {
      return Observable.defer(function () {
        invoked++;
        xs = scheduler.createColdObservable(
          onNext(100, scheduler.clock),
          onNext(200, invoked),
          onNext(1100, 1000));

        return xs;
      });
    });

    results.messages.assertEqual(
      onNext(300, 200),
      onNext(400, 1));

    equal(1, invoked);

    xs.subscriptions.assertEqual(
      subscribe(200, 1000));
  });

  test('defer throw', function () {
    var scheduler = new TestScheduler();

    var invoked = 0;

    var error = new Error();

    var results = scheduler.startScheduler(function () {
      return Observable.defer(function () {
        invoked++;
        throw error;
      });
    });

    results.messages.assertEqual(
      onError(200, error));

    equal(1, invoked);
  });

}());
