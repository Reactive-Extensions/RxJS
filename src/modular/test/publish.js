'use strict';

var test = require('tape');
var Observable = require('../observable');
var ConnectableObservable = require('../observable/connectableobservable');
var Disposable = require('../disposable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var inherits = require('util').inherits;
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe,
  created = ReactiveTest.created,
  subscribed = ReactiveTest.subscribed,
  disposed = ReactiveTest.disposed;

Observable.addToObject({
  defer: require('../observable/defer'),
  never: require('../observable/never')
});

Observable.addToPrototype({
  publish: require('../observable/publish'),
  zip: require('../observable/zip')
});

function add(x, y) { return x + y; }

test('Observable#publish Cold Zip', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(40, 0),
    onNext(90, 1),
    onNext(150, 2),
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5),
    onNext(330, 6),
    onNext(340, 7),
    onCompleted(390)
  );

  var results = scheduler.startScheduler(function () {
    return xs.publish(function (ys) { return ys.zip(ys, add); });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 6),
    onNext(240, 8),
    onNext(270, 10),
    onNext(330, 12),
    onNext(340, 14),
    onCompleted(390)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 390)
  ]);

  t.end();
});

function MySubject() {
  this._disposeOnMap = {};
  this.subscribeCount = 0;
  this.disposed = false;
  Observable.call(this);
}

inherits(MySubject, Observable);

MySubject.prototype._subscribe = function (o) {
  this.subscribeCount++;
  this._o = o;

  var self = this;
  return Disposable.create(function () { self.disposed = true; });
};

MySubject.prototype.disposeOn = function (value, disposable) {
  this._disposeOnMap[value] = disposable;
};

MySubject.prototype.onNext = function (value) {
  this._o.onNext(value);
  this._disposeOnMap[value] && this._disposeOnMap[value].dispose();
};

MySubject.prototype.onError = function (exception) {
  this._o.onError(exception);
};

MySubject.prototype.onCompleted = function () {
  this._o.onCompleted();
};

test('ConnectableObservable#refCount connects on first', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onNext(240, 4),
    onCompleted(250)
  );

  var subject = new MySubject();

  var conn = new ConnectableObservable(xs, subject);

  var results = scheduler.startScheduler(function () {
    return conn.refCount();
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onNext(240, 4),
    onCompleted(250)
  ]);

  t.ok(subject.disposed);

  t.end();
});

test('ConnectableObservable#refCount not connected', function (t) {
  var disconnected = false;

  var count = 0;

  var xs = Observable.defer(function () {
    count++;
    return Observable.create(function () {
      return function () { disconnected = true; };
    });
  });

  var subject = new MySubject();
  var conn = new ConnectableObservable(xs, subject);

  var refd = conn.refCount();
  var dis1 = refd.subscribe();

  t.equal(1, count);
  t.equal(1, subject.subscribeCount);
  t.ok(!disconnected);

  var dis2 = refd.subscribe();
  t.equal(1, count);
  t.equal(2, subject.subscribeCount);
  t.ok(!disconnected);

  dis1.dispose();
  t.ok(!disconnected);

  dis2.dispose();
  t.ok(disconnected);

  disconnected = false;

  var dis3 = refd.subscribe();
  t.equal(2, count);
  t.equal(3, subject.subscribeCount);
  t.ok(!disconnected);

  dis3.dispose();
  t.ok(disconnected);

  t.end();
});

test('Observable#publish basic', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 7),
    onNext(220, 3),
    onNext(280, 4),
    onNext(290, 1),
    onNext(340, 8),
    onNext(360, 5),
    onNext(370, 6),
    onNext(390, 7),
    onNext(410, 13),
    onNext(430, 2),
    onNext(450, 9),
    onNext(520, 11),
    onNext(560, 20),
    onCompleted(600)
  );

  var ys;
  var subscription;
  var connection;

  var results = scheduler.createObserver();

  scheduler.scheduleAbsolute(null, created, function () {
    ys = xs.publish();
  });

  scheduler.scheduleAbsolute(null, subscribed, function () {
    subscription = ys.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, disposed, function () {
    subscription.dispose();
  });

  scheduler.scheduleAbsolute(null, 300, function () {
    connection = ys.connect();
  });

  scheduler.scheduleAbsolute(null, 400, function () {
    connection.dispose();
  });

  scheduler.scheduleAbsolute(null, 500, function () {
    connection = ys.connect();
  });

  scheduler.scheduleAbsolute(null, 550, function () {
    connection.dispose();
  });

  scheduler.scheduleAbsolute(null, 650, function () {
    connection = ys.connect();
  });

  scheduler.scheduleAbsolute(null, 800, function () {
    connection.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(340, 8),
    onNext(360, 5),
    onNext(370, 6),
    onNext(390, 7),
    onNext(520, 11)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(300, 400),
    subscribe(500, 550),
    subscribe(650, 800)
  ]);

  t.end();
});

test('Observable#publish Error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 7),
    onNext(220, 3),
    onNext(280, 4),
    onNext(290, 1),
    onNext(340, 8),
    onNext(360, 5),
    onNext(370, 6),
    onNext(390, 7),
    onNext(410, 13),
    onNext(430, 2),
    onNext(450, 9),
    onNext(520, 11),
    onNext(560, 20),
    onError(600, error)
  );

  var results = scheduler.createObserver();

  var ys;
  var subscription;
  var connection;

  scheduler.scheduleAbsolute(null, created, function () {
    ys = xs.publish();
  });

  scheduler.scheduleAbsolute(null, subscribed, function () {
    subscription = ys.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, disposed, function () {
    subscription.dispose();
  });

  scheduler.scheduleAbsolute(null, 300, function () {
    connection = ys.connect();
  });

  scheduler.scheduleAbsolute(null, 400, function () {
    connection.dispose();
  });

  scheduler.scheduleAbsolute(null, 500, function () {
    connection = ys.connect();
  });

  scheduler.scheduleAbsolute(null, 800, function () {
    connection.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(340, 8),
    onNext(360, 5),
    onNext(370, 6),
    onNext(390, 7),
    onNext(520, 11),
    onNext(560, 20),
    onError(600, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(300, 400),
    subscribe(500, 600)
  ]);

  t.end();
});

test('Observable#publish complete', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 7),
    onNext(220, 3),
    onNext(280, 4),
    onNext(290, 1),
    onNext(340, 8),
    onNext(360, 5),
    onNext(370, 6),
    onNext(390, 7),
    onNext(410, 13),
    onNext(430, 2),
    onNext(450, 9),
    onNext(520, 11),
    onNext(560, 20),
    onCompleted(600)
  );

  var results = scheduler.createObserver();

  var ys;
  var subscription;
  var connection;

  scheduler.scheduleAbsolute(null, created, function () {
    ys = xs.publish();
  });

  scheduler.scheduleAbsolute(null, subscribed, function () {
    subscription = ys.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, disposed, function () {
    subscription.dispose();
  });

  scheduler.scheduleAbsolute(null, 300, function () {
    connection = ys.connect();
  });

  scheduler.scheduleAbsolute(null, 400, function () {
    connection.dispose();
  });

  scheduler.scheduleAbsolute(null, 500, function () {
    connection = ys.connect();
  });

  scheduler.scheduleAbsolute(null, 800, function () {
    connection.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(340, 8),
    onNext(360, 5),
    onNext(370, 6),
    onNext(390, 7),
    onNext(520, 11),
    onNext(560, 20),
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(300, 400),
    subscribe(500, 600)
  ]);

  t.end();
});

test('Observable#publish dispose', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 7),
    onNext(220, 3),
    onNext(280, 4),
    onNext(290, 1),
    onNext(340, 8),
    onNext(360, 5),
    onNext(370, 6),
    onNext(390, 7),
    onNext(410, 13),
    onNext(430, 2),
    onNext(450, 9),
    onNext(520, 11),
    onNext(560, 20),
    onCompleted(600)
  );

  var results = scheduler.createObserver();

  var ys;
  var subscription;
  var connection;

  scheduler.scheduleAbsolute(null, created, function () {
    ys = xs.publish();
  });

  scheduler.scheduleAbsolute(null, subscribed, function () {
    subscription = ys.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, 350, function () {
    subscription.dispose();
  });

  scheduler.scheduleAbsolute(null, 300, function () {
    connection = ys.connect();
  });

  scheduler.scheduleAbsolute(null, 400, function () {
    connection.dispose();
  });

  scheduler.scheduleAbsolute(null, 500, function () {
    connection = ys.connect();
  });

  scheduler.scheduleAbsolute(null, 550, function () {
    connection.dispose();
  });

  scheduler.scheduleAbsolute(null, 650, function () {
    connection = ys.connect();
  });

  scheduler.scheduleAbsolute(null, 800, function () {
    connection.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(340, 8)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(300, 400),
    subscribe(500, 550),
    subscribe(650, 800)
  ]);

  t.end();
});

test('Observable#publish multiple connections', function (t) {
  var xs = Observable.never();

  var ys = xs.publish();

  var connection1 = ys.connect();
  var connection2 = ys.connect();

  t.ok(connection1 === connection2);

  connection1.dispose();
  connection2.dispose();

  var connection3 = ys.connect();

  t.ok(connection1 !== connection3);

  connection3.dispose();

  t.end();
});

test('Observable#publish function zip complete', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 7),
    onNext(220, 3),
    onNext(280, 4),
    onNext(290, 1),
    onNext(340, 8),
    onNext(360, 5),
    onNext(370, 6),
    onNext(390, 7),
    onNext(410, 13),
    onNext(430, 2),
    onNext(450, 9),
    onNext(520, 11),
    onNext(560, 20),
    onCompleted(600)
  );

  var results = scheduler.startScheduler(function () {
    return xs.publish(function (_xs) {
      return _xs.zip(_xs.skip(1), add);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(280, 7),
    onNext(290, 5),
    onNext(340, 9),
    onNext(360, 13),
    onNext(370, 11),
    onNext(390, 13),
    onNext(410, 20),
    onNext(430, 15),
    onNext(450, 11),
    onNext(520, 20),
    onNext(560, 31),
    onCompleted(600)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});

test('Observable#publish function zip error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 7),
    onNext(220, 3),
    onNext(280, 4),
    onNext(290, 1),
    onNext(340, 8),
    onNext(360, 5),
    onNext(370, 6),
    onNext(390, 7),
    onNext(410, 13),
    onNext(430, 2),
    onNext(450, 9),
    onNext(520, 11),
    onNext(560, 20),
    onError(600, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.publish(function (_xs) {
      return _xs.zip(_xs.skip(1), add);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(280, 7),
    onNext(290, 5),
    onNext(340, 9),
    onNext(360, 13),
    onNext(370, 11),
    onNext(390, 13),
    onNext(410, 20),
    onNext(430, 15),
    onNext(450, 11),
    onNext(520, 20),
    onNext(560, 31),
    onError(600, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});

test('Observable#publish function zip dispose', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(110, 7),
    onNext(220, 3),
    onNext(280, 4),
    onNext(290, 1),
    onNext(340, 8),
    onNext(360, 5),
    onNext(370, 6),
    onNext(390, 7),
    onNext(410, 13),
    onNext(430, 2),
    onNext(450, 9),
    onNext(520, 11),
    onNext(560, 20),
    onCompleted(600)
  );

  var results = scheduler.startScheduler(function () {
    return xs.publish(function (_xs) { return _xs.zip(_xs.skip(1), add); });
  }, { disposed: 470 });

  reactiveAssert(t, results.messages, [
    onNext(280, 7),
    onNext(290, 5),
    onNext(340, 9),
    onNext(360, 13),
    onNext(370, 11),
    onNext(390, 13),
    onNext(410, 20),
    onNext(430, 15),
    onNext(450, 11)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 470)
  ]);

  t.end();
});
