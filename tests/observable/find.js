(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('find');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('find never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
        onNext(150, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.find(function () { return true; });
    });

    results.messages.assertEqual();
  });

  test('find empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210)
    );

    var results = scheduler.startScheduler(function () {
      return xs.find(function () { return true; });
    });

    results.messages.assertEqual(
      onCompleted(210)
    );
  });

  test('find single', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(220)
    );

    var results = scheduler.startScheduler(function () {
      return xs.find(function (x) { return x === 2; });
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onCompleted(210)
    );
  });

  test('find not found', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(220)
    );

    var results = scheduler.startScheduler(function () {
      return xs.find(function (x) { return x === 3; });
    });

    results.messages.assertEqual(
      onCompleted(220)
    );
  });

  test('find error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onError(220, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.find(function (x) { return x === 3; });
    });

    results.messages.assertEqual(
      onError(220, error)
    );
  });

  test('find throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(220)
    );

    var results = scheduler.startScheduler(function () {
      return xs.find(function () { throw error; });
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

}());
