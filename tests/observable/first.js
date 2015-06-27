(function () {
  QUnit.module('first');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('first Empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.first();
    });

    res.messages.assertEqual(
      onNext(250, undefined),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );
  });

  test('first One', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.first();
    });

    res.messages.assertEqual(
      onNext(210, 2),
      onCompleted(210)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 210)
    );
  });

  test('first Many', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onCompleted(250)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.first();
    });

    res.messages.assertEqual(
      onNext(210, 2),
      onCompleted(210)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 210)
    );
  });

  test('first Predicate', function () {
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
      return xs.first(function (x) { return x % 2 === 1; });
    });

    res.messages.assertEqual(
      onNext(220, 3),
      onCompleted(220)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 220)
    );
  });

  test('first Predicate None', function () {
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
        return xs.first(function (x) { return x > 10; });
      });

      res.messages.assertEqual(
        onNext(250, undefined),
        onCompleted(250)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 250)
      );
  });

  test('first Predicate Throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onError(220, error)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.first(function (x) { return x % 2 === 1; });
    });

    res.messages.assertEqual(
      onError(220, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 220)
    );
  });

  test('first PredicateThrows', function () {
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
        return xs.first(function (x) {
          if (x < 4) { return false; }
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
