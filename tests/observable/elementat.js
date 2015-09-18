(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('elementAt');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('elementAt First', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(280, 42),
      onNext(360, 43),
      onNext(470, 44),
      onCompleted(600)
    );

    var results = scheduler.startScheduler(function () {
      return xs.elementAt(0);
    });

    results.messages.assertEqual(
      onNext(280, 42),
      onCompleted(280)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 280)
    );
  });

  test('elementAt Other', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(280, 42),
      onNext(360, 43),
      onNext(470, 44),
      onCompleted(600)
    );

    var results = scheduler.startScheduler(function () {
      return xs.elementAt(2);
    });

    results.messages.assertEqual(
      onNext(470, 44),
      onCompleted(470)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 470)
    );
  });

  test('elementAt out of range', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(280, 42),
      onNext(360, 43),
      onNext(470, 44),
      onCompleted(600)
    );

    var results = scheduler.startScheduler(function () {
      return xs.elementAt(3);
    });

    results.messages.assertEqual(
      onError(600, function (n) { return n.error instanceof Rx.ArgumentOutOfRangeError; })
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );
  });

  test('elementAt out of range default', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(280, 42),
      onNext(360, 43),
      onNext(470, 44),
      onCompleted(600)
    );

    var results = scheduler.startScheduler(function () {
      return xs.elementAt(3, 84);
    });

    results.messages.assertEqual(
      onNext(600, 84),
      onCompleted(600)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );
  });

}());
