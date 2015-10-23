'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var Observable = require('../observable');
var SerialDisposable = require('../serialdisposable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
    onCompleted = ReactiveTest.onCompleted;

Observable.addToObject({
  just: require('../observable/just')
});

test('just basic', function (t) {
  var scheduler = new TestScheduler();

  var res = scheduler.startScheduler(function () {
    return Observable.just(42, scheduler);
  });

  reactiveAssert(t, res.messages, [
    onNext(201, 42),
    onCompleted(201)
  ]);
   t.end();
});

test('just disposed', function (t) {
  var scheduler = new TestScheduler();

  var res = scheduler.startScheduler(function () {
    return Observable.just(42, scheduler);
  }, { disposed: 200 });

  reactiveAssert(t, res.messages, []);
  t.end();
});

test('just disposed after next', function (t) {
  var scheduler = new TestScheduler();

  var d = new SerialDisposable();

  var xs = Observable.just(42, scheduler);

  var res = scheduler.createObserver();

  scheduler.scheduleAbsolute(null, 100, function () {
    d.setDisposable(xs.subscribe(
      function (x) {
        d.dispose();
        res.onNext(x);
      },
      function (e) { res.onError(e); },
      function () { res.onCompleted(); }
    ));
  });

  scheduler.start();

  reactiveAssert(t, res.messages, [
    onNext(101, 42)
  ]);
  t.end();
});

function noop () { }

test('just Observer throws', function (t) {
  var scheduler1 = new TestScheduler();

  var xs = Observable.just(1, scheduler1);

  xs.subscribe(function () { throw new Error(); });

  t.throws(function () { scheduler1.start(); });

  var scheduler2 = new TestScheduler();

  var ys = Observable.just(1, scheduler2);

  ys.subscribe(noop, noop, function () { throw new Error(); });

  t.throws(function () { scheduler2.start(); });
  t.end();
});
