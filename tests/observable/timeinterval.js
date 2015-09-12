(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('timeInterval');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  function TimeInterval(value, interval) {
    this.value = value;
    this.interval = interval;
  }

  test('timeInterval regular', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(260, 4),
      onNext(300, 5),
      onNext(350, 6),
      onCompleted(400));

    var results = scheduler.startScheduler(function () {
      return xs.timeInterval(scheduler).map(function (x) {
        return new TimeInterval(x.value, x.interval);
      });
    });

    results.messages.assertEqual(
      onNext(210, new TimeInterval(2, 10)),
      onNext(230, new TimeInterval(3, 20)),
      onNext(260, new TimeInterval(4, 30)),
      onNext(300, new TimeInterval(5, 40)),
      onNext(350, new TimeInterval(6, 50)),
      onCompleted(400)
    );
  });

  test('timeInterval empty', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Rx.Observable.empty(scheduler).timeInterval(scheduler);
    });

    results.messages.assertEqual(
      onCompleted(201)
    );
  });

  test('timeInterval error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Rx.Observable['throw'](error, scheduler).timeInterval(scheduler);
    });

    results.messages.assertEqual(
      onError(201, error)
    );
  });

  test('timeInterval never', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Rx.Observable.never().timeInterval(scheduler);
    });

    results.messages.assertEqual();
  });

}());
