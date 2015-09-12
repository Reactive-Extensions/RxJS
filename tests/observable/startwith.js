(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('startWith');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('startWith normal', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.startWith(1);
    });

    results.messages.assertEqual(
      onNext(200, 1),
      onNext(220, 2),
      onCompleted(250)
    );
  });

  test('startWith never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.startWith(scheduler, 1);
    });

    results.messages.assertEqual(
      onNext(201, 1)
    );
  });

  test('startWith empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.startWith(scheduler, 1);
    });

    results.messages.assertEqual(
      onNext(201, 1),
      onCompleted(250)
    );
  });

  test('startWith one', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.startWith(scheduler, 1);
    });

    results.messages.assertEqual(
      onNext(201, 1),
      onNext(220, 2),
      onCompleted(250)
    );
  });

  test('startWith multiple', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 4),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.startWith(scheduler, 1, 2, 3);
    });

    results.messages.assertEqual(
      onNext(201, 1),
      onNext(202, 2),
      onNext(203, 3),
      onNext(220, 4),
      onCompleted(250)
    );
  });

  test('startWith error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(250, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.startWith(scheduler, 1, 2, 3);
    });

    results.messages.assertEqual(
      onNext(201, 1),
      onNext(202, 2),
      onNext(203, 3),
      onError(250, error)
    );
  });

}());
