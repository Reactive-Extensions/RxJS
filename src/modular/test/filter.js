'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var Observable = require('../observable');
var SerialDisposable = require('../serialdisposable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe,
  created = ReactiveTest.created,
  subscribed = ReactiveTest.subscribed,
  disposed = ReactiveTest.disposed;

Observable.addToPrototype({
  filter: require('../observable/filter'),
  map: require('../observable/map')
});

function isPrime(i) {
  if (i <= 1) { return false; }
  var max = Math.floor(Math.sqrt(i));
  for (var j = 2; j <= max; ++j) {
    if (i % j === 0) { return false; }
  }
  return true;
}

test('Observable#filter complete', function (t) {
  var scheduler = new TestScheduler();

  var invoked = 0;

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(180, 2),
    onNext(230, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(380, 6),
    onNext(390, 7),
    onNext(450, 8),
    onNext(470, 9),
    onNext(560, 10),
    onNext(580, 11),
    onCompleted(600),
    onNext(610, 12),
    onError(620, new Error()),
    onCompleted(630));

  var results = scheduler.startScheduler(function () {
    return xs.filter(function (x) {
      invoked++;
      return isPrime(x);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(230, 3),
    onNext(340, 5),
    onNext(390, 7),
    onNext(580, 11),
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.equal(9, invoked);

  t.end();
});

test('Observable#filter true', function (t) {
  var scheduler = new TestScheduler();

  var invoked = 0;

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(180, 2),
    onNext(230, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(380, 6),
    onNext(390, 7),
    onNext(450, 8),
    onNext(470, 9),
    onNext(560, 10),
    onNext(580, 11),
    onCompleted(600)
  );

  var results = scheduler.startScheduler(function () {
    return xs.filter(function () {
      invoked++;
      return true;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(230, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(380, 6),
    onNext(390, 7),
    onNext(450, 8),
    onNext(470, 9),
    onNext(560, 10),
    onNext(580, 11),
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.equal(9, invoked);

  t.end();
});

test('Observable#filter False', function (t) {
  var scheduler = new TestScheduler();

  var invoked = 0;

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(180, 2),
    onNext(230, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(380, 6),
    onNext(390, 7),
    onNext(450, 8),
    onNext(470, 9),
    onNext(560, 10),
    onNext(580, 11),
    onCompleted(600)
  );

  var results = scheduler.startScheduler(function () {
    return xs.filter(function (x) {
      invoked++;
      return false;
    });
  });

  reactiveAssert(t, results.messages, [
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.equal(9, invoked);

  t.end();
});

test('Observable#filter dispose', function (t) {
  var scheduler = new TestScheduler();

  var invoked = 0;

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(180, 2),
    onNext(230, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(380, 6),
    onNext(390, 7),
    onNext(450, 8),
    onNext(470, 9),
    onNext(560, 10),
    onNext(580, 11),
    onCompleted(600)
  );

  var results = scheduler.startScheduler(function () {
    return xs.filter(function (x) {
      invoked++;
      return isPrime(x);
    });
  }, { disposed: 400 });

  reactiveAssert(t, results.messages, [
    onNext(230, 3),
    onNext(340, 5),
    onNext(390, 7)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  t.equal(5, invoked);

  t.end();
});

test('Observable#filter error', function (t) {
  var scheduler = new TestScheduler();
  var invoked = 0;

  var error = new Error();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(180, 2),
    onNext(230, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(380, 6),
    onNext(390, 7),
    onNext(450, 8),
    onNext(470, 9),
    onNext(560, 10),
    onNext(580, 11),
    onError(600, error),
    onNext(610, 12),
    onError(620, new Error()),
    onCompleted(630)
  );

  var results = scheduler.startScheduler(function () {
    return xs.filter(function (x) {
      invoked++;
      return isPrime(x);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(230, 3),
    onNext(340, 5),
    onNext(390, 7),
    onNext(580, 11),
    onError(600, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.equal(9, invoked);

  t.end();
});

test('Observable#filter Throw', function (t) {
  var scheduler = new TestScheduler();
  var invoked = 0;

  var error = new Error();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(180, 2),
    onNext(230, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(380, 6),
    onNext(390, 7),
    onNext(450, 8),
    onNext(470, 9),
    onNext(560, 10),
    onNext(580, 11),
    onCompleted(600),
    onNext(610, 12),
    onError(620, new Error()),
    onCompleted(630)
  );

  var results = scheduler.startScheduler(function () {
    return xs.filter(function (x) {
      invoked++;
      if (x > 5) {
        throw error;
      }
      return isPrime(x);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(230, 3),
    onNext(340, 5),
    onError(380, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 380)
  ]);

  t.equal(4, invoked);

  t.end();
});

test('Observable#filter dispose in predicate', function (t) {
  var scheduler = new TestScheduler();

  var invoked = 0;

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(180, 2),
    onNext(230, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(380, 6),
    onNext(390, 7),
    onNext(450, 8),
    onNext(470, 9),
    onNext(560, 10),
    onNext(580, 11),
    onCompleted(600),
    onNext(610, 12),
    onError(620, new Error()),
    onCompleted(630)
  );

  var results = scheduler.createObserver();

  var d = new SerialDisposable();

  var ys;
  scheduler.scheduleAbsolute(null, created, function () {
    return ys = xs.filter(function (x) {
      invoked++;
      if (x === 8) {
        d.dispose();
      }
      return isPrime(x);
    });
  });

  scheduler.scheduleAbsolute(null, subscribed, function () {
    d.setDisposable(ys.subscribe(results));
  });

  scheduler.scheduleAbsolute(null, disposed, function () {
    d.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(230, 3),
    onNext(340, 5),
    onNext(390, 7)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 450)
  ]);

  t.equal(6, invoked);

  t.end();
});

test('Observable#filter with index complete', function (t) {
  var scheduler = new TestScheduler();

  var invoked = 0;

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(180, 2),
    onNext(230, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(380, 6),
    onNext(390, 7),
    onNext(450, 8),
    onNext(470, 9),
    onNext(560, 10),
    onNext(580, 11),
    onCompleted(600),
    onNext(610, 12),
    onError(620, new Error()),
    onCompleted(630)
  );

  var results = scheduler.startScheduler(function () {
    return xs.filter(function (x, index) {
      invoked++;
      return isPrime(x + index * 10);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(230, 3),
    onNext(390, 7),
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.equal(9, invoked);

  t.end();
});

test('Observable#filter with index True', function (t) {
  var scheduler = new TestScheduler();

  var invoked = 0;

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(180, 2),
    onNext(230, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(380, 6),
    onNext(390, 7),
    onNext(450, 8),
    onNext(470, 9),
    onNext(560, 10),
    onNext(580, 11),
    onCompleted(600)
  );

  var results = scheduler.startScheduler(function () {
    return xs.filter(function (x, index) {
      invoked++;
      return true;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(230, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(380, 6),
    onNext(390, 7),
    onNext(450, 8),
    onNext(470, 9),
    onNext(560, 10),
    onNext(580, 11),
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.equal(9, invoked);

  t.end();
});

test('Observable#filter with index false', function (t) {
  var scheduler = new TestScheduler();

  var invoked = 0;

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(180, 2),
    onNext(230, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(380, 6),
    onNext(390, 7),
    onNext(450, 8),
    onNext(470, 9),
    onNext(560, 10),
    onNext(580, 11),
    onCompleted(600)
  );

  var results = scheduler.startScheduler(function () {
    return xs.filter(function (x, index) {
      invoked++;
      return false;
    });
  });

  reactiveAssert(t, results.messages, [
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.equal(9, invoked);

  t.end();
});

test('Observable#filter with index dispose', function (t) {
  var scheduler = new TestScheduler();

  var invoked = 0;

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(180, 2),
    onNext(230, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(380, 6),
    onNext(390, 7),
    onNext(450, 8),
    onNext(470, 9),
    onNext(560, 10),
    onNext(580, 11),
    onCompleted(600)
  );

  var results = scheduler.startScheduler(function () {
    return xs.filter(function (x, index) {
      invoked++;
      return isPrime(x + index * 10);
    });
  }, { disposed: 400 });

  reactiveAssert(t, results.messages, [
    onNext(230, 3),
    onNext(390, 7)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  t.equal(5, invoked);

  t.end();
});

test('Observable#filter with index error', function (t) {
  var scheduler = new TestScheduler();

  var invoked = 0;

  var error = new Error();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(180, 2),
    onNext(230, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(380, 6),
    onNext(390, 7),
    onNext(450, 8),
    onNext(470, 9),
    onNext(560, 10),
    onNext(580, 11),
    onError(600, error),
    onNext(610, 12),
    onError(620, new Error()),
    onCompleted(630)
  );

  var results = scheduler.startScheduler(function () {
    return xs.filter(function (x, index) {
      invoked++;
      return isPrime(x + index * 10);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(230, 3),
    onNext(390, 7),
    onError(600, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.equal(9, invoked);

  t.end();
});

test('Observable#filter with index throw', function (t) {
  var scheduler = new TestScheduler();

  var invoked = 0;

  var error = new Error();

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(180, 2),
    onNext(230, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(380, 6),
    onNext(390, 7),
    onNext(450, 8),
    onNext(470, 9),
    onNext(560, 10),
    onNext(580, 11),
    onCompleted(600),
    onNext(610, 12),
    onError(620, new Error()),
    onCompleted(630)
  );

  var results = scheduler.startScheduler(function () {
    return xs.filter(function (x, index) {
      invoked++;
      if (x > 5) {
        throw error;
      }
      return isPrime(x + index * 10);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(230, 3),
    onError(380, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 380)
  ]);

  t.equal(4, invoked);

  t.end();
});

test('Observable#filter with index dispose in predicate', function (t) {
  var scheduler = new TestScheduler();

  var invoked = 0;

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(180, 2),
    onNext(230, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(380, 6),
    onNext(390, 7),
    onNext(450, 8),
    onNext(470, 9),
    onNext(560, 10),
    onNext(580, 11),
    onCompleted(600),
    onNext(610, 12),
    onError(620, new Error()),
    onCompleted(630)
  );

  var results = scheduler.createObserver();

  var d = new SerialDisposable();

  var ys;
  scheduler.scheduleAbsolute(null, created, function () {
    ys = xs.filter(function (x, index) {
      invoked++;
      if (x === 8) {
        d.dispose();
      }
      return isPrime(x + index * 10);
    });
  });

  scheduler.scheduleAbsolute(null, subscribed, function () {
    d.setDisposable(ys.subscribe(results));
  });

  scheduler.scheduleAbsolute(null, disposed, function () {
    d.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(230, 3),
    onNext(390, 7)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 450)
  ]);

  t.equal(6, invoked);

  t.end();
});

test('Observable#filter multiple subscribers', function (t) {
  var s = new TestScheduler();

  var xs = s.createHotObservable(onCompleted(100)).filter(function () { return true; });

  var o1 = s.createObserver();
  var o2 = s.createObserver();

  xs.subscribe(o1);
  xs.subscribe(o2);

  s.start();

  t.equal(o1.messages.length, 1);
  t.equal(o2.messages.length, 1);

  t.end();
});

test('Observable#Filter and Filter Optimization', function (t) {
  var scheduler = new TestScheduler();

  var invoked1 = 0;
  var invoked2 = 0;

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(180, 2),
    onNext(230, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(380, 6),
    onNext(390, 7),
    onNext(450, 8),
    onNext(470, 9),
    onNext(560, 10),
    onNext(580, 11),
    onCompleted(600),
    onNext(610, 12),
    onError(620, new Error()),
    onCompleted(630)
  );

  var results = scheduler.startScheduler(function () {
    return xs
      .filter(function(x) { invoked1++; return x % 2 === 0; })
      .filter(function(x) { invoked2++; return x % 3 === 0; });
  });

  reactiveAssert(t, results.messages, [
    onNext(380, 6),
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.equal(9, invoked1);
  t.equal(4, invoked2);

  t.end();
});

test('Observable#filter and Observable#filter thisArg', function (t) {
  var scheduler = new TestScheduler();

  function Filterer() {
    this.filter1 = function(item) { return item % 2 === 0; };
    this.filter2 = function(item) { return item % 3 === 0; };
  }

  var filterer = new Filterer();

  var xs = scheduler.createColdObservable(
      onNext(10, 1),
      onNext(20, 2),
      onNext(30, 3),
      onNext(40, 4),
      onNext(50, 5),
      onNext(60, 6),
      onNext(70, 7),
      onNext(80, 8),
      onNext(90, 9),
      onCompleted(100)
  );

  var results = scheduler.startScheduler(function() {
    return xs
      .filter(function(x){ return this.filter1(x);}, filterer)
      .filter(function(x){ return this.filter2(x);}, filterer)
      .filter(function(x){ return this.filter1(x);}, filterer);
  });

  reactiveAssert(t, results.messages, [
    onNext(260, 6),
    onCompleted(300)
  ]);

  t.end();
});

test('Observable#filter and map optimization', function (t) {
  var scheduler = new TestScheduler();

  var invoked1 = 0;
  var invoked2 = 0;

  var xs = scheduler.createHotObservable(
    onNext(110, 1),
    onNext(180, 2),
    onNext(230, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(380, 6),
    onNext(390, 7),
    onNext(450, 8),
    onNext(470, 9),
    onNext(560, 10),
    onNext(580, 11),
    onCompleted(600),
    onNext(610, 12),
    onError(620, new Error()),
    onCompleted(630)
  );

  var results = scheduler.startScheduler(function () {
    return xs
    .filter(function(x) { invoked1++; return x % 2 === 0; })
    .map(function(x) { invoked2++; return x * x; });
  });

  reactiveAssert(t, results.messages, [
    onNext(270, 16),
    onNext(380, 36),
    onNext(450, 64),
    onNext(560, 100),
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.equal(9, invoked1);
  t.equal(4, invoked2);

  t.end();
});
