
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
  debounce: require('../observable/debounce')
});

test('Observable#debounce empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 0),
    onCompleted(300)
  );

  var results = scheduler.startScheduler(function () {
    return xs.debounce(10, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(300)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 300)
  ]);

  t.end();
});

test('Observable#debounce error', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error();

  var xs = scheduler.createHotObservable(
    onNext(150, 0),
    onError(300, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.debounce(10, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(300, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 300)
  ]);

  t.end();
});

test('Observable#debounce Never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 0)
  );

  var results = scheduler.startScheduler(function () {
    return xs.debounce(10, scheduler);
  });

  reactiveAssert(t, results.messages, [
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('Observable#debounce all pass', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(300, 2),
    onNext(351, 3),
    onCompleted(400)
  );

  var results = scheduler.startScheduler(function(){
    return xs.debounce(50, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(260, 1),
    onNext(350, 2),
    onNext(400, 3),
    onCompleted(400)
  ]);

  t.end();
});

test('Observable#debounce relative time all pass', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 0),
    onNext(210, 1),
    onNext(240, 2),
    onNext(270, 3),
    onNext(300, 4),
    onCompleted(400)
  );

  var results = scheduler.startScheduler(function () {
    return xs.debounce(function () { return Observable.timer(20, scheduler); });
  });

  reactiveAssert(t, results.messages, [
    onNext(230, 1),
    onNext(260, 2),
    onNext(290, 3),
    onNext(320, 4),
    onCompleted(400)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  t.end();
});

test('Observable#debounce relative time all pass error on end', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 0),
    onNext(210, 1),
    onNext(240, 2),
    onNext(270, 3),
    onNext(300, 4),
    onError(400, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.debounce(function () { return Observable.timer(20, scheduler); });
  });

  reactiveAssert(t, results.messages, [
    onNext(230, 1),
    onNext(260, 2),
    onNext(290, 3),
    onNext(320, 4),
    onError(400, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  t.end();
});

test('Observable#debounce relative time all drop', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 0),
    onNext(210, 1),
    onNext(240, 2),
    onNext(270, 3),
    onNext(300, 4),
    onNext(330, 5),
    onNext(360, 6),
    onNext(390, 7),
    onCompleted(400)
  );

  var results = scheduler.startScheduler(function () {
    return xs.debounce(function () { return Observable.timer(40, scheduler); });
  });

  reactiveAssert(t, results.messages, [
    onNext(400, 7),
    onCompleted(400)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  t.end();
});

test('Observable#debounce relative time all drop error on end', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 0),
    onNext(210, 1),
    onNext(240, 2),
    onNext(270, 3),
    onNext(300, 4),
    onNext(330, 5),
    onNext(360, 6),
    onNext(390, 7),
    onError(400, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.debounce(40, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(400, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  t.end();
});

test('Observable#debounce duration DelayBehavior', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, -1),
    onNext(250, 0),
    onNext(280, 1),
    onNext(310, 2),
    onNext(350, 3),
    onNext(400, 4),
    onCompleted(550)
  );

  var ys = [
    scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)),
    scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)),
    scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)),
    scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)),
    scheduler.createColdObservable(onNext(20, 42), onNext(25, 99))
  ];

  var results = scheduler.startScheduler(function () {
    return xs.debounce(function (x) { return ys[x]; });
  });

  reactiveAssert(t, results.messages, [
    onNext(250 + 20, 0),
    onNext(280 + 20, 1),
    onNext(310 + 20, 2),
    onNext(350 + 20, 3),
    onNext(400 + 20, 4),
    onCompleted(550)
  ]);

  reactiveAssert(t, xs.subscriptions, [subscribe(200, 550)]);

  reactiveAssert(t, ys[0].subscriptions, [subscribe(250, 250 + 20)]);
  reactiveAssert(t, ys[1].subscriptions, [subscribe(280, 280 + 20)]);
  reactiveAssert(t, ys[2].subscriptions, [subscribe(310, 310 + 20)]);
  reactiveAssert(t, ys[3].subscriptions, [subscribe(350, 350 + 20)]);
  reactiveAssert(t, ys[4].subscriptions, [subscribe(400, 400 + 20)]);

  t.end();
});

test('Observable#debounce duration debounce behavior', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, -1),
    onNext(250, 0),
    onNext(280, 1),
    onNext(310, 2),
    onNext(350, 3),
    onNext(400, 4),
    onCompleted(550));

  var ys = [
    scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)),
    scheduler.createColdObservable(onNext(40, 42), onNext(45, 99)),
    scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)),
    scheduler.createColdObservable(onNext(60, 42), onNext(65, 99)),
    scheduler.createColdObservable(onNext(20, 42), onNext(25, 99))];

  var results = scheduler.startScheduler(function () {
    return xs.debounce(function (x) { return ys[x]; });
  });

  reactiveAssert(t, results.messages, [
    onNext(250 + 20, 0),
    onNext(310 + 20, 2),
    onNext(400 + 20, 4),
    onCompleted(550)
  ]);

  reactiveAssert(t, xs.subscriptions, [subscribe(200, 550)]);

  reactiveAssert(t, ys[0].subscriptions, [subscribe(250, 250 + 20)]);
  reactiveAssert(t, ys[1].subscriptions, [subscribe(280, 310)]);
  reactiveAssert(t, ys[2].subscriptions, [subscribe(310, 310 + 20)]);
  reactiveAssert(t, ys[3].subscriptions, [subscribe(350, 400)]);
  reactiveAssert(t, ys[4].subscriptions, [subscribe(400, 400 + 20)]);

  t.end();
});

test('Observable#debounce duration early completion', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, -1),
    onNext(250, 0),
    onNext(280, 1),
    onNext(310, 2),
    onNext(350, 3),
    onNext(400, 4),
    onCompleted(410));

  var ys = [
    scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)),
    scheduler.createColdObservable(onNext(40, 42), onNext(45, 99)),
    scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)),
    scheduler.createColdObservable(onNext(60, 42), onNext(65, 99)),
    scheduler.createColdObservable(onNext(20, 42), onNext(25, 99))];

  var results = scheduler.startScheduler(function () {
    return xs.debounce(function (x) { return ys[x]; });
  });

  reactiveAssert(t, results.messages, [
    onNext(250 + 20, 0),
    onNext(310 + 20, 2),
    onNext(410, 4),
    onCompleted(410)
  ]);

  reactiveAssert(t, xs.subscriptions, [subscribe(200, 410)]);

  reactiveAssert(t, ys[0].subscriptions, [subscribe(250, 250 + 20)]);
  reactiveAssert(t, ys[1].subscriptions, [subscribe(280, 310)]);
  reactiveAssert(t, ys[2].subscriptions, [subscribe(310, 310 + 20)]);
  reactiveAssert(t, ys[3].subscriptions, [subscribe(350, 400)]);
  reactiveAssert(t, ys[4].subscriptions, [subscribe(400, 410)]);

  t.end();
});

test('Observable#debounce duration inner error', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(250, 2),
    onNext(350, 3),
    onNext(450, 4),
    onCompleted(550)
  );

  var error = new Error();

  var results = scheduler.startScheduler(function () {
    return xs.debounce(function (x) {
      if (x < 4) {
        return scheduler.createColdObservable(
          onNext(x * 10, 'Ignore'),
          onNext(x * 10 + 5, 'Aargh!')
        );
      } else {
        return scheduler.createColdObservable(
          onError(x * 10, error)
        );
      }
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(250 + 2 * 10, 2),
    onNext(350 + 3 * 10, 3),
    onError(450 + 4 * 10, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 490)
  ]);

  t.end();
});

test('Observable#debounce duration outer error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(250, 2),
    onNext(350, 3),
    onNext(450, 4),
    onError(460, error));

  var results = scheduler.startScheduler(function () {
    return xs.debounce(function (x) {
      return scheduler.createColdObservable(
        onNext(x * 10, 'Ignore'),
        onNext(x * 10 + 5, 'Aargh!')
      );
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(250 + 2 * 10, 2),
    onNext(350 + 3 * 10, 3),
    onError(460, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 460)
  ]);

  t.end();
});

test('Observable#debounce duration selector throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(250, 2),
    onNext(350, 3),
    onNext(450, 4),
    onCompleted(550)
  );

  var results = scheduler.startScheduler(function () {
    return xs.debounce(function (x) {
      if (x < 4) {
        return scheduler.createColdObservable(
          onNext(x * 10, 'Ignore'),
          onNext(x * 10 + 5, 'Aargh!')
        );
      }
      throw error;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(250 + 2 * 10, 2),
    onNext(350 + 3 * 10, 3),
    onError(450, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 450)
  ]);

  t.end();
});

test('Observable#debounce duration inner done delay behavior', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(250, 2),
    onNext(350, 3),
    onNext(450, 4),
    onCompleted(550));

  var results = scheduler.startScheduler(function () {
    return xs.debounce(function (x) {
      return scheduler.createColdObservable(onCompleted(x * 10));
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(250 + 2 * 10, 2),
    onNext(350 + 3 * 10, 3),
    onNext(450 + 4 * 10, 4),
    onCompleted(550)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 550)
  ]);

  t.end();
});

test('Observable#debounce duration inner done debounce behavior', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(250, 2),
    onNext(280, 3),
    onNext(300, 4),
    onNext(400, 5),
    onNext(410, 6),
    onCompleted(550));

  var results = scheduler.startScheduler(function () {
    return xs.debounce(function (x) {
      return scheduler.createColdObservable(onCompleted(x * 10));
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(250 + 2 * 10, 2),
    onNext(300 + 4 * 10, 4),
    onNext(410 + 6 * 10, 6),
    onCompleted(550)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 550)
  ]);

  t.end();
});
