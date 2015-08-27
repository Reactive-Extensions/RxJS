(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('distinct');

  var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

  test('distinct default comparer all distinct', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(280, 4),
      onNext(300, 2),
      onNext(350, 1),
      onNext(380, 3),
      onNext(400, 5),
      onCompleted(420)
    );

    var results = scheduler.startScheduler(function () {
      return xs.distinct();
    });

    results.messages.assertEqual(
      onNext(280, 4),
      onNext(300, 2),
      onNext(350, 1),
      onNext(380, 3),
      onNext(400, 5),
      onCompleted(420)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 420)
    );
  });

  test('distinct default comparer some duplicates', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(280, 4),
      onNext(300, 2),
      onNext(350, 2),
      onNext(380, 3),
      onNext(400, 4),
      onCompleted(420)
    );

    var results = scheduler.startScheduler(function () {
      return xs.distinct();
    });

    results.messages.assertEqual(
      onNext(280, 4),
      onNext(300, 2),
      onNext(380, 3),
      onCompleted(420)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 420)
    );
  });

  function modComparer(mod) {
    return function (x, y) {
      return Rx.helpers.defaultComparer(x % mod, y % mod);
    };
  }

  test('distinct CustomComparer all distinct', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(280, 4),
      onNext(300, 2),
      onNext(350, 1),
      onNext(380, 3),
      onNext(400, 5),
      onCompleted(420)
    );

    var res = scheduler.startScheduler(function () {
      return xs.distinct(null, modComparer(10));
    });

    res.messages.assertEqual(
      onNext(280, 4),
      onNext(300, 2),
      onNext(350, 1),
      onNext(380, 3),
      onNext(400, 5),
      onCompleted(420)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 420)
    );
  });

  test('distinct CustomComparer some duplicates', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(280, 4),
      onNext(300, 2),
      onNext(350, 12),
      onNext(380, 3),
      onNext(400, 24),
      onCompleted(420)
    );

    var res = scheduler.startScheduler(function () {
      return xs.distinct(null, modComparer(10));
    });

    res.messages.assertEqual(
      onNext(280, 4),
      onNext(300, 2),
      onNext(380, 3),
      onCompleted(420)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 420)
    );
  });

}());
