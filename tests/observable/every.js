(function () {
  QUnit.module('every');

  var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

  test('every_Empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.every(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(250, true),
      onCompleted(250)
    );
  });

  test('every_Return', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.every(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(250, true),
      onCompleted(250)
    );
  });

  test('every_ReturnNotMatch', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, -2),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.every(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(210, false),
      onCompleted(210)
    );
  });

  test('every_SomeNoneMatch', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, -2),
      onNext(220, -3),
      onNext(230, -4),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.every(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(210, false),
      onCompleted(210)
    );
  });

  test('every_SomeMatch', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, -2),
      onNext(220, 3),
      onNext(230, -4),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
        return xs.every(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(210, false),
      onCompleted(210)
    );
  });

  test('every_SomeeveryMatch', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.every(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(250, true),
      onCompleted(250)
    );
  });

  test('every_Throw', function () {
    var error = new Error();
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.every(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

  test('every_Never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.every(function (x) { return x > 0; });
    });

    results.messages.assertEqual();
  });
}());
