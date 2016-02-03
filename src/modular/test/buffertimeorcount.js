'use strict';

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe;

Observable.addToPrototype({
  bufferTimeOrCount: require('../observable/buffertimeorcount')
});

test('Observable#bufferTimeOrCount basic', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(205, 1),
    onNext(210, 2),
    onNext(240, 3),
    onNext(280, 4),
    onNext(320, 5),
    onNext(350, 6),
    onNext(370, 7),
    onNext(420, 8),
    onNext(470, 9),
    onCompleted(600)
  );

  var results = scheduler.startScheduler(function () {
    return xs.bufferTimeOrCount(70, 3, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(240, [1,2,3]),
    onNext(310, [4]),
    onNext(370, [5,6,7]),
    onNext(440, [8]),
    onNext(510, [9]),
    onNext(580, []),
    onNext(600, []),
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});

test('Observable#bufferTimeOrCount error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(205, 1),
    onNext(210, 2),
    onNext(240, 3),
    onNext(280, 4),
    onNext(320, 5),
    onNext(350, 6),
    onNext(370, 7),
    onNext(420, 8),
    onNext(470, 9),
    onError(600, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.bufferTimeOrCount(70, 3, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(240, [1,2,3]),
    onNext(310, [4]),
    onNext(370, [5,6,7]),
    onNext(440, [8]),
    onNext(510, [9]),
    onNext(580, []),
    onError(600, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});

test('Observable#bufferTimeOrCount disposed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(205, 1),
    onNext(210, 2),
    onNext(240, 3),
    onNext(280, 4),
    onNext(320, 5),
    onNext(350, 6),
    onNext(370, 7),
    onNext(420, 8),
    onNext(470, 9),
    onCompleted(600)
  );

  var results = scheduler.startScheduler(function () {
    return xs.bufferTimeOrCount(70, 3, scheduler);
  }, { disposed: 370 });

  reactiveAssert(t, results.messages, [
    onNext(240, [1,2,3]),
    onNext(310, [4]),
    onNext(370, [5,6,7])
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 370)
  ]);

  t.end();
});

test('Observable#bufferTimeOrCount multiple', function(t) {
  var scheduler = new TestScheduler();

  var xs1 = scheduler.createHotObservable(onCompleted(700))
    .bufferTimeOrCount(100, 3, scheduler);

  var xs2 = scheduler.createHotObservable(onCompleted(700))
    .bufferTimeOrCount(150, 4, scheduler);

  var results1 = scheduler.createObserver();
  var results2 = scheduler.createObserver();

  scheduler.scheduleAbsolute(null, 370, function (){
    xs1.subscribe(results1);
    xs2.subscribe(results2);
  });

  scheduler.start();

  reactiveAssert(t, results1.messages, [
    onNext(470, []),
    onNext(570, []),
    onNext(670, []),
    onNext(700, []),
    onCompleted(700)
  ]);

  reactiveAssert(t, results2.messages, [
    onNext(520, []),
    onNext(670, []),
    onNext(700, []),
    onCompleted(700)
  ]);

  t.end();
});
