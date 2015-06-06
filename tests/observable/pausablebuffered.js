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

test('paused_skip_initial_elements', function(){
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

  scheduler.scheduleAbsolute(200, function () {
    subscription = xs.pausableBuffered(controller).subscribe(results);
    controller.onNext(false);
  });

  scheduler.scheduleAbsolute(280, function () {
    controller.onNext(true);
  });

  scheduler.scheduleAbsolute(1000, function () {
    subscription.dispose();
  });

  scheduler.start();
  results.messages.assertEqual(
    onNext(280, 2),
    onNext(280, 3),
    onCompleted(400)
  );
});

test('paused_with_observable_controller_and_pause_and_unpause', function(){
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

  scheduler.scheduleAbsolute(200, function () {
    subscription = pausableBuffered.subscribe(results);
  });

  scheduler.scheduleAbsolute(460, function () {
    pausableBuffered.pause();
  });

  scheduler.scheduleAbsolute(480, function () {
    pausableBuffered.resume();
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

  scheduler.scheduleAbsolute(200, function () {
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

  scheduler.scheduleAbsolute(200, function () {
    subscription = pausableBuffered.subscribe(results);
  });

  scheduler.scheduleAbsolute(460, function () {
    pausableBuffered.pause();
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
    onNext(450, 7)
  );
});

test('paused with observable controller and pause and unpause after end', function(){
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
    onNext(600, true)
  );

  var results = scheduler.startWithCreate(function () {
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
    onError(500, error)
  );

  var controller = scheduler.createHotObservable(
    onNext(201, true),
    onNext(300, false),
    onNext(600, true)
  );

  var results = scheduler.startWithCreate(function () {
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

  scheduler.scheduleAbsolute(200, function () {
    subscription = pausableBuffered.subscribe(function(value){
      results.onNext(value);
      controller.onNext(false);
      scheduler.scheduleRelative(100, function(){
        controller.onNext(true);
      });
    }, results.onError.bind(results), results.onCompleted.bind(results));

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

test("pausableBuffered produces expected result", 1, function () {
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
