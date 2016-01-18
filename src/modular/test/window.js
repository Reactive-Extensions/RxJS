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
  timer: require('../observable/timer')
});

Observable.addToPrototype({
  map: require('../observable/map'),
  mergeAll: require('../observable/mergeall'),
  window: require('../observable/window')
});


test('Observable#window closings basic', function (t) {
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
    return xs.window(function () {
      return Observable.timer(window++ * 100, null, scheduler);
    }).map(function (w, i) {
      return w.map(function (x) { return i + ' ' + x; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, '0 3'),
    onNext(260, '0 4'),
    onNext(310, '1 5'),
    onNext(340, '1 6'),
    onNext(410, '1 7'),
    onNext(420, '1 8'),
    onNext(470, '1 9'),
    onNext(550, '2 10'),
    onCompleted(590)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 590)
  ]);

  t.end();
});

test('Observable#window closings Dispose', function (t) {
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
    return xs.window(function () {
      return Observable.timer(window++ * 100, null, scheduler);
    }).map(function (w, i) {
      return w.map(function (x) { return i + ' ' + x; });
    }).mergeAll();
  }, { disposed: 400 });

  reactiveAssert(t, results.messages, [
    onNext(250, '0 3'),
    onNext(260, '0 4'),
    onNext(310, '1 5'),
    onNext(340, '1 6')
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  t.end();
});

test('Observable#window closings Error', function (t) {
  var error = new Error();

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
    onError(590, error)
  );

  var window = 1;

  var results = scheduler.startScheduler(function () {
    return xs.window(function () {
      return Observable.timer(window++ * 100, null, scheduler);
    }).map(function (w, i) {
      return w.map(function (x) { return i + ' ' + x; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, '0 3'),
    onNext(260, '0 4'),
    onNext(310, '1 5'),
    onNext(340, '1 6'),
    onNext(410, '1 7'),
    onNext(420, '1 8'),
    onNext(470, '1 9'),
    onNext(550, '2 10'),
    onError(590, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 590)
  ]);

  t.end();
});

test('Observable#window closings Throw', function (t) {
  var error = new Error();

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

  var results = scheduler.startScheduler(function () {
    return xs.window(function () { throw error; })
      .map(function (w, i) { return w.map(function (x) { return i + ' ' + x; }); })
      .mergeAll();
  });
  reactiveAssert(t, results.messages, [
    onError(200, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 200)
  ]);

  t.end();
});

test('Observable#window closings window close error', function (t) {
  var error = new Error();

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
    onCompleted(590));

  var results = scheduler.startScheduler(function () {
    return xs.window(function () {
      return Observable['throw'](error, scheduler);
    }).map(function (w, i) {
      return w.map(function (x) { return i + ' ' + x; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onError(201, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 201)
  ]);

  t.end();
});

test('Observable#window closings Default', function (t) {
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
    return xs.window(function () {
      return Observable.timer(window++ * 100, null, scheduler);
    }).map(function (w, i) {
      return w.map(function (x) { return i + ' ' + x; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, '0 3'),
    onNext(260, '0 4'),
    onNext(310, '1 5'),
    onNext(340, '1 6'),
    onNext(410, '1 7'),
    onNext(420, '1 8'),
    onNext(470, '1 9'),
    onNext(550, '2 10'),
    onCompleted(590)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 590)
  ]);

  t.end();
});

test('Observable#window opening closings basic', function (t) {
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
    return xs.window(ys, function (x) {
      return Observable.timer(x, null, scheduler);
    }).map(function (w, i) {
      return w.map(function (x) { return i + ' ' + x; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(260, '0 4'),
    onNext(340, '1 6'),
    onNext(410, '1 7'),
    onNext(410, '3 7'),
    onNext(420, '1 8'),
    onNext(420, '3 8'),
    onNext(470, '3 9'),
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

test('Observable#window opening closings throw', function (t) {
  var error = new Error();

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
    onCompleted(590));

  var ys = scheduler.createHotObservable(
    onNext(255, 50),
    onNext(330, 100),
    onNext(350, 50),
    onNext(400, 90),
    onCompleted(900));

  var results = scheduler.startScheduler(function () {
    return xs.window(ys, function () { throw error; })
      .map(function (w, i) { return w.map(function (x) { return i + ' ' + x; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onError(255, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 255)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 255)
  ]);

  t.end();
});

test('Observable#window opening closings dispose', function (t) {
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
    return xs.window(ys, function (x) {
      return Observable.timer(x, null, scheduler);
    }).map(function (w, i) {
      return w.map(function (x) { return i + ' ' + x; });
    }).mergeAll();
  }, { disposed: 415 });

  reactiveAssert(t, results.messages, [
    onNext(260, '0 4'),
    onNext(340, '1 6'),
    onNext(410, '1 7'),
    onNext(410, '3 7')
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 415)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 415)
  ]);

  t.end();
});

test('Observable#window opening closings data error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(180, 2),
    onNext(250, 3),
    onNext(260, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(410, 7),
    onError(415, error)
  );

  var ys = scheduler.createHotObservable(
    onNext(255, 50),
    onNext(330, 100),
    onNext(350, 50),
    onNext(400, 90),
    onCompleted(900)
  );

  var results = scheduler.startScheduler(function () {
    return xs.window(ys, function (x) {
      return Observable.timer(x, null, scheduler);
    }).map(function (w, i) {
        return w.map(function (x) { return i + ' ' + x; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(260, '0 4'),
    onNext(340, '1 6'),
    onNext(410, '1 7'),
    onNext(410, '3 7'),
    onError(415, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 415)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 415)
  ]);

  t.end();
});

test('Observable#window opening closings window error', function (t) {
  var error = new Error();

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
    onError(415, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.window(ys, function (x) {
      return Observable.timer(x, null, scheduler);
    }).map(function (w, i) {
      return w.map(function (x) { return i + ' ' + x; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(260, '0 4'),
    onNext(340, '1 6'),
    onNext(410, '1 7'),
    onNext(410, '3 7'),
    onError(415, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 415)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 415)
  ]);

  t.end();
});

test('Observable#window_Boundaries_Simple', function (t) {
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
    return xs.window(ys).map(function (w, i) {
      return w.map(function (x) { return i + ' ' + x; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, '0 3'),
    onNext(260, '1 4'),
    onNext(310, '1 5'),
    onNext(340, '2 6'),
    onNext(410, '4 7'),
    onNext(420, '4 8'),
    onNext(470, '4 9'),
    onNext(550, '5 10'),
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

test('Observable#window boundaries onCompleted boundaries', function (t) {
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
    return xs.window(ys).map(function (w, i) {
      return w.map(function (x) { return i + ' ' + x; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, '0 3'),
    onNext(260, '1 4'),
    onNext(310, '1 5'),
    onNext(340, '2 6'),
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

test('Observable#window boundaries onError source', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(180, 2),
    onNext(250, 3),
    onNext(260, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(380, 7),
    onError(400, error)
  );

  var ys = scheduler.createHotObservable(
    onNext(255, true),
    onNext(330, true),
    onNext(350, true),
    onCompleted(500)
  );

  var results = scheduler.startScheduler(function () {
    return xs.window(ys).map(function (w, i) {
      return w.map(function (x) { return i + ' ' + x; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, '0 3'),
    onNext(260, '1 4'),
    onNext(310, '1 5'),
    onNext(340, '2 6'),
    onNext(380, '3 7'),
    onError(400, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 400)
  ]);

  t.end();
});

test('Observable#window boundaries onError boundaries', function (t) {
  var error = new Error();

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
    onError(400, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.window(ys).map(function (w, i) {
      return w.map(function (x) {
        return i + ' ' + x;
      });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(250, '0 3'),
    onNext(260, '1 4'),
    onNext(310, '1 5'),
    onNext(340, '2 6'),
    onError(400, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 400)
  ]);

  t.end();
});
