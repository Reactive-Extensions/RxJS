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
  disposed = ReactiveTest.disposed;

Observable.addToPrototype({
  map: require('../observable/map')
});

// Function shortcuts
function noop () { }
function identity (x) { return x; }
function throwError () { throw new Error(); }

test('Observable#map throws', function (t) {
  t.throws(function () {
    Observable.just(1)
      .map(identity)
      .subscribe(throwError);
  });

  t.throws(function () {
    Observable.throwError(new Error())
      .map(function (x) { return x; })
      .subscribe(noop, throwError);
  });

  t.throws(function () {
    Observable.empty()
      .map(function (x) { return x; })
      .subscribe(noop, noop, throwError);
  });

  t.throws(function () {
    Observable.create(throwError)
      .map(identity)
      .subscribe();
  });

  t.end();
});

test('Observable#map with index dispose inside selector', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(100, 4),
    onNext(200, 3),
    onNext(500, 2),
    onNext(600, 1)
  );

  var invoked = 0;

  var results = scheduler.createObserver();

  var d = new SerialDisposable();
  d.setDisposable(
    xs.map(function(x, index) {
      invoked++;
      scheduler.clock > 400 && d.dispose();
      return x + index * 10;
    })
    .subscribe(results)
  );

  scheduler.scheduleAbsolute(null, disposed, function () { d.dispose(); });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(100, 4),
    onNext(200, 13)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(0, 500)
  ]);

  t.equal(3, invoked);

  t.end();
});

test('Observable#map with index Completed', function (t) {
  var scheduler = new TestScheduler();

  var invoked = 0;

  var xs = scheduler.createHotObservable(
    onNext(180, 5),
    onNext(210, 4),
    onNext(240, 3),
    onNext(290, 2),
    onNext(350, 1),
    onCompleted(400),
    onNext(410, -1),
    onCompleted(420),
    onError(430, new Error())
  );

  var results = scheduler.startScheduler(function () {
    return xs.map(function (x, index) {
      invoked++;
      return (x + 1) + (index * 10);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 5),
    onNext(240, 14),
    onNext(290, 23),
    onNext(350, 32),
    onCompleted(400)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  t.equal(4, invoked);

  t.end();
});

test('Observable#map with index not completed', function (t) {
  var scheduler = new TestScheduler();

  var invoked = 0;

  var xs = scheduler.createHotObservable(
    onNext(180, 5),
    onNext(210, 4),
    onNext(240, 3),
    onNext(290, 2),
    onNext(350, 1)
  );

  var results = scheduler.startScheduler(function () {
    return xs.map(function (x, index) {
      invoked++;
      return (x + 1) + (index * 10);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 5),
    onNext(240, 14),
    onNext(290, 23),
    onNext(350, 32)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.equal(4, invoked);

  t.end();
});

test('Observable#map with index error', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error();

  var invoked = 0;

  var xs = scheduler.createHotObservable(
    onNext(180, 5),
    onNext(210, 4),
    onNext(240, 3),
    onNext(290, 2),
    onNext(350, 1),
    onError(400, error),
    onNext(410, -1),
    onCompleted(420),
    onError(430, new Error())
  );

  var results = scheduler.startScheduler(function () {
    return xs.map(function (x, index) {
      invoked++;
      return (x + 1) + (index * 10);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 5),
    onNext(240, 14),
    onNext(290, 23),
    onNext(350, 32),
    onError(400, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  t.equal(4, invoked);

  t.end();
});

test('Observable#map selector throws', function (t) {
  var scheduler = new TestScheduler();

  var invoked = 0;

  var error = new Error();

  var xs = scheduler.createHotObservable(
    onNext(180, 5),
    onNext(210, 4),
    onNext(240, 3),
    onNext(290, 2),
    onNext(350, 1),
    onCompleted(400),
    onNext(410, -1),
    onCompleted(420),
    onError(430, new Error())
  );

  var results = scheduler.startScheduler(function () {
    return xs.map(function (x, index) {
      invoked++;
      if (invoked === 3) { throw error; }
      return (x + 1) + (index * 10);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 5),
    onNext(240, 14),
    onError(290, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 290)
  ]);

  t.equal(3, invoked);

  t.end();
});

test('Observable#map value', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.map(-1);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, -1),
    onNext(220, -1),
    onNext(230, -1),
    onNext(240, -1),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable#map thisArg', function (t) {
  var scheduler = new TestScheduler();

  var invoked = 0;
  var foo = 42;

  var xs = scheduler.createHotObservable(
    onNext(180, 5),
    onNext(210, 4),
    onNext(240, 3),
    onNext(290, 2),
    onNext(350, 1),
    onCompleted(400),
    onNext(410, -1),
    onCompleted(420),
    onError(430, new Error())
  );

  var results = scheduler.startScheduler(function () {
    return xs.map(function (x, index) {
      invoked++;
      t.equal(this, foo);
      return (x + 1) + (index * 10);
    }, 42);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 5),
    onNext(240, 14),
    onNext(290, 23),
    onNext(350, 32),
    onCompleted(400)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  t.equal(4, invoked);

  t.end();
});

test('Observable#map and map Optimization', function (t) {
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
    .map(function(x) { invoked1++; return x * 2; })
    .map(function(x) { invoked2++; return x / 2; });
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

  t.equal(9, invoked1);
  t.equal(9, invoked2);

  t.end();
});

test('Observable#map and map thisArg', function(t) {
  var scheduler = new TestScheduler();

  function Filterer() {
    this.selector1 = function(item) { return item + 2; };
    this.selector2 = function(item) { return item * 3; };
  }

  var filterer = new Filterer();

  var xs = scheduler.createColdObservable(
    onNext(10, 1),
    onNext(20, 2),
    onNext(30, 3),
    onNext(40, 4),
    onCompleted(100)
  );

  var results = scheduler.startScheduler(function() {
    return xs
      .map(function(x){ return this.selector1(x);}, filterer)
      .map(function(x){ return this.selector2(x);}, filterer)
      .map(function(x){ return this.selector1(x);}, filterer);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 11),
    onNext(220, 14),
    onNext(230, 17),
    onNext(240, 20),
    onCompleted(300)
  ]);

  t.end();
});
