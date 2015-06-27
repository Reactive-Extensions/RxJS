(function () {
  QUnit.module('last');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  // Last or Default
  test('last Empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.last();
    });

    res.messages.assertEqual(
      onNext(250, undefined),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );
  });

  test('last One', function () {
      var scheduler = new TestScheduler();

      var xs = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(210, 2),
        onCompleted(250)
      );

      var res = scheduler.startWithCreate(function () {
        return xs.last();
      });

      res.messages.assertEqual(
        onNext(250, 2),
        onCompleted(250)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 250)
      );
  });

  test('last Many', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onCompleted(250)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.last();
    });

    res.messages.assertEqual(onNext(250, 3), onCompleted(250));
    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('last Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.last();
    });

    res.messages.assertEqual(
      onError(210, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 210)
    );
  });

  test('last Predicate', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.last(function (x) { return x % 2 === 1; });
    });

    res.messages.assertEqual(
      onNext(250, 5),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );
  });

  test('last Predicate_None', function () {
      var scheduler = new TestScheduler();

      var xs = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(210, 2),
        onNext(220, 3),
        onNext(230, 4),
        onNext(240, 5),
        onCompleted(250)
      );

      var res = scheduler.startWithCreate(function () {
        return xs.last(function (x) { return x > 10; });
      });

      res.messages.assertEqual(
        onNext(250, undefined),
        onCompleted(250)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 250)
      );
  });

  test('last Predicate_Throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.last(function (x) { return x > 10; });
    });

    res.messages.assertEqual(
      onError(210, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 210)
    );
  });

  test('last PredicateThrows', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.last(function (x) {
        if (x < 4) { return x % 2 === 1; }
        throw error;
      });
    });

    res.messages.assertEqual(
      onError(230, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 230)
    );
  });

}());
