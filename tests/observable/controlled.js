QUnit.module('Controlled');

var TestScheduler = Rx.TestScheduler,
  onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe;

test('controlled gets some values', function () {
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
    onCompleted(500)
  );

  var controlled = xs.controlled();

  scheduler.scheduleAbsolute(200, function () {
    subscription = controlled.subscribe(results);
  });

  scheduler.scheduleAbsolute(400, function () {
    controlled.request(5);
  });

  scheduler.scheduleAbsolute(1000, function () {
      subscription.dispose();
  });

  scheduler.start();

  results.messages.assertEqual(
    onNext(400, 2),
    onNext(400, 3),
    onNext(400, 4),
    onNext(400, 5),
    onNext(400, 6),
    onCompleted(500)
  );
});

test('controlled gets two sets of values', function () {
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
    onCompleted(500)
  );

  var controlled = xs.controlled();

  scheduler.scheduleAbsolute(200, function () {
    subscription = controlled.subscribe(results);
  });

  scheduler.scheduleAbsolute(400, function () {
    controlled.request(3);
  });

  scheduler.scheduleAbsolute(450, function () {
    controlled.request(2);
  });

  scheduler.scheduleAbsolute(1000, function () {
      subscription.dispose();
  });

  scheduler.start();

  results.messages.assertEqual(
    onNext(400, 2),
    onNext(400, 3),
    onNext(400, 4),
    onNext(450, 5),
    onNext(450, 6),
    onCompleted(500)
  );
});
