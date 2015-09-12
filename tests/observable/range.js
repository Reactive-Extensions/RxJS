(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('range');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('range zero', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.range(0, 0, scheduler);
    });

    results.messages.assertEqual(
      onCompleted(201)
    );
  });

  test('range one', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.range(0, 1, scheduler);
    });

    results.messages.assertEqual(
      onNext(201, 0),
      onCompleted(202)
    );
  });

  test('range five', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.range(10, 5, scheduler);
    });

    results.messages.assertEqual(
      onNext(201, 10),
      onNext(202, 11),
      onNext(203, 12),
      onNext(204, 13),
      onNext(205, 14),
      onCompleted(206)
    );
  });

  test('range dispose', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.range(-10, 5, scheduler);
    }, { disposed: 204 });

    results.messages.assertEqual(
      onNext(201, -10),
      onNext(202, -9),
      onNext(203, -8)
    );
  });

}());
