(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('sum');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('sum number empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.sum();
    });

    results.messages.assertEqual(
      onNext(250, 0),
      onCompleted(250)
    );
  });

  test('sum number return', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.sum();
    });

    results.messages.assertEqual(
      onNext(250, 2),
      onCompleted(250)
    );
  });

  test('sum number some', function () {

      var scheduler = new TestScheduler();
      var xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onCompleted(250));
      var results = scheduler.startScheduler(function () {
          return xs.sum();
      });
      results.messages.assertEqual(onNext(250, 2 + 3 + 4), onCompleted(250));
  });

  test('sum number throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.sum();
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

  test('sum number never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.sum();
    });

    results.messages.assertEqual();
  });

  test('sum with selector regular number', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 'fo'),
      onNext(220, 'b'),
      onNext(230, 'qux'),
      onCompleted(240)
    );

    var results = scheduler.startScheduler(function () {
      return xs.sum(function (x) {
        return x.length;
      });
    });

    results.messages.assertEqual(onNext(240, 6), onCompleted(240));

    xs.subscriptions.assertEqual(subscribe(200, 240));
  });

}());
