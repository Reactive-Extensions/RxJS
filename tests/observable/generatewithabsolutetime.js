(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('generateWithAbsoluteTime');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('generateWithAbsoluteTime absolute time finite', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
        return Observable.generateWithAbsoluteTime(0, function (x) {
            return x <= 3;
        }, function (x) {
            return x + 1;
        }, function (x) {
            return x;
        }, function (x) {
            return new Date(scheduler.now() + x + 1);
        }, scheduler);
    });

    results.messages.assertEqual(
      onNext(202, 0),
      onNext(204, 1),
      onNext(207, 2),
      onNext(211, 3),
      onCompleted(211));
  });

  test('generateWithAbsoluteTime absolute time throw condition', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.generateWithAbsoluteTime(0, function () {
        throw error;
      }, function (x) {
        return x + 1;
      }, function (x) {
        return x;
      }, function (x) {
        return new Date(scheduler.now() + x + 1);
      }, scheduler);
    });

    results.messages.assertEqual(
      onError(201, error));
  });

  test('generateWithAbsoluteTime absolute time throw result selector', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.generateWithAbsoluteTime(0, function () {
        return true;
      }, function (x) {
        return x + 1;
      }, function () {
        throw error;
      }, function (x) {
        return new Date(scheduler.now() + x + 1);
      }, scheduler);
    });

    results.messages.assertEqual(
      onError(201, error));
  });

  test('generateWithAbsoluteTime absolute time throw iterate', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
        return Observable.generateWithAbsoluteTime(0, function () {
            return true;
        }, function () {
            throw error;
        }, function (x) {
            return x;
        }, function (x) {
            return new Date(scheduler.now() + x + 1);
        }, scheduler);
    });

    results.messages.assertEqual(
      onNext(202, 0),
      onError(202, error));
  });

  test('generateWithAbsoluteTime absolute time throw time selector', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
        return Observable.generateWithAbsoluteTime(0, function () {
          return true;
        }, function (x) {
          return x + 1;
        }, function (x) {
          return x;
        }, function () {
          throw error;
        }, scheduler);
    });

    results.messages.assertEqual(
      onError(201, error));
  });

  test('generateWithAbsoluteTime absolute time dispose', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
        return Observable.generateWithAbsoluteTime(0, function () {
          return true;
        }, function (x) {
          return x + 1;
        }, function (x) {
          return x;
        }, function (x) {
          return new Date(scheduler.now() + x + 1);
        }, scheduler);
    }, { disposed: 210 });

    results.messages.assertEqual(
      onNext(202, 0),
      onNext(204, 1),
      onNext(207, 2));
  });

}());
