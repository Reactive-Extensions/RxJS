(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('pausable');

  var TestScheduler = Rx.TestScheduler,
    Subject = Rx.Subject,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted;

  test('paused no skip', function () {
    var subscription;

    var scheduler = new TestScheduler();

    var controller = new Subject();

    var results = scheduler.createObserver();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onCompleted(500)
    );

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = xs.pausable(controller).subscribe(results);
      controller.onNext(true);
    });

    scheduler.scheduleAbsolute(null, 205, function () {
      controller.onNext(false);
    });

    scheduler.scheduleAbsolute(null, 209, function () {
      controller.onNext(true);
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
        subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onCompleted(500)
    );
  });

  test('paused skips', function () {
    var subscription;

    var scheduler = new TestScheduler();

    var controller = new Subject();

    var results = scheduler.createObserver();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onCompleted(500)
    );

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = xs.pausable(controller).subscribe(results);
      controller.onNext(true);
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      controller.onNext(false);
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      controller.onNext(true);
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
        subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(230, 3),
      onCompleted(500)
    );
  });

  test('paused error', function () {
    var subscription;

    var err = new Error();
    var scheduler = new TestScheduler();

    var controller = new Subject();

    var results = scheduler.createObserver();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onError(230, err),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onCompleted(500)
    );

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = xs.pausable(controller).subscribe(results);
      controller.onNext(true);
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      controller.onNext(false);
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      controller.onNext(true);
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(210, 2),
      onError(230, err)
    );
  });

  test('paused with observable controller and pause and unpause', function(){
    var subscription;

    var scheduler = new TestScheduler();

    var results = scheduler.createObserver();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(270, 4),
      onNext(301, 5),
      onNext(350, 6),
      onNext(450, 7),
      onCompleted(500)
    );

    var controller = scheduler.createHotObservable(
      onNext(201, true),
      onNext(220, false),
      onNext(250, true)
    );

    var pausable = xs.pausable(controller);

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = pausable.subscribe(results);
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      pausable.pause();
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      pausable.resume();
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(270, 4),
      onNext(450, 7),
      onCompleted(500)
    );
  });

  test('paused with default controller and multiple subscriptions', function () {
    var paused, subscription, subscription2;

    var scheduler = new TestScheduler();

    var results = scheduler.createObserver();
    var results2 = scheduler.createObserver();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onCompleted(500)
    );

    scheduler.scheduleAbsolute(null, 200, function () {
      paused = xs.pausable();
      subscription = paused.subscribe(results);
      paused.resume();
    });

    scheduler.scheduleAbsolute(null, 240, function () {
      subscription2 = paused.subscribe(results2);
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
      subscription2.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onCompleted(500)
    );

    results2.messages.assertEqual(
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onCompleted(500)
    );
  });

  test('pausable is unaffected by currentThread scheduler', function () {
    var subscription;

    var scheduler = new TestScheduler();

    var controller = new Subject();

    var results = scheduler.createObserver();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onCompleted(500)
    );

    scheduler.scheduleAbsolute(null, 200, function () {
      Rx.Scheduler.currentThread.schedule(null, function () {
        subscription = xs.pausable(controller).subscribe(results);
        controller.onNext(true);
      });
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onCompleted(500)
    );
  });
  
}());
