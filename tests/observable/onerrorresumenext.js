(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('onErrorResumeNext');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('onErrorResumeNext error multiple', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onError(220, new Error())
    );

    var o2 = scheduler.createHotObservable(
      onNext(230, 4),
      onError(240, new Error())
    );

    var o3 = scheduler.createHotObservable(
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return Observable.onErrorResumeNext(o1, o2, o3);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(230, 4),
      onCompleted(250)
    );
  });

  test('onErrorResumeNext empty return throw and more', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(205)
    );

    var o2 = scheduler.createHotObservable(
      onNext(215, 2),
      onCompleted(220)
    );

    var o3 = scheduler.createHotObservable(
      onNext(225, 3),
      onNext(230, 4),
      onCompleted(235)
    );

    var o4 = scheduler.createHotObservable(
      onError(240, new Error())
    );

    var o5 = scheduler.createHotObservable(
      onNext(245, 5), onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return Observable.onErrorResumeNext(o1, o2, o3, o4, o5);
    });

    results.messages.assertEqual(
      onNext(215, 2),
      onNext(225, 3),
      onNext(230, 4),
      onNext(245, 5),
      onCompleted(250)
    );
  });

  test('onErrorResumeNext single source throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onError(230, error)
    );

    var results = scheduler.startScheduler(function () {
      return Observable.onErrorResumeNext(o1);
    });

    results.messages.assertEqual(
      onCompleted(230)
    );
  });

  test('onErrorResumeNext end with never', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(220)
    );

    var o2 = Observable.never();

    var results = scheduler.startScheduler(function () {
      return Observable.onErrorResumeNext(o1, o2);
    });

    results.messages.assertEqual(
      onNext(210, 2)
    );
  });

  test('onErrorResumeNext start with never', function () {
      var scheduler = new TestScheduler();

      var o1 = Observable.never();
      
      var o2 = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(210, 2),
        onCompleted(220)
      );

      var results = scheduler.startScheduler(function () {
        return Observable.onErrorResumeNext(o1, o2);
      });

      results.messages.assertEqual();
  });

  test('onErrorResumeNext no errors', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onCompleted(230)
    );

    var o2 = scheduler.createHotObservable(
      onNext(240, 4),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return o1.onErrorResumeNext(o2);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(220, 3),
      onNext(240, 4),
      onCompleted(250)
    );
  });

  test('onErrorResumeNext error', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onError(230, new Error())
    );

    var o2 = scheduler.createHotObservable(
      onNext(240, 4),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return o1.onErrorResumeNext(o2);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(220, 3),
      onNext(240, 4),
      onCompleted(250)
    );
  });

  test('onErrorResumeNext empty return throw and more', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(220)
    );

    var o2 = scheduler.createHotObservable(
      onError(230, error)
    );

    var results = scheduler.startScheduler(function () {
      return o1.onErrorResumeNext(o2);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onCompleted(230)
    );
  });

}());
