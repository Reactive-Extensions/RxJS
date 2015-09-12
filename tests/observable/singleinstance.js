(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('singleInstance');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe,
      created = Rx.ReactiveTest.created,
      disposed = Rx.ReactiveTest.disposed,
      subscribed = Rx.ReactiveTest.subscribed;

  test('singleInstance basic', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(100, 1),
      onNext(150, 2),
      onNext(200, 3),
      onCompleted(250)
    );

    var ys;
    var results1 = scheduler.createObserver();
    var results2 = scheduler.createObserver();
    var disposable;

    scheduler.scheduleAbsolute(null, created, function() {
      ys = xs.singleInstance();
    });

    scheduler.scheduleAbsolute(null, subscribed, function() {
      disposable = new Rx.CompositeDisposable(
        ys.subscribe(results1),
        ys.subscribe(results2)
      );
    });

    scheduler.scheduleAbsolute(null, disposed, function() {
      disposable.dispose();
    });

    scheduler.start();

    results1.messages.assertEqual(
      onNext(300, 1),
      onNext(350, 2),
      onNext(400, 3),
      onCompleted(450)
    );

    results2.messages.assertEqual(
      onNext(300, 1),
      onNext(350, 2),
      onNext(400, 3),
      onCompleted(450)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 450)
    );
  });

  test('singleInstance can resubscribe after stopped', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(100, 1),
      onNext(150, 2),
      onNext(200, 3),
      onCompleted(250)
    );

    var ys;
    var results1 = scheduler.createObserver();
    var results2 = scheduler.createObserver();
    var disposable = new Rx.SerialDisposable();

    scheduler.scheduleAbsolute(null, 100, function() {
        ys = xs.singleInstance();
    });

    scheduler.scheduleAbsolute(null, 200, function() {
      disposable.setDisposable(ys.subscribe(results1));
    });

    scheduler.scheduleAbsolute(null, 600, function() {
      disposable.setDisposable(ys.subscribe(results2));
    });

    scheduler.scheduleAbsolute(null, 900, function(){
      disposable.dispose();
    });

    scheduler.start();

    results1.messages.assertEqual(
      onNext(300, 1),
      onNext(350, 2),
      onNext(400, 3),
      onCompleted(450)
    );

    results2.messages.assertEqual(
      onNext(700, 1),
      onNext(750, 2),
      onNext(800, 3),
      onCompleted(850)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 450),
      subscribe(600, 850)
    );
  });
}());
