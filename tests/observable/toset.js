if (!!window.Set) {
  (function () {
    'use strict';
    /* jshint undef: true, unused: true */
    /* globals QUnit, test, Rx */

    QUnit.module('toSet');

    var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

    function extractValues(x) {
      var arr = [];
      x.forEach(function (item) {
        arr.push(item);
      });
      return arr;
    }

    test('toSet completed', function () {
      var scheduler = new TestScheduler();

      var xs = scheduler.createHotObservable(
        onNext(110, 1),
        onNext(220, 2),
        onNext(330, 3),
        onNext(440, 4),
        onNext(550, 5),
        onCompleted(660)
      );

      var results = scheduler.startScheduler(function () {
        return xs.toSet().map(extractValues);
      });

      results.messages.assertEqual(
        onNext(660, [2,3,4,5]),
        onCompleted(660)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 660)
      );
    });

    test('toSet error', function () {
      var error = new Error();

      var scheduler = new TestScheduler();

      var xs = scheduler.createHotObservable(
        onNext(110, 1),
        onNext(220, 2),
        onNext(330, 3),
        onNext(440, 4),
        onNext(550, 5),
        onError(660, error)
      );

      var results = scheduler.startScheduler(function () {
        return xs.toSet().map(extractValues);
      });

      results.messages.assertEqual(
        onError(660, error)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 660)
      );
    });

    test('toSet disposed', function () {
      var scheduler = new TestScheduler();

      var xs = scheduler.createHotObservable(
        onNext(110, 1),
        onNext(220, 2),
        onNext(330, 3),
        onNext(440, 4),
        onNext(550, 5)
      );

      var results = scheduler.startScheduler(function () {
        return xs.toSet().map(extractValues);
      });

      results.messages.assertEqual();

      xs.subscriptions.assertEqual(
        subscribe(200, 1000)
      );
    });
  }());
}
