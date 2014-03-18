QUnit.module('PausableBuffered');

var TestScheduler = Rx.TestScheduler,
  Subject = Rx.Subject,
  onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe;

test('paused_no_skip', function () {
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

  scheduler.scheduleAbsolute(200, function () {
    subscription = xs.pausableBuffered(controller).subscribe(results);
    controller.onNext(true);
  });

  scheduler.scheduleAbsolute(205, function () {
    controller.onNext(false);
  });  

  scheduler.scheduleAbsolute(209, function () {
    controller.onNext(true);
  });  

  scheduler.scheduleAbsolute(1000, function () {
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

test('paused_skips', function () {
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

  scheduler.scheduleAbsolute(200, function () {
    subscription = xs.pausableBuffered(controller).subscribe(results);
    controller.onNext(true);
  });

  scheduler.scheduleAbsolute(300, function () {
    controller.onNext(false);
  });  

  scheduler.scheduleAbsolute(400, function () {
    controller.onNext(true);
  });  

  scheduler.scheduleAbsolute(1000, function () {
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

test('paused_error', function () {
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

  scheduler.scheduleAbsolute(200, function () {
    subscription = xs.pausableBuffered(controller).subscribe(results);
    controller.onNext(true);
  });

  scheduler.scheduleAbsolute(300, function () {
    controller.onNext(false);
  });  

  scheduler.scheduleAbsolute(400, function () {
    controller.onNext(true);
  });  

  scheduler.scheduleAbsolute(1000, function () {
      subscription.dispose();
  });

  scheduler.start();

  results.messages.assertEqual(
    onNext(210, 2),
    onError(230, err)
  );  
});