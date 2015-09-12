(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('pairs');

  var TestScheduler = Rx.TestScheduler,
    Observable = Rx.Observable,
    onNext = Rx.ReactiveTest.onNext,
    onCompleted = Rx.ReactiveTest.onCompleted;

  test('pairs empty', function () {
    var scheduler = new TestScheduler();

    var xs = {};

    var results = scheduler.startScheduler(function () {
      return Observable.pairs(xs, scheduler);
    });

    results.messages.assertEqual(
      onCompleted(201)
    );
  });

  test('pairs normal', function () {
    var scheduler = new TestScheduler();

    var xs = {foo: 42, bar: 56, baz: 78};

    var results = scheduler.startScheduler(function () {
      return Observable.pairs(xs, scheduler);
    });

    results.messages.assertEqual(
      onNext(201, ['foo', 42]),
      onNext(202, ['bar', 56]),
      onNext(203, ['baz', 78]),
      onCompleted(204)
    );
  });

}());
