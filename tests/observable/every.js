(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('every');

  var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted;

  test('every empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.every(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(250, true),
      onCompleted(250)
    );
  });

  test('every return', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.every(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(250, true),
      onCompleted(250)
    );
  });

  test('every return no match', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, -2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.every(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(210, false),
      onCompleted(210)
    );
  });

  test('every none match', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, -2),
      onNext(220, -3),
      onNext(230, -4),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.every(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(210, false),
      onCompleted(210)
    );
  });

  test('every some match', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, -2),
      onNext(220, 3),
      onNext(230, -4),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
        return xs.every(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(210, false),
      onCompleted(210)
    );
  });

  test('every all match', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.every(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onNext(250, true),
      onCompleted(250)
    );
  });

  test('every throw', function () {
    var error = new Error();
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.every(function (x) { return x > 0; });
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

  test('every never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.every(function (x) { return x > 0; });
    });

    results.messages.assertEqual();
  });
}());
