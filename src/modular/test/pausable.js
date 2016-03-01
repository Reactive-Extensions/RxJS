var test = require('tape');
var Observable = require('../observable');
var Subject = require('../subject');
var Scheduler = require('../scheduler');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted;

Observable.addToPrototype({
  pausable: require('../observable/pausable')
});

test('Observable#pausable no skip', function (t) {
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

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(230, 3),
    onNext(301, 4),
    onNext(350, 5),
    onNext(399, 6),
    onCompleted(500)
  ]);

  t.end();
});

test('Observable#pausable skips', function (t) {
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

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(230, 3),
    onCompleted(500)
  ]);

  t.end();
});

test('Observable#pausable error', function (t) {
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

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onError(230, err)
  ]);

  t.end();
});

test('Observable#pausable with observable controller and pause and unpause', function (t) {
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

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(270, 4),
    onNext(450, 7),
    onCompleted(500)
  ]);

  t.end();
});

test('Observable#pausable with default controller and multiple subscriptions', function (t) {
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

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(230, 3),
    onNext(301, 4),
    onNext(350, 5),
    onNext(399, 6),
    onCompleted(500)
  ]);

  reactiveAssert(t, results2.messages, [
    onNext(301, 4),
    onNext(350, 5),
    onNext(399, 6),
    onCompleted(500)
  ]);

  t.end();
});

test('pausable is unaffected by currentThread scheduler', function (t) {
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
    Scheduler.currentThread.schedule(null, function () {
      subscription = xs.pausable(controller).subscribe(results);
      controller.onNext(true);
    });
  });

  scheduler.scheduleAbsolute(null, 1000, function () {
    subscription.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(230, 3),
    onNext(301, 4),
    onNext(350, 5),
    onNext(399, 6),
    onCompleted(500)
  ]);

  t.end();
});
