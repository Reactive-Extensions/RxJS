(function() {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('windowWithTime');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('windowWithTime basic', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(240, 3),
      onNext(270, 4),
      onNext(320, 5),
      onNext(360, 6),
      onNext(390, 7),
      onNext(410, 8),
      onNext(460, 9),
      onNext(470, 10),
      onCompleted(490));

    var results = scheduler.startScheduler(function () {
      return xs.windowWithTime(100, scheduler).map(function (ys, i) {
        return ys.map(function (y) { return i + ' ' + y; }).concat(Rx.Observable.just(i + ' end'));
      }).mergeAll();
    });

    results.messages.assertEqual(
      onNext(210, '0 2'),
      onNext(240, '0 3'),
      onNext(270, '0 4'),
      onNext(300, '0 end'),
      onNext(320, '1 5'),
      onNext(360, '1 6'),
      onNext(390, '1 7'),
      onNext(400, '1 end'),
      onNext(410, '2 8'),
      onNext(460, '2 9'),
      onNext(470, '2 10'),
      onNext(490, '2 end'),
      onCompleted(490));

    xs.subscriptions.assertEqual(
      subscribe(200, 490));
  });

  test('windowWithTime basic both', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(240, 3),
      onNext(270, 4),
      onNext(320, 5),
      onNext(360, 6),
      onNext(390, 7),
      onNext(410, 8),
      onNext(460, 9),
      onNext(470, 10),
      onCompleted(490));

    var results = scheduler.startScheduler(function () {
      return xs.windowWithTime(100, 50, scheduler).map(function (ys, i) {
        return ys.map(function (y) { return i + ' ' + y; }).concat(Rx.Observable.just(i + ' end'));
      }).mergeAll();
    });

    results.messages.assertEqual(
      onNext(210, '0 2'),
      onNext(240, '0 3'),
      onNext(270, '0 4'),
      onNext(270, '1 4'),
      onNext(300, '0 end'),
      onNext(320, '1 5'),
      onNext(320, '2 5'),
      onNext(350, '1 end'),
      onNext(360, '2 6'),
      onNext(360, '3 6'),
      onNext(390, '2 7'),
      onNext(390, '3 7'),
      onNext(400, '2 end'),
      onNext(410, '3 8'),
      onNext(410, '4 8'),
      onNext(450, '3 end'),
      onNext(460, '4 9'),
      onNext(460, '5 9'),
      onNext(470, '4 10'),
      onNext(470, '5 10'),
      onNext(490, '4 end'),
      onNext(490, '5 end'),
      onCompleted(490));

    xs.subscriptions.assertEqual(
      subscribe(200, 490));
  });

  test('windowWithTime basic', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(100, 1),
      onNext(210, 2),
      onNext(240, 3),
      onNext(280, 4),
      onNext(320, 5),
      onNext(350, 6),
      onNext(380, 7),
      onNext(420, 8),
      onNext(470, 9),
      onCompleted(600));

    var results = scheduler.startScheduler(function () {
      return xs.windowWithTime(100, 70, scheduler).map(function (w, i) {
        return w.map(function (x) { return i + ' ' + x; });
      }).mergeAll();
    });

    results.messages.assertEqual(
      onNext(210, '0 2'),
      onNext(240, '0 3'),
      onNext(280, '0 4'),
      onNext(280, '1 4'),
      onNext(320, '1 5'),
      onNext(350, '1 6'),
      onNext(350, '2 6'),
      onNext(380, '2 7'),
      onNext(420, '2 8'),
      onNext(420, '3 8'),
      onNext(470, '3 9'),
      onCompleted(600));

    xs.subscriptions.assertEqual(
      subscribe(200, 600));
  });

  test('windowWithTime Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(100, 1),
      onNext(210, 2),
      onNext(240, 3),
      onNext(280, 4),
      onNext(320, 5),
      onNext(350, 6),
      onNext(380, 7),
      onNext(420, 8),
      onNext(470, 9),
      onError(600, error));

    var results = scheduler.startScheduler(function () {
      return xs.windowWithTime(100, 70, scheduler).map(function (w, i) {
        return w.map(function (x) { return i + ' ' + x;   });
      }).mergeAll();
    });

    results.messages.assertEqual(
      onNext(210, '0 2'),
      onNext(240, '0 3'),
      onNext(280, '0 4'),
      onNext(280, '1 4'),
      onNext(320, '1 5'),
      onNext(350, '1 6'),
      onNext(350, '2 6'),
      onNext(380, '2 7'),
      onNext(420, '2 8'),
      onNext(420, '3 8'),
      onNext(470, '3 9'),
      onError(600, error));

    xs.subscriptions.assertEqual(subscribe(200, 600));
  });

  test('windowWithTime disposed', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(100, 1),
      onNext(210, 2),
      onNext(240, 3),
      onNext(280, 4),
      onNext(320, 5),
      onNext(350, 6),
      onNext(380, 7),
      onNext(420, 8),
      onNext(470, 9),
      onCompleted(600));

    var results = scheduler.startScheduler(function () {
        return xs.windowWithTime(100, 70, scheduler).map(function (w, i) {
          return w.map(function (x) { return i + ' ' + x; });
        }).mergeAll();
    }, { disposed: 370 });

    results.messages.assertEqual(
      onNext(210, '0 2'),
      onNext(240, '0 3'),
      onNext(280, '0 4'),
      onNext(280, '1 4'),
      onNext(320, '1 5'),
      onNext(350, '1 6'),
      onNext(350, '2 6'));

    xs.subscriptions.assertEqual(
      subscribe(200, 370));
  });

  test('windowWithTime basic same', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(100, 1),
      onNext(210, 2),
      onNext(240, 3),
      onNext(280, 4),
      onNext(320, 5),
      onNext(350, 6),
      onNext(380, 7),
      onNext(420, 8),
      onNext(470, 9),
      onCompleted(600));

    var results = scheduler.startScheduler(function () {
      return xs.windowWithTime(100, scheduler).map(function (w, i) {
        return w.map(function (x) { return i + ' ' + x; });
      }).mergeAll();
    });

    results.messages.assertEqual(
      onNext(210, '0 2'),
      onNext(240, '0 3'),
      onNext(280, '0 4'),
      onNext(320, '1 5'),
      onNext(350, '1 6'),
      onNext(380, '1 7'),
      onNext(420, '2 8'),
      onNext(470, '2 9'),
      onCompleted(600));

    xs.subscriptions.assertEqual(
      subscribe(200, 600));
  });

}());
