'use strict';

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

Observable.addToObject({
  just: require('../observable/just')
});

Observable.addToPrototype({
  pausableBuffered: require('../observable/pausablebuffered')
});

test('Observable#pausableBuffered no skip', function (t) {
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

test('Observable#pausableBuffered skips', function (t) {
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

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(230, 3),
    onNext(400, 4),
    onNext(400, 5),
    onNext(400, 6),
    onCompleted(500)
  ]);

  t.end();
});

test('Observable#pausableBuffered error', function (t) {
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

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onError(230, err)
  ]);

  t.end();
});

test('Observable#pausableBuffered skip initial elements', function (t) {
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

  reactiveAssert(t, results.messages, [
    onNext(280, 2),
    onNext(280, 3),
    onCompleted(400)
  ]);

  t.end();
});

test('Observable#pausableBuffered with observable controller and pause and unpause', function (t) {
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

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(230, 3),
    onNext(400, 4),
    onNext(400, 5),
    onNext(400, 6),
    onNext(450, 7),
    onNext(480, 8),
    onCompleted(500)
  ]);

  t.end();
});

test('Observable#pausableBuffered with immediate unpause', function (t) {
  var subscription;

  var scheduler = new TestScheduler();

  var results = scheduler.createObserver();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(500)
  );

  var controller = Observable.just(true);

  var pausableBuffered = xs.pausableBuffered(controller);

  scheduler.scheduleAbsolute(null, 200, function () {
    subscription = pausableBuffered.subscribe(results);
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onCompleted(500)
  ]);

  t.end();
});

test('Observable#pausableBuffered when finishing', function (t) {
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

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(230, 3),
    onNext(400, 4),
    onNext(400, 5),
    onNext(400, 6),
    onNext(450, 7)
  ]);

  t.end();
});

test('Observable#pausableBuffered with observable controller and pause and unpause after end', function (t) {
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

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(230, 3),
    onNext(600, 4),
    onNext(600, 5),
    onNext(600, 6),
    onNext(600, 7),
    onNext(600, 8),
    onCompleted(600)
  ]);

  t.end();
});

test('Observable#pausableBuffered with observable controller and pause and unpause after error', function (t) {
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

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(230, 3),
    onNext(600, 4),
    onNext(600, 5),
    onNext(600, 6),
    onNext(600, 7),
    onNext(600, 8),
    onError(600, error)
  ]);

  t.end();
});

test('Observable#pausableBuffered with state change in subscriber', function (t) {
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

  var controller = new Subject();

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

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(310, 3),
    onNext(310, 4),
    onNext(410, 5),
    onCompleted(500)
  ]);

  t.end();
});

test('pausableBuffered produces expected result', function (t) {
  var data = new Subject();
  var signal = new Subject();
  var p = data.pausableBuffered(signal);
  var results = [];
  p.subscribe(function (value) { results.push(value); });

  data.onNext(1);
  signal.onNext(false);
  signal.onNext(true);

  t.deepEqual(results, [1]);

  t.end();
});

test('Observable#pausableBuffered with default controller and multiple subscriptions', function (t) {
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

test('pausableBuffered is unaffected by currentThread scheduler', function (t) {
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
      subscription = xs.pausableBuffered(controller).subscribe(results);
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
