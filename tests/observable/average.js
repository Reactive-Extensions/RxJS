(function () {
  QUnit.module('average');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('average empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.average();
    });

    equal(1, results.messages.length);
    ok(results.messages[0].value.kind === 'E' && results.messages[0].value.exception !== null);
    ok(results.messages[0].time === 250);
  });

  test('average single', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.average();
    });
    results.messages.assertEqual(
      onNext(250, 2),
      onCompleted(250)
    );
  });

  test('average multiple', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 3),
      onNext(220, 4),
      onNext(230, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.average();
    });

    results.messages.assertEqual(
      onNext(250, 3),
      onCompleted(250)
    );
  });

  test('average throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.average();
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

  test('average never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.average();
    });

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

  test('average Selector Regular Number', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 'b'),
      onNext(220, 'fo'),
      onNext(230, 'qux'),
      onCompleted(240)
    );

    var results = scheduler.startScheduler(function () {
      return xs.average(function (x) { return x.length; });
    });

    results.messages.assertEqual(
      onNext(240, 2),
      onCompleted(240)
    );

    xs.subscriptions.assertEqual(subscribe(200, 240));
  });

  test('average selector throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 'b'),
      onNext(220, 'fo'),
      onNext(230, 'qux'),
      onCompleted(240)
    );

    var results = scheduler.startScheduler(function () {
      return xs.average(function (x) { throw error; });
    });

    results.messages.assertEqual(
      onError(210, error)
    );

    xs.subscriptions.assertEqual(subscribe(200, 210));
  });

}());
