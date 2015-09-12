(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal */

  QUnit.module('of');

  var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onCompleted = Rx.ReactiveTest.onCompleted;

  test('of', function () {
    var results = [];

    Rx.Observable.of(1,2,3,4,5).subscribe(results.push.bind(results));

    equal([1,2,3,4,5].toString(), results.toString());
  });

  test('of empty', function () {
    var results = [];

    Rx.Observable.of().subscribe(results.push.bind(results));

    equal(results.length, 0);
  });

  test('ofWithScheduler', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.ofWithScheduler(scheduler, 1,2,3,4,5);
    });

    results.messages.assertEqual(
      onNext(201, 1),
      onNext(202, 2),
      onNext(203, 3),
      onNext(204, 4),
      onNext(205, 5),
      onCompleted(206)
    );
  });

  test('ofWithScheduler empty', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.ofWithScheduler(scheduler);
    });

    results.messages.assertEqual(
      onCompleted(201)
    );
  });

}());
