(function () {

  QUnit.module('Aggregate');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  function add(acc, x) { return acc + x; }

  test('AggregateWithSeed_Empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.aggregate(42, add);
    });

    results.messages.assertEqual(
      onNext(250, 42),
      onCompleted(250)
    );
  });

  test('AggregateWithSeed_Return', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 24),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.aggregate(42, add);
    });

    results.messages.assertEqual(
      onNext(250, 42 + 24),
      onCompleted(250)
    );
  });

  test('AggregateWithSeed_Throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.aggregate(42, add);
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

  test('AggregateWithSeed_Function_Throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 0),
      onNext(220, 1),
      onNext(230, 2),
      onNext(240, 3),
      onNext(250, 4),
      onCompleted(260)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.aggregate(42, function () { throw error; });
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

  test('AggregateWithSeed_Never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.aggregate(42, add);
    });

    results.messages.assertEqual();
  });

  test('AggregateWithSeed_NoEnd', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 0),
      onNext(220, 1),
      onNext(230, 2),
      onNext(240, 3),
      onNext(250, 4)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.aggregate(42, add);
    });

    results.messages.assertEqual();
  });

  test('AggregateWithSeed_Range', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 0),
      onNext(220, 1),
      onNext(230, 2),
      onNext(240, 3),
      onNext(250, 4),
      onCompleted(260)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.aggregate(42, add);
    });

    results.messages.assertEqual(
      onNext(260, 10 + 42),
      onCompleted(260)
    );
  });

  test('AggregateWithoutSeed_Empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.aggregate(add);
    });

    equal(1, results.messages.length);
    ok(results.messages[0].value.kind === 'E' && results.messages[0].value.exception !== undefined);
    equal(250, results.messages[0].time);
  });

  test('AggregateWithoutSeed_Return', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 24),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.aggregate(add);
    });

    results.messages.assertEqual(
      onNext(250, 24),
      onCompleted(250)
    );
  });

  test('AggregateWithoutSeed_Throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.aggregate(add);
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

  test('AggregateWithoutSeed_Function_Throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 0),
      onNext(220, 1),
      onNext(230, 2),
      onNext(240, 3),
      onNext(250, 4),
      onCompleted(260)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.aggregate(function () { throw error; });
    });

    results.messages.assertEqual(
      onError(220, error)
    );
  });

  test('AggregateWithoutSeed_Never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.aggregate(add);
    });

    results.messages.assertEqual();
  });

  test('AggregateWithoutSeed_NoEnd', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 0),
      onNext(220, 1),
      onNext(230, 2),
      onNext(240, 3),
      onNext(250, 4)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.aggregate(add);
    });

    results.messages.assertEqual();
  });

  test('AggregateWithoutSeed_Range', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 0),
      onNext(220, 1),
      onNext(230, 2),
      onNext(240, 3),
      onNext(250, 4),
      onCompleted(260)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.aggregate(add);
    });

    results.messages.assertEqual(onNext(260, 10), onCompleted(260));
  });
}());
