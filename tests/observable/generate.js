(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('generate');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('generate finite', function () {
      var scheduler = new TestScheduler();

      var results = scheduler.startScheduler(function () {
        return Observable.generate(0, function (x) {
          return x <= 3;
        }, function (x) {
          return x + 1;
        }, function (x) {
          return x;
        }, scheduler);
      });

      results.messages.assertEqual(
        onNext(201, 0),
        onNext(202, 1),
        onNext(203, 2),
        onNext(204, 3),
        onCompleted(205)
      );
  });

  test('generate throw condition', function () {
    var scheduler = new TestScheduler();

    var error = new Error();

    var results = scheduler.startScheduler(function () {
      return Observable.generate(0, function () {
        throw error;
      }, function (x) {
        return x + 1;
      }, function (x) {
        return x;
      }, scheduler);
    });

    results.messages.assertEqual(
      onError(201, error));
  });

  test('generate throw result selector', function () {
    var scheduler = new TestScheduler();

    var error = new Error();

    var results = scheduler.startScheduler(function () {
        return Observable.generate(0, function () {
          return true;
        }, function (x) {
          return x + 1;
        }, function () {
          throw error;
        }, scheduler);
    });

    results.messages.assertEqual(
      onError(201, error));
  });

  test('generate throw iterate', function () {
    var scheduler = new TestScheduler();

    var error = new Error();

    var results = scheduler.startScheduler(function () {
      return Observable.generate(0, function () {
        return true;
      }, function () {
        throw error;
      }, function (x) {
        return x;
      }, scheduler);
    });

    results.messages.assertEqual(
      onNext(201, 0),
      onError(202, error)
    );
  });

  test('generate dispose', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.generate(0, function () {
        return true;
      }, function (x) {
        return x + 1;
      }, function (x) {
        return x;
      }, scheduler);
    }, {disposed: 203 });

    results.messages.assertEqual(
      onNext(201, 0),
      onNext(202, 1));
  });

}());
