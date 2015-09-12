(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, raises */
  QUnit.module('timer');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onCompleted = Rx.ReactiveTest.onCompleted;

  function noop () { }

  test('timer one shot relative time basic', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Rx.Observable.timer(300, scheduler);
    });

    results.messages.assertEqual(onNext(500, 0), onCompleted(500));
  });

  test('timer one shot relative time zero', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Rx.Observable.timer(0, scheduler);
    });

    results.messages.assertEqual(
      onNext(201, 0),
      onCompleted(201)
    );
  });

  test('timer one shot relative time negative', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Rx.Observable.timer(-1, scheduler);
    });

    results.messages.assertEqual(
      onNext(201, 0),
      onCompleted(201)
    );
  });

  test('timer one shot relative time disposed', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Rx.Observable.timer(1000, scheduler);
    });

    results.messages.assertEqual();
  });

  test('timer one shot relative time observer throws', function () {
    var scheduler1 = new TestScheduler();

    var xs = Rx.Observable.timer(1, scheduler1);
    xs.subscribe(function () { throw new Error(); });
    raises(function () { scheduler1.start(); });

    var scheduler2 = new TestScheduler();

    var ys = Rx.Observable.timer(1, scheduler2);
    ys.subscribe(noop, noop, function () { throw new Error(); });
    raises(function () { scheduler2.start(); });
  });

}());
