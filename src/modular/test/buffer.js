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

Observable.addToObject({
  empty: require('../observable/empty'),
  'throw': require('../observable/throw'),
  timer: require('../observable/timer')
});

Observable.addToPrototype({
  buffer: require('../observable/buffer'),
  delay: require('../observable/delay')
});

test('Observable#buffer Boundaries Simple', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(180, 2),
    onNext(250, 3),
    onNext(260, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(410, 7),
    onNext(420, 8),
    onNext(470, 9),
    onNext(550, 10),
    onCompleted(590)
  );

  var ys = scheduler.createHotObservable(
    onNext(255, true),
    onNext(330, true),
    onNext(350, true),
    onNext(400, true),
    onNext(500, true),
    onCompleted(900)
  );

  var results = scheduler.startScheduler(function () {
    return xs.buffer(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(255, [3]),
    onNext(330, [4, 5]),
    onNext(350, [6]),
    onNext(400, [ ]),
    onNext(500, [7, 8, 9]),
    onNext(590, [10]),
    onCompleted(590)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 590)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 590)
  ]);

  t.end();
});

test('Observable#buffer Boundaries onCompleted Boundaries', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(180, 2),
    onNext(250, 3),
    onNext(260, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(410, 7),
    onNext(420, 8),
    onNext(470, 9),
    onNext(550, 10),
    onCompleted(590)
  );

  var ys = scheduler.createHotObservable(
    onNext(255, true),
    onNext(330, true),
    onNext(350, true),
    onCompleted(400)
  );

  var results = scheduler.startScheduler(function () {
    return xs.buffer(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(255, [3]),
    onNext(330, [4, 5]),
    onNext(350, [6]),
    onNext(400, []),
    onCompleted(400)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 400)
  ]);

  t.end();
});

test('Observable#buffer Boundaries onError Source', function (t) {
  var ex = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(180, 2),
    onNext(250, 3),
    onNext(260, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(380, 7),
    onError(400, ex)
  );

  var ys = scheduler.createHotObservable(
    onNext(255, true),
    onNext(330, true),
    onNext(350, true),
    onCompleted(500)
  );

  var results = scheduler.startScheduler(function () {
    return xs.buffer(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(255, [3]),
    onNext(330, [4, 5]),
    onNext(350, [6]),
    onError(400, ex)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 400)
  ]);

  t.end();
});

test('Observable#buffer Boundaries onError Boundaries', function (t) {
  var ex = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(180, 2),
    onNext(250, 3),
    onNext(260, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(410, 7),
    onNext(420, 8),
    onNext(470, 9),
    onNext(550, 10),
    onCompleted(590)
  );

  var ys = scheduler.createHotObservable(
    onNext(255, true),
    onNext(330, true),
    onNext(350, true),
    onError(400, ex)
  );

  var results = scheduler.startScheduler(function () {
    return xs.buffer(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(255, [3]),
    onNext(330, [4, 5]),
    onNext(350, [6]),
    onError(400, ex)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 400)
  ]);

  t.end();
});

test('Observable#buffer Closings Basic', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(180, 2),
    onNext(250, 3),
    onNext(260, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(410, 7),
    onNext(420, 8),
    onNext(470, 9),
    onNext(550, 10),
    onCompleted(590)
  );

  var window = 1;

  var results = scheduler.startScheduler(function () {
    return xs.buffer(function () { return Observable.timer((window++) * 100, scheduler); });
  });

  reactiveAssert(t, results.messages, [
    onNext(300, [ 3, 4 ]),
    onNext(500, [ 5, 6, 7, 8, 9 ]),
    onNext(590, [ 10 ]),
    onCompleted(590)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 590)
  ]);

  t.end();
});

test('Observable#buffer Closings Inner Subscriptions', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(180, 2),
    onNext(250, 3),
    onNext(260, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(410, 7),
    onNext(420, 8),
    onNext(470, 9),
    onNext(550, 10),
    onCompleted(590)
  );

  var closings = [
    scheduler.createHotObservable(
      onNext(300, true),
      onNext(350, false),
      onCompleted(380)
    ),
    scheduler.createHotObservable(
      onNext(400, true),
      onNext(510, false),
      onNext(620, false)
    ),
    scheduler.createHotObservable(
      onCompleted(500)
    ),
    scheduler.createHotObservable(
      onNext(600, true)
    )
  ];

  var window = 0;

  var results = scheduler.startScheduler(function () {
    return xs.buffer(function () { return closings[window++]; });
  });

  reactiveAssert(t, results.messages, [
      onNext(300, [3, 4 ]),
      onNext(400, [5, 6 ]),
      onNext(500, [7, 8, 9 ]),
      onNext(590, [10 ]),
      onCompleted(590)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 590)
  ]);

  reactiveAssert(t, closings[0].subscriptions, [
    subscribe(200, 300)
  ]);

  reactiveAssert(t, closings[1].subscriptions, [
    subscribe(300, 400)
  ]);

  reactiveAssert(t, closings[2].subscriptions, [
    subscribe(400, 500)
  ]);

  reactiveAssert(t, closings[3].subscriptions, [
    subscribe(500, 590)
  ]);

  t.end();
});

test('Observable#buffer Closings Empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(180, 2),
    onNext(250, 3),
    onNext(260, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(410, 7),
    onNext(420, 8),
    onNext(470, 9),
    onNext(550, 10),
    onCompleted(590)
  );

  var window = 1;

  var results = scheduler.startScheduler(function () {
    return xs.buffer(function () { return Observable.empty().delay((window++) * 100, scheduler); });
  });

  reactiveAssert(t, results.messages, [
    onNext(300, [3, 4]),
    onNext(500, [5, 6, 7, 8, 9]),
    onNext(590, [10]),
    onCompleted(590)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 590)
  ]);

  t.end();
});

test('Observable#buffer Closings Dispose', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(180, 2),
    onNext(250, 3),
    onNext(260, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(410, 7),
    onNext(420, 8),
    onNext(470, 9),
    onNext(550, 10),
    onCompleted(590)
  );

  var window = 1;

  var results = scheduler.startScheduler(
    function () {
      return xs.buffer(function () { return Observable.timer((window++) * 100, scheduler); });
    },
    { disposed: 400 }
  );

  reactiveAssert(t, results.messages, [
    onNext(300, [ 3, 4 ])
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  t.end();
});

test('Observable#buffer Closings Error', function (t) {
  var scheduler = new TestScheduler();

  var ex = new Error();

  var xs = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(180, 2),
    onNext(250, 3),
    onNext(260, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(410, 7),
    onNext(420, 8),
    onNext(470, 9),
    onNext(550, 10),
    onError(590, ex)
  );

  var window = 1;

  var results = scheduler.startScheduler(function () {
    return xs.buffer(function () { return Observable.timer((window++) * 100, scheduler); });
  });

  reactiveAssert(t, results.messages, [
    onNext(300, [ 3, 4 ]),
    onNext(500, [ 5, 6, 7, 8, 9 ]),
    onError(590, ex)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 590)
  ]);

  t.end();
});

test('Observable#buffer Closings Throw', function (t) {
  var scheduler = new TestScheduler();

  var ex = new Error();

  var xs = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(180, 2),
    onNext(250, 3),
    onNext(260, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(410, 7),
    onNext(420, 8),
    onNext(470, 9),
    onNext(550, 10),
    onError(590, new Error())
  );

  var results = scheduler.startScheduler(function () {
    return xs.buffer(function () { throw ex; });
  });

  reactiveAssert(t, results.messages, [
    onError(200, ex)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 200)
  ]);

  t.end();
});

test('Observable#buffer Closings Window Close Error', function (t) {
  var scheduler = new TestScheduler();

  var ex = new Error();

  var xs = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(180, 2),
    onNext(250, 3),
    onNext(260, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(410, 7),
    onNext(420, 8),
    onNext(470, 9),
    onNext(550, 10),
    onError(590, new Error())
  );

  var results = scheduler.startScheduler(function () {
    return xs.buffer(function () { return Observable['throw'](ex, scheduler); });
  });

  reactiveAssert(t, results.messages, [
    onError(201, ex)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 201)
  ]);

  t.end();
});

test('Observable#buffer Opening Closings Basic', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(180, 2),
    onNext(250, 3),
    onNext(260, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(410, 7),
    onNext(420, 8),
    onNext(470, 9),
    onNext(550, 10),
    onCompleted(590)
  );

  var ys = scheduler.createHotObservable(
    onNext(255, 50),
    onNext(330, 100),
    onNext(350, 50),
    onNext(400, 90),
    onCompleted(900)
  );

  var results = scheduler.startScheduler(function () {
    return xs.buffer(ys, function (x) { return Observable.timer(x, null, scheduler); });
  });

  reactiveAssert(t, results.messages, [
    onNext(305, [4 ]),
    onNext(400, [ ]),
    onNext(430, [6, 7, 8]),
    onNext(490, [7, 8, 9]),
    onCompleted(900)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 900)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 900)
  ]);

  t.end();
});
