(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('generateWithRelativeTime');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('generateWithRelativeTime finite', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.generateWithRelativeTime(0, function (x) {
        return x <= 3;
      }, function (x) {
        return x + 1;
      }, function (x) {
        return x;
      }, function (x) {
        return x + 1;
      }, scheduler);
    });

    results.messages.assertEqual(
      onNext(202, 0),
      onNext(204, 1),
      onNext(207, 2),
      onNext(211, 3),
      onCompleted(211));
  });

  test('generateWithRelativeTime throw condition', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.generateWithRelativeTime(0, function () {
        throw error;
      }, function (x) {
        return x + 1;
      }, function (x) {
        return x;
      }, function (x) {
        return x + 1;
      }, scheduler);
    });

    results.messages.assertEqual(
      onError(201, error));
  });

  test('generateWithRelativeTime throw result selector', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.generateWithRelativeTime(0, function () {
        return true;
      }, function (x) {
        return x + 1;
      }, function () {
        throw error;
      }, function (x) {
        return x + 1;
      }, scheduler);
    });

    results.messages.assertEqual(
      onError(201, error));
  });

  test('generateWithRelativeTime throw iterate', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
        return Observable.generateWithRelativeTime(0, function () {
            return true;
        }, function () {
            throw error;
        }, function (x) {
            return x;
        }, function (x) {
            return x + 1;
        }, scheduler);
    });

    results.messages.assertEqual(
      onNext(202, 0),
      onError(202, error));
  });

  test('generateWithRelativeTime throw time selector', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.generateWithRelativeTime(0, function () {
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

  test('generateWithRelativeTime dispose', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
        return Observable.generateWithRelativeTime(0, function () {
          return true;
        }, function (x) {
          return x + 1;
        }, function (x) {
          return x;
        }, function (x) {
          return x + 1;
        }, scheduler);
    }, { disposed: 210 });

    results.messages.assertEqual(
      onNext(202, 0),
      onNext(204, 1),
      onNext(207, 2));
  });

}());
