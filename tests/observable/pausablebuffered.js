(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('PausableBuffered');

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
      subscription = xs.pausableBuffered(controller).subscribe(results);
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
      subscription = xs.pausableBuffered(controller).subscribe(results);
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
      onNext(400, 4),
      onNext(400, 5),
      onNext(400, 6),
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
      subscription = xs.pausableBuffered(controller).subscribe(results);
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

  test('paused skip initial elements', function(){
    var subscription;

    var scheduler = new TestScheduler();

    var controller = new Subject();

    var results = scheduler.createObserver();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(230, 2),
      onNext(270, 3),
      onCompleted(400)
    );

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = xs.pausableBuffered(controller).subscribe(results);
      controller.onNext(false);
    });

    scheduler.scheduleAbsolute(null, 280, function () {
      controller.onNext(true);
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
    });

    scheduler.start();
    results.messages.assertEqual(
      onNext(280, 2),
      onNext(280, 3),
      onCompleted(400)
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
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onNext(450, 7),
      onNext(470, 8),
      onCompleted(500)
    );

    var controller = scheduler.createHotObservable(
      onNext(201, true),
      onNext(300, false),
      onNext(400, true)
    );

    var pausableBuffered = xs.pausableBuffered(controller);

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = pausableBuffered.subscribe(results);
    });

    scheduler.scheduleAbsolute(null, 460, function () {
      pausableBuffered.pause();
    });

    scheduler.scheduleAbsolute(null, 480, function () {
      pausableBuffered.resume();
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(230, 3),
      onNext(400, 4),
      onNext(400, 5),
      onNext(400, 6),
      onNext(450, 7),
      onNext(480, 8),
      onCompleted(500)
    );
  });

  test('paused with immediate unpause', function(){
    var subscription;

    var scheduler = new TestScheduler();

    var results = scheduler.createObserver();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(500)
    );

    var controller = Rx.Observable.just(true);

    var pausableBuffered = xs.pausableBuffered(controller);

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = pausableBuffered.subscribe(results);
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(210, 2),
      onCompleted(500)
    );

  });

  test('paused when finishing', function () {
    var subscription;

    var scheduler = new TestScheduler();

    var results = scheduler.createObserver();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onNext(450, 7),
      onNext(470, 8),
      onCompleted(500)
    );

    var controller = scheduler.createHotObservable(
      onNext(201, true),
      onNext(300, false),
      onNext(400, true)
    );

    var pausableBuffered = xs.pausableBuffered(controller);

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = pausableBuffered.subscribe(results);
    });

    scheduler.scheduleAbsolute(null, 460, function () {
      pausableBuffered.pause();
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(230, 3),
      onNext(400, 4),
      onNext(400, 5),
      onNext(400, 6),
      onNext(450, 7)
    );
  });

  test('paused with observable controller and pause and unpause after end', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onNext(450, 7),
      onNext(470, 8),
      onCompleted(500)
    );

    var controller = scheduler.createHotObservable(
      onNext(201, true),
      onNext(300, false),
      onNext(600, true)
    );

    var results = scheduler.startScheduler(function () {
      return xs.pausableBuffered(controller);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(230, 3),
      onNext(600, 4),
      onNext(600, 5),
      onNext(600, 6),
      onNext(600, 7),
      onNext(600, 8),
      onCompleted(600)
    );
  });

  test('paused with observable controller and pause and unpause after error', function(){
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onNext(450, 7),
      onNext(470, 8),
      onError(500, error)
    );

    var controller = scheduler.createHotObservable(
      onNext(201, true),
      onNext(300, false),
      onNext(600, true)
    );

    var results = scheduler.startScheduler(function () {
      return xs.pausableBuffered(controller);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(230, 3),
      onNext(600, 4),
      onNext(600, 5),
      onNext(600, 6),
      onNext(600, 7),
      onNext(600, 8),
      onError(600, error)
    );
  });

  test('paused with state change in subscriber', function(){
    var subscription;

    var scheduler = new TestScheduler();

    var results = scheduler.createObserver();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(250, 3),
      onNext(270, 4),
      onNext(330, 5),
      onCompleted(500)
    );

    var controller = new Rx.Subject();

    var pausableBuffered = xs.pausableBuffered(controller);

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = pausableBuffered.subscribe(
        function(value){
          results.onNext(value);
          controller.onNext(false);
          scheduler.scheduleRelative(null, 100, function () { controller.onNext(true); });
        },
        function (e) { results.onError(e); },
        function () { results.onCompleted(); }
      );

      controller.onNext(true);
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(310, 3),
      onNext(310, 4),
      onNext(410, 5),
      onCompleted(500)
    );
  });

  test('pausableBuffered produces expected result', 1, function () {
    var data = new Rx.Subject();
    var signal = new Rx.Subject();
    var p = data.pausableBuffered(signal);
    var results = [];
    p.subscribe(function (value) { results.push(value); });

    data.onNext(1);
    signal.onNext(false);
    signal.onNext(true);

    QUnit.deepEqual(results, [1]);
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
      paused = xs.pausableBuffered();
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

  test('pausableBuffered is unaffected by currentThread scheduler', function () {
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
        subscription = xs.pausableBuffered(controller).subscribe(results);
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
