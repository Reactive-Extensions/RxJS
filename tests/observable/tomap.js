if (!!window.Map) {
  (function () {

    'use strict';
    /* jshint undef: true, unused: true */
    /* globals QUnit, test, Rx */
    QUnit.module('toMap');

    var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

    function extractValues(x) {
      var arr = [];
      x.forEach(function (value, key) {
        arr.push(key, value);
      });
      return arr;
    }

    test('toMap completed', function () {
      var scheduler = new TestScheduler();

      var xs = scheduler.createHotObservable(
        onNext(110, 1),
        onNext(220, 2),
        onNext(330, 3),
        onNext(440, 4),
        onNext(550, 5),
        onCompleted(660)
      );

      var res = scheduler.startScheduler(function () {
        return xs.toMap(function (x) { return x * 2; }, function (x) { return x * 4; }).map(extractValues);
      });

      res.messages.assertEqual(
        onNext(660, [4, 8, 6, 12, 8, 16, 10, 20]),
        onCompleted(660)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 660)
      );
    });

    test('toMap error', function () {
      var scheduler = new TestScheduler();

      var error = new Error();

      var xs = scheduler.createHotObservable(
        onNext(110, 1),
        onNext(220, 2),
        onNext(330, 3),
        onNext(440, 4),
        onNext(550, 5),
        onError(660, error)
      );

      var res = scheduler.startScheduler(function () {
        return xs.toMap(function (x) { return x * 2; }, function (x) { return x * 4; }).map(extractValues);
      });

      res.messages.assertEqual(
        onError(660, error)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 660)
      );
    });

    test('toMap key selector throws', function () {
      var scheduler = new TestScheduler();

      var error = new Error();

      var xs = scheduler.createHotObservable(
        onNext(110, 1),
        onNext(220, 2),
        onNext(330, 3),
        onNext(440, 4),
        onNext(550, 5),
        onCompleted(600)
      );

      var res = scheduler.startScheduler(function () {
        return xs.toMap(function (x) { if (x < 4) { return x * 2; } else { throw error; } }, function (x) { return x * 4; }).map(extractValues);
      });

      res.messages.assertEqual(
        onError(440, error)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 440)
      );
    });

    test('toMap element selector throws', function () {
      var scheduler = new TestScheduler();

      var error = new Error();

      var xs = scheduler.createHotObservable(
          onNext(110, 1),
          onNext(220, 2),
          onNext(330, 3),
          onNext(440, 4),
          onNext(550, 5),
          onCompleted(600)
      );

      var res = scheduler.startScheduler(function () {
        return xs.toMap(function (x) { return x * 2; }, function (x) { if (x < 4) { return x * 4; } else { throw error; } }).map(extractValues);
      });

      res.messages.assertEqual(
        onError(440, error)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 440)
      );
    });

    test('toMap disposed', function () {
      var scheduler = new TestScheduler();

      var xs = scheduler.createHotObservable(
        onNext(110, 1),
        onNext(220, 2),
        onNext(330, 3),
        onNext(440, 4),
        onNext(550, 5)
      );

      var res = scheduler.startScheduler(function () {
        return xs.toMap(function (x) { return x * 2; }, function (x) { return x * 4; }).map(extractValues);
      });

      res.messages.assertEqual(
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 1000)
      );
    });

  }());
}
