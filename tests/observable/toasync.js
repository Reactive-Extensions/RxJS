(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('toAsync');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('toAsync context', function () {
    var context = { value: 42 };

    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.toAsync(function (x) {
        return this.value + x;
      }, context, scheduler)(42);
    });

    results.messages.assertEqual(
      onNext(200, 84),
      onCompleted(200)
    );
  });

  test('toAsync 0', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.toAsync(function () {
        return 0;
      }, null, scheduler)();
    });

    results.messages.assertEqual(
      onNext(200, 0),
      onCompleted(200)
    );
  });

  test('toAsync 1', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.toAsync(function (x) {
        return x;
      }, null, scheduler)(1);
    });

    results.messages.assertEqual(
      onNext(200, 1),
      onCompleted(200)
    );
  });

  test('toAsync 2', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.toAsync(function (x, y) {
          return x + y;
      }, null, scheduler)(1, 2);
    });

    results.messages.assertEqual(
      onNext(200, 3),
      onCompleted(200)
    );
  });

  test('toAsync 3', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.toAsync(function (x, y, z) {
        return x + y + z;
      }, null, scheduler)(1, 2, 3);
    });

    results.messages.assertEqual(
      onNext(200, 6),
      onCompleted(200)
    );
  });

  test('toAsync 4', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.toAsync(function (a, b, c, d) {
        return a + b + c + d;
      }, null, scheduler)(1, 2, 3, 4);
    });

    results.messages.assertEqual(
      onNext(200, 10),
      onCompleted(200)
    );
  });

  test('toAsync error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.toAsync(function () {
        throw error;
      }, null, scheduler)();
    });

    results.messages.assertEqual(
      onError(200, error)
    );
  });

}());
