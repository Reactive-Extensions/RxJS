(function () {
  QUnit.module('some');

  var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

  test('some Predicate Empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.some(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(250, false),
      onCompleted(250)
    );
  });

  test('some Predicate Return', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.some(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(210, true),
      onCompleted(210)
    );
  });

  test('some Predicate ReturnNotMatch', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, -2),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.some(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(250, false),
      onCompleted(250)
    );
  });

  test('some Predicate SomeNoneMatch', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, -2),
      onNext(220, -3),
      onNext(230, -4),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.some(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(250, false),
      onCompleted(250)
    );
  });

  test('some Predicate SomeMatch', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, -2),
      onNext(220, 3),
      onNext(230, -4),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.some(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(220, true),
      onCompleted(220)
    );
  });

  test('some Predicate Throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.some(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

  test('some Predicate Never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.some(function (x) { return x > 0; });
    });

    results.messages.assertEqual();
  });
}());
