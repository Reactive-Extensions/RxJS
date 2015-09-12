(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('timestamp');

  if (!Rx.Observable.prototype.timeInterval) {
    // Add timeInterval for tests
    Rx.Observable.prototype.timeInterval = function (scheduler) {
      var source = this;
      Rx.Scheduler.isScheduler(scheduler) || (scheduler = Rx.Scheduler['default']);
      return Rx.Observable.defer(function () {
        var last = scheduler.now();
        return source.map(function (x) {
          var now = scheduler.now(), span = now - last;
          last = now;
          return { value: x, interval: span };
        });
      });
    };
  }

  var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted;

  function Timestamp(value, timestamp) {
    this.value = value;
    this.timestamp = timestamp;
  }

  test('timestamp regular', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(260, 4),
      onNext(300, 5),
      onNext(350, 6),
      onCompleted(400)
    );

    var results = scheduler.startScheduler(function () {
      return xs.timestamp(scheduler).map(function (x) {
        return new Timestamp(x.value, x.timestamp);
      });
    });

    results.messages.assertEqual(
      onNext(210, new Timestamp(2, 210)),
      onNext(230, new Timestamp(3, 230)),
      onNext(260, new Timestamp(4, 260)),
      onNext(300, new Timestamp(5, 300)),
      onNext(350, new Timestamp(6, 350)),
      onCompleted(400)
    );
  });

  test('timestamp empty', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Rx.Observable.empty(scheduler).timeInterval(scheduler);
    });

    results.messages.assertEqual(
      onCompleted(201)
    );
  });

  test('timestamp error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Rx.Observable['throw'](error, scheduler).timeInterval(scheduler);
    });

    results.messages.assertEqual(
      onError(201, error)
    );
  });

  test('timestamp never', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Rx.Observable.never().timeInterval(scheduler);
    });

    results.messages.assertEqual();
  });

}());
