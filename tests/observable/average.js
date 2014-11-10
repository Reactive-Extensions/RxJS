(function () {
  QUnit.module('Average');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('Average_Number_Empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));

    var results = scheduler.startWithCreate(function () {
      return xs.average();
    });

    equal(1, results.messages.length);
    ok(results.messages[0].value.kind === 'E' && results.messages[0].value.exception !== null);
    ok(results.messages[0].time === 250);
  });

  test('Average_Number_Return', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.average();
    });
    results.messages.assertEqual(
      onNext(250, 2),
      onCompleted(250)
    );
  });

  test('Average_Number_Some', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 3),
      onNext(220, 4),
      onNext(230, 2),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.average();
    });

    results.messages.assertEqual(
      onNext(250, 3),
      onCompleted(250)
    );
  });

  test('Average_Number_Throw', function () {
    var error = new Error();
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.average();
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

  test('Average_Number_Never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.average();
    });
    results.messages.assertEqual();

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

  test('Average_Selector_Regular_Number', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, "b"),
      onNext(220, "fo"),
      onNext(230, "qux"),
      onCompleted(240)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.average(function (x) { return x.length; });
    });

    results.messages.assertEqual(
      onNext(240, 2),
      onCompleted(240)
    );

    xs.subscriptions.assertEqual(subscribe(200, 240));
  });

  test('Average_Selector_Throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, "b"),
      onNext(220, "fo"),
      onNext(230, "qux"),
      onCompleted(240)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.average(function (x) { throw error; });
    });

    results.messages.assertEqual(
      onError(210, error)
    );

    xs.subscriptions.assertEqual(subscribe(200, 210));
  });

}());
