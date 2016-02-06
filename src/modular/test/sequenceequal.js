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
  sequenceEqual: require('../observable/sequenceequal')
});

test('Observable#sequenceEqual equal', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(190, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(450, 7),
    onCompleted(510)
  );

  var ys = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(270, 3),
    onNext(280, 4),
    onNext(300, 5),
    onNext(330, 6),
    onNext(340, 7),
    onCompleted(720)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sequenceEqual(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(720, true),
    onCompleted(720)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 720)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 720)
  ]);

  t.end();
});

test('Observable#sequenceEqual equal sym', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(190, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(450, 7),
    onCompleted(510)
  );

  var ys = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(270, 3),
    onNext(280, 4),
    onNext(300, 5),
    onNext(330, 6),
    onNext(340, 7),
    onCompleted(720)
  );

  var results = scheduler.startScheduler(function () {
    return ys.sequenceEqual(xs);
  });

  reactiveAssert(t, results.messages, [
    onNext(720, true),
    onCompleted(720)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 720)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 720)
  ]);

  t.end();
});

test('Observable#sequenceEqual not equal Left', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(190, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(310, 0),
    onNext(340, 6),
    onNext(450, 7),
    onCompleted(510)
  );

  var ys = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(270, 3),
    onNext(280, 4),
    onNext(300, 5),
    onNext(330, 6),
    onNext(340, 7),
    onCompleted(720)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sequenceEqual(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(310, false),
    onCompleted(310)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 310)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 310)
  ]);

  t.end();
});

test('Observable#sequenceEqual not equal left sym', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(190, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(310, 0),
    onNext(340, 6),
    onNext(450, 7),
    onCompleted(510)
  );

  var ys = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(270, 3),
    onNext(280, 4),
    onNext(300, 5),
    onNext(330, 6),
    onNext(340, 7),
    onCompleted(720)
  );

  var results = scheduler.startScheduler(function () {
    return ys.sequenceEqual(xs);
  });

  reactiveAssert(t, results.messages, [
    onNext(310, false),
    onCompleted(310)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 310)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 310)
  ]);

  t.end();
});

test('Observable#sequenceEqual not equal right', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(190, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(450, 7),
    onCompleted(510)
  );

  var ys = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(270, 3),
    onNext(280, 4),
    onNext(300, 5),
    onNext(330, 6),
    onNext(340, 7),
    onNext(350, 8)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sequenceEqual(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(510, false),
    onCompleted(510)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 510)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 510)
  ]);

  t.end();
});

test('Observable#sequenceEqual not equal right sym', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(190, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(450, 7),
    onCompleted(510)
  );

  var ys = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(270, 3),
    onNext(280, 4),
    onNext(300, 5),
    onNext(330, 6),
    onNext(340, 7),
    onNext(350, 8)
  );

  var results = scheduler.startScheduler(function () {
    return ys.sequenceEqual(xs);
  });

  reactiveAssert(t, results.messages, [
    onNext(510, false),
    onCompleted(510)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 510)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 510)
  ]);

  t.end();
});

test('Observable#sequenceEqual not equal 2', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(190, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(450, 7),
    onNext(490, 8),
    onNext(520, 9),
    onNext(580, 10),
    onNext(600, 11)
  );

  var ys = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(270, 3),
    onNext(280, 4),
    onNext(300, 5),
    onNext(330, 6),
    onNext(340, 7),
    onNext(350, 9),
    onNext(400, 9),
    onNext(410, 10),
    onNext(490, 11),
    onNext(550, 12),
    onNext(560, 13)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sequenceEqual(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(490, false),
    onCompleted(490)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 490)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 490)
  ]);

  t.end();
});

test('Observable#sequenceEqual not equal 2 sym', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(190, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(450, 7),
    onNext(490, 8),
    onNext(520, 9),
    onNext(580, 10),
    onNext(600, 11)
  );

  var ys = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(270, 3),
    onNext(280, 4),
    onNext(300, 5),
    onNext(330, 6),
    onNext(340, 7),
    onNext(350, 9),
    onNext(400, 9),
    onNext(410, 10),
    onNext(490, 11),
    onNext(550, 12),
    onNext(560, 13)
  );

  var results = scheduler.startScheduler(function () {
    return ys.sequenceEqual(xs);
  });

  reactiveAssert(t, results.messages, [
    onNext(490, false),
    onCompleted(490)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 490)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 490)
  ]);

  t.end();
});

test('Observable#sequenceEqual not equal 3', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(190, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(310, 5),
    onCompleted(330)
  );

  var ys = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(270, 3),
    onNext(400, 4),
    onCompleted(420)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sequenceEqual(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(420, false),
    onCompleted(420)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 420)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 420)
  ]);

  t.end();
});

test('Observable#sequenceEqual not equal 3 sym', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(190, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(310, 5),
    onCompleted(330)
  );

  var ys = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(270, 3),
    onNext(400, 4),
    onCompleted(420)
  );

  var results = scheduler.startScheduler(function () {
    return ys.sequenceEqual(xs);
  });

  reactiveAssert(t, results.messages, [
    onNext(420, false),
    onCompleted(420)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 420)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 420)
  ]);

  t.end();
});

test('Observable#sequenceEqual comparer throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(190, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(310, 5),
    onCompleted(330)
  );

  var ys = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(270, 3),
    onNext(400, 4),
    onCompleted(420)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sequenceEqual(ys, function () { throw error; });
  });

  reactiveAssert(t, results.messages, [
    onError(270, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 270)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 270)
  ]);

  t.end();
});

test('Observable#sequenceEqual comparer throws sym', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(190, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(310, 5),
    onCompleted(330)
  );

  var ys = scheduler.createHotObservable(
    onNext(90, 1),
    onNext(270, 3),
    onNext(400, 4),
    onCompleted(420)
  );

  var results = scheduler.startScheduler(function () {
    return ys.sequenceEqual(xs, function () { throw error; });
  });

  reactiveAssert(t, results.messages, [
    onError(270, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 270)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 270)
  ]);

  t.end();
});

test('Observable#sequenceEqual not equal 4', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(250, 1),
    onCompleted(300)
  );

  var ys = scheduler.createHotObservable(
    onNext(290, 1),
    onNext(310, 2),
    onCompleted(350)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sequenceEqual(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(310, false),
    onCompleted(310)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 310)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 310)
  ]);

  t.end();
});

test('Observable#sequenceEqual not equal 4 sym', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(250, 1),
    onCompleted(300)
  );

  var ys = scheduler.createHotObservable(
    onNext(290, 1),
    onNext(310, 2),
    onCompleted(350)
  );

  var results = scheduler.startScheduler(function () {
    return ys.sequenceEqual(xs);
  });

  reactiveAssert(t, results.messages, [
    onNext(310, false),
    onCompleted(310)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 310)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 310)
  ]);

  t.end();
});

// SequenceEqual Array
test('Observable#sequenceEqual iterable equal', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(190, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(450, 7),
    onCompleted(510)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sequenceEqual([3, 4, 5, 6, 7]);
  });

  reactiveAssert(t, results.messages, [
    onNext(510, true),
    onCompleted(510)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 510)
  ]);

  t.end();
});

test('Observable#sequenceEqual iterable not equal elements', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(190, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(450, 7),
    onCompleted(510)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sequenceEqual([3, 4, 9, 6, 7]);
  });

  reactiveAssert(t, results.messages, [
    onNext(310, false),
    onCompleted(310)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 310)
  ]);

  t.end();
});

test('Observable#sequenceEqual iterable comparer equal', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(190, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(450, 7),
    onCompleted(510)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sequenceEqual([3 - 2, 4, 5, 6 + 42, 7 - 6], function (x, y) {
      return x % 2 === y % 2;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(510, true),
    onCompleted(510)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 510)
  ]);

  t.end();
});

test('Observable#sequenceEqual iterable comparer not equal', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(190, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(450, 7),
    onCompleted(510)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sequenceEqual([3 - 2, 4, 5 + 9, 6 + 42, 7 - 6], function (x, y) {
      return x % 2 === y % 2;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(310, false),
    onCompleted(310)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 310)
  ]);

  t.end();
});

function throwComparer(value, exn) {
  return function (x, y) {
    if (x === value) { throw exn; }
    return x === y;
  };
}

test('Observable#sequenceEqual iterable comparer throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(190, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(450, 7),
    onCompleted(510)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sequenceEqual([3, 4, 5, 6, 7], throwComparer(5, error));
  });

  reactiveAssert(t, results.messages, [
    onError(310, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 310)
  ]);

  t.end();
});

test('Observable#sequenceEqual iterable not equal too long', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(190, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(450, 7),
    onCompleted(510)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sequenceEqual([3, 4, 5, 6, 7, 8]);
  });

  reactiveAssert(t, results.messages, [
    onNext(510, false),
    onCompleted(510)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 510)
  ]);

  t.end();
});

test('Observable#sequenceEqual iterable not equal too short', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(190, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(310, 5),
    onNext(340, 6),
    onNext(450, 7),
    onCompleted(510)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sequenceEqual([3, 4, 5, 6]);
  });

  reactiveAssert(t, results.messages, [
    onNext(450, false),
    onCompleted(450)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 450)
  ]);

  t.end();
});

test('Observable#sequenceEqual iterable on error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(190, 2),
    onNext(240, 3),
    onNext(290, 4),
    onError(310, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.sequenceEqual([3, 4]);
  });

  reactiveAssert(t, results.messages, [
    onError(310, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 310)
  ]);

  t.end();
});
