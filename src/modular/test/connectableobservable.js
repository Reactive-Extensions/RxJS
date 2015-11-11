'use strict';

var test = require('tape');
var Observable = require('../observable');
var ConnectableObservable = require('../observable/connectableobservable');
var Subject = require('../subject');
var Disposable = require('../disposable');
var inherits = require('util').inherits;
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe;

function MySubject() {
  this.disposeOnMap = {};
  this.subscribeCount = 0;
  this.disposed = false;
  Observable.call(this);
}

inherits(MySubject, Observable);

MySubject.prototype._subscribe = function (o) {
  this.subscribeCount++;
  this.o = o;

  var self = this;
  return Disposable.create(function () { self.disposed = true; });
};

MySubject.prototype.disposeOn = function (value, disposable) {
  this.disposeOnMap[value] = disposable;
};

MySubject.prototype.onNext = function (value) {
  this.o.onNext(value);
  this.disposeOnMap[value] && this.disposeOnMap[value].dispose();
};

MySubject.prototype.onError = function (e) { this.o.onError(e); };
MySubject.prototype.onCompleted = function () { this.o.onCompleted(); };


test('ConnectableObservable creation', function (t) {
  var y = 0;

  var s2 = new Subject();
  var co2 = new ConnectableObservable(Observable.just(1), s2);

  co2.subscribe(function (x) { y = x; });
  t.notEqual(1, y);

  co2.connect();
  t.equal(1, y);

  t.end();
});

test('ConnectableObservable connected', function (t) {
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
  conn.connect();

  var results = scheduler.startScheduler(function () { return conn; });

  reactiveAssert(t, results.messages, [
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onNext(240, 4),
    onCompleted(250)
  ]);

  t.end();
});

test('ConnectableObservable not connected', function (t) {
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

  var results = scheduler.startScheduler(function () { return conn; });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('ConnectableObservable disconnected', function (t) {
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
  var disconnect = conn.connect();
  disconnect.dispose();

  var results = scheduler.startScheduler(function () { return conn; });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('ConnectableObservable disconnect future', function (t) {
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
  subject.disposeOn(3, conn.connect());

  var results = scheduler.startScheduler(function () { return conn; });

  reactiveAssert(t, results.messages, [
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3)
  ]);

  t.end();
});

test('ConnectableObservable multiple non-overlapped connections', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onNext(240, 4),
    onNext(250, 5),
    onNext(260, 6),
    onNext(270, 7),
    onNext(280, 8),
    onNext(290, 9),
    onCompleted(300)
  );

  var subject = new Subject();

  var conn = new ConnectableObservable(xs, subject);

  var c1;
  scheduler.scheduleAbsolute(null, 225, function () { c1 = conn.connect(); });
  scheduler.scheduleAbsolute(null, 241, function () { c1.dispose(); });
  scheduler.scheduleAbsolute(null, 245, function () { c1.dispose(); }); // idempotency test
  scheduler.scheduleAbsolute(null, 251, function () { c1.dispose(); }); // idempotency test
  scheduler.scheduleAbsolute(null, 260, function () { c1.dispose(); }); // idempotency test

  var c2;
  scheduler.scheduleAbsolute(null, 249, function () { c2 = conn.connect(); });
  scheduler.scheduleAbsolute(null, 255, function () { c2.dispose(); });
  scheduler.scheduleAbsolute(null, 265, function () { c2.dispose(); }); // idempotency test
  scheduler.scheduleAbsolute(null, 280, function () { c2.dispose(); }); // idempotency test

  var c3;
  scheduler.scheduleAbsolute(null, 275, function () { c3 = conn.connect(); });
  scheduler.scheduleAbsolute(null, 295, function () { c3.dispose(); });

  var results = scheduler.startScheduler(function () { return conn; });

  reactiveAssert(t, results.messages, [
    onNext(230, 3),
    onNext(240, 4),
    onNext(250, 5),
    onNext(280, 8),
    onNext(290, 9)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(225, 241),
    subscribe(249, 255),
    subscribe(275, 295)
  ]);

  t.end();
});
