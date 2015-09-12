(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('takeUntilWithTime');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('takeUntilWithTime zero', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onCompleted(230)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeUntilWithTime(new Date(0), scheduler);
    });

    results.messages.assertEqual(
      onCompleted(201)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 201)
    );
  });

  test('takeUntilWithTime late', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onCompleted(230)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeUntilWithTime(new Date(250), scheduler);
    });

    results.messages.assertEqual(
      onNext(210, 1),
      onNext(220, 2),
      onCompleted(230)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 230)
    );
  });

  test('takeUntilWithTime error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onError(210, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeUntilWithTime(new Date(250), scheduler);
    });

    results.messages.assertEqual(
      onError(210, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 210)
    );
  });

  test('takeUntilWithTime never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable();

    var results = scheduler.startScheduler(function () {
      return xs.takeUntilWithTime(new Date(250), scheduler);
    });

    results.messages.assertEqual(
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );
  });

  test('takeUntilWithTime twice 1', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onNext(230, 3),
      onNext(240, 4),
      onNext(250, 5),
      onNext(260, 6),
      onCompleted(270)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeUntilWithTime(new Date(255), scheduler).takeUntilWithTime(new Date(235), scheduler);
    });

    results.messages.assertEqual(
      onNext(210, 1),
      onNext(220, 2),
      onNext(230, 3),
      onCompleted(235)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 235)
    );
  });

  test('takeUntilWithTime twice 2', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onNext(230, 3),
      onNext(240, 4),
      onNext(250, 5),
      onNext(260, 6),
      onCompleted(270)
    );

    var results = scheduler.startScheduler(function () {
      return xs.takeUntilWithTime(new Date(235), scheduler).takeUntilWithTime(new Date(255), scheduler);
    });

    results.messages.assertEqual(
      onNext(210, 1),
      onNext(220, 2),
      onNext(230, 3),
      onCompleted(235)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 235)
    );
  });

}());
