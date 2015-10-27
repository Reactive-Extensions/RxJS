'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var ReplaySubject = require('../replaysubject');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
    onError = ReactiveTest.onError,
    onCompleted = ReactiveTest.onCompleted;

test('ReplaySubject Infinite', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(70, 1),
    onNext(110, 2),
    onNext(220, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(410, 6),
    onNext(520, 7),
    onNext(630, 8),
    onNext(710, 9),
    onNext(870, 10),
    onNext(940, 11),
    onNext(1020, 12)
  );

  var subject, subscription, subscription1, subscription2, subscription3;

  var results1 = scheduler.createObserver();
  var results2 = scheduler.createObserver();
  var results3 = scheduler.createObserver();

  scheduler.scheduleAbsolute(null, 100, function () { subject = new ReplaySubject(3, 100, scheduler); });
  scheduler.scheduleAbsolute(null, 200, function () { subscription = xs.subscribe(subject); });
  scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

  scheduler.scheduleAbsolute(null, 300, function () { subscription1 = subject.subscribe(results1); });
  scheduler.scheduleAbsolute(null, 400, function () { subscription2 = subject.subscribe(results2); });
  scheduler.scheduleAbsolute(null, 900, function () { subscription3 = subject.subscribe(results3); });

  scheduler.scheduleAbsolute(null, 600, function () { subscription1.dispose(); });
  scheduler.scheduleAbsolute(null, 700, function () { subscription2.dispose(); });
  scheduler.scheduleAbsolute(null, 800, function () { subscription1.dispose(); });
  scheduler.scheduleAbsolute(null, 950, function () { subscription3.dispose(); });

  scheduler.start();

  reactiveAssert(t, results1.messages, [
    onNext(301, 3),
    onNext(302, 4),
    onNext(341, 5),
    onNext(411, 6),
    onNext(521, 7)
  ]);

  reactiveAssert(t, results2.messages, [
    onNext(401, 5),
    onNext(411, 6),
    onNext(521, 7),
    onNext(631, 8)
  ]);

  reactiveAssert(t, results3.messages, [
    onNext(901, 10),
    onNext(941, 11)
  ]);

  t.end();
});

test('ReplaySubject Infinite 2', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(70, 1),
    onNext(110, 2),
    onNext(220, 3),
    onNext(270, 4),
    onNext(280, -1),
    onNext(290, -2),
    onNext(340, 5),
    onNext(410, 6),
    onNext(520, 7),
    onNext(630, 8),
    onNext(710, 9),
    onNext(870, 10),
    onNext(940, 11),
    onNext(1020, 12)
  );

  var subject, subscription, subscription1, subscription2, subscription3;

  var results1 = scheduler.createObserver();
  var results2 = scheduler.createObserver();
  var results3 = scheduler.createObserver();

  scheduler.scheduleAbsolute(null, 100, function () { subject = new ReplaySubject(3, 100, scheduler); });
  scheduler.scheduleAbsolute(null, 200, function () { subscription = xs.subscribe(subject); });
  scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

  scheduler.scheduleAbsolute(null, 300, function () { subscription1 = subject.subscribe(results1); });
  scheduler.scheduleAbsolute(null, 400, function () { subscription2 = subject.subscribe(results2); });
  scheduler.scheduleAbsolute(null, 900, function () { subscription3 = subject.subscribe(results3); });

  scheduler.scheduleAbsolute(null, 600, function () { subscription1.dispose(); });
  scheduler.scheduleAbsolute(null, 700, function () { subscription2.dispose(); });
  scheduler.scheduleAbsolute(null, 800, function () { subscription1.dispose(); });
  scheduler.scheduleAbsolute(null, 950, function () { subscription3.dispose(); });

  scheduler.start();

  reactiveAssert(t, results1.messages, [
    onNext(301, 4),
    onNext(302, -1),
    onNext(303, -2),
    onNext(341, 5),
    onNext(411, 6),
    onNext(521, 7)
  ]);

  reactiveAssert(t, results2.messages, [
    onNext(401, 5),
    onNext(411, 6),
    onNext(521, 7),
    onNext(631, 8)
  ]);

  reactiveAssert(t, results3.messages, [
    onNext(901, 10),
    onNext(941, 11)
  ]);

  t.end();
});

test('ReplaySubject Finite', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(70, 1),
    onNext(110, 2),
    onNext(220, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(410, 6),
    onNext(520, 7),
    onCompleted(630),
    onNext(640, 9),
    onCompleted(650),
    onError(660, new Error())
  );

  var subject, subscription, subscription1, subscription2, subscription3;

  var results1 = scheduler.createObserver();
  var results2 = scheduler.createObserver();
  var results3 = scheduler.createObserver();

  scheduler.scheduleAbsolute(null, 100, function () { subject = new ReplaySubject(3, 100, scheduler); });
  scheduler.scheduleAbsolute(null, 200, function () { subscription = xs.subscribe(subject); });
  scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

  scheduler.scheduleAbsolute(null, 300, function () { subscription1 = subject.subscribe(results1); });
  scheduler.scheduleAbsolute(null, 400, function () { subscription2 = subject.subscribe(results2); });
  scheduler.scheduleAbsolute(null, 900, function () { subscription3 = subject.subscribe(results3); });

  scheduler.scheduleAbsolute(null, 600, function () { subscription1.dispose(); });
  scheduler.scheduleAbsolute(null, 700, function () { subscription2.dispose(); });
  scheduler.scheduleAbsolute(null, 800, function () { subscription1.dispose(); });
  scheduler.scheduleAbsolute(null, 950, function () { subscription3.dispose(); });

  scheduler.start();

  reactiveAssert(t, results1.messages, [
    onNext(301, 3),
    onNext(302, 4),
    onNext(341, 5),
    onNext(411, 6),
    onNext(521, 7)
  ]);

  reactiveAssert(t, results2.messages, [
    onNext(401, 5),
    onNext(411, 6),
    onNext(521, 7),
    onCompleted(631)
  ]);

  reactiveAssert(t, results3.messages, [
    onCompleted(901)
  ]);

  t.end();
});

test('ReplaySubject Error', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error();

  var xs = scheduler.createHotObservable(
      onNext(70, 1),
      onNext(110, 2),
      onNext(220, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(410, 6),
      onNext(520, 7),
      onError(630, error),
      onNext(640, 9),
      onCompleted(650),
      onError(660, new Error(new Error()))
  );

  var subject, subscription, subscription1, subscription2, subscription3;

  var results1 = scheduler.createObserver();
  var results2 = scheduler.createObserver();
  var results3 = scheduler.createObserver();

  scheduler.scheduleAbsolute(null, 100, function () { subject = new ReplaySubject(3, 100, scheduler); });
  scheduler.scheduleAbsolute(null, 200, function () { subscription = xs.subscribe(subject); });
  scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

  scheduler.scheduleAbsolute(null, 300, function () { subscription1 = subject.subscribe(results1); });
  scheduler.scheduleAbsolute(null, 400, function () { subscription2 = subject.subscribe(results2); });
  scheduler.scheduleAbsolute(null, 900, function () { subscription3 = subject.subscribe(results3); });

  scheduler.scheduleAbsolute(null, 600, function () { subscription1.dispose(); });
  scheduler.scheduleAbsolute(null, 700, function () { subscription2.dispose(); });
  scheduler.scheduleAbsolute(null, 800, function () { subscription1.dispose(); });
  scheduler.scheduleAbsolute(null, 950, function () { subscription3.dispose(); });

  scheduler.start();

  reactiveAssert(t, results1.messages, [
    onNext(301, 3),
    onNext(302, 4),
    onNext(341, 5),
    onNext(411, 6),
    onNext(521, 7)
  ]);

  reactiveAssert(t, results2.messages, [
    onNext(401, 5),
    onNext(411, 6),
    onNext(521, 7),
    onError(631, error)
  ]);

  reactiveAssert(t, results3.messages, [
    onError(901, error)
  ]);

  t.end();
});

test('ReplaySubject Canceled', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onCompleted(630),
    onNext(640, 9),
    onCompleted(650),
    onError(660, new Error())
  );

  var subject, subscription, subscription1, subscription2, subscription3;

  var results1 = scheduler.createObserver();
  var results2 = scheduler.createObserver();
  var results3 = scheduler.createObserver();

  scheduler.scheduleAbsolute(null, 100, function () { subject = new ReplaySubject(3, 100, scheduler); });
  scheduler.scheduleAbsolute(null, 200, function () { subscription = xs.subscribe(subject); });
  scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

  scheduler.scheduleAbsolute(null, 300, function () { subscription1 = subject.subscribe(results1); });
  scheduler.scheduleAbsolute(null, 400, function () { subscription2 = subject.subscribe(results2); });
  scheduler.scheduleAbsolute(null, 900, function () { subscription3 = subject.subscribe(results3); });

  scheduler.scheduleAbsolute(null, 600, function () { subscription1.dispose(); });
  scheduler.scheduleAbsolute(null, 700, function () { subscription2.dispose(); });
  scheduler.scheduleAbsolute(null, 800, function () { subscription1.dispose(); });
  scheduler.scheduleAbsolute(null, 950, function () { subscription3.dispose(); });

  scheduler.start();

  reactiveAssert(t, results1.messages, [
  ]);

  reactiveAssert(t, results2.messages, [
    onCompleted(631)
  ]);

  reactiveAssert(t, results3.messages, [
    onCompleted(901)
  ]);

  t.end();
});

test('ReplaySubject Disposed', function (t) {
  var scheduler = new TestScheduler();

  var subject, subscription1, subscription2, subscription3;

  var results1 = scheduler.createObserver();
  var results2 = scheduler.createObserver();
  var results3 = scheduler.createObserver();

  scheduler.scheduleAbsolute(null, 100, function () { subject = new ReplaySubject(undefined, undefined, scheduler); });
  scheduler.scheduleAbsolute(null, 200, function () { subscription1 = subject.subscribe(results1); });
  scheduler.scheduleAbsolute(null, 300, function () { subscription2 = subject.subscribe(results2); });
  scheduler.scheduleAbsolute(null, 400, function () { subscription3 = subject.subscribe(results3); });
  scheduler.scheduleAbsolute(null, 500, function () { subscription1.dispose(); });
  scheduler.scheduleAbsolute(null, 600, function () { subject.dispose(); });
  scheduler.scheduleAbsolute(null, 700, function () { subscription2.dispose(); });
  scheduler.scheduleAbsolute(null, 800, function () { subscription3.dispose(); });

  scheduler.scheduleAbsolute(null, 150, function () { subject.onNext(1); });
  scheduler.scheduleAbsolute(null, 250, function () { subject.onNext(2); });
  scheduler.scheduleAbsolute(null, 350, function () { subject.onNext(3); });
  scheduler.scheduleAbsolute(null, 450, function () { subject.onNext(4); });
  scheduler.scheduleAbsolute(null, 550, function () { subject.onNext(5); });
  scheduler.scheduleAbsolute(null, 650, function () { t.throws(function () { subject.onNext(6); }); });
  scheduler.scheduleAbsolute(null, 750, function () { t.throws(function () { subject.onCompleted(); }); });
  scheduler.scheduleAbsolute(null, 850, function () { t.throws(function () { subject.onError(new Error()); }); });
  scheduler.scheduleAbsolute(null, 950, function () { t.throws(function () { subject.subscribe(); }); });

  scheduler.start();

  reactiveAssert(t, results1.messages, [
    onNext(201, 1),
    onNext(251, 2),
    onNext(351, 3),
    onNext(451, 4)
  ]);

  reactiveAssert(t, results2.messages, [
    onNext(301, 1),
    onNext(302, 2),
    onNext(351, 3),
    onNext(451, 4),
    onNext(551, 5)
  ]);

  reactiveAssert(t, results3.messages, [
    onNext(401, 1),
    onNext(402, 2),
    onNext(403, 3),
    onNext(451, 4),
    onNext(551, 5)
  ]);

  t.end();
});

test('ReplaySubject Dies out', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(70, 1),
    onNext(110, 2),
    onNext(220, 3),
    onNext(270, 4),
    onNext(340, 5),
    onNext(410, 6),
    onNext(520, 7),
    onCompleted(580)
  );

  var subject;

  var results1 = scheduler.createObserver();
  var results2 = scheduler.createObserver();
  var results3 = scheduler.createObserver();
  var results4 = scheduler.createObserver();

  scheduler.scheduleAbsolute(null, 100, function () { subject = new ReplaySubject(Number.MAX_VALUE, 100, scheduler); });
  scheduler.scheduleAbsolute(null, 200, function () { xs.subscribe(subject); });

  scheduler.scheduleAbsolute(null, 300, function () { subject.subscribe(results1); });
  scheduler.scheduleAbsolute(null, 400, function () { subject.subscribe(results2); });
  scheduler.scheduleAbsolute(null, 600, function () { subject.subscribe(results3); });
  scheduler.scheduleAbsolute(null, 900, function () { subject.subscribe(results4); });

  scheduler.start();

  reactiveAssert(t, results1.messages, [
    onNext(301, 3),
    onNext(302, 4),
    onNext(341, 5),
    onNext(411, 6),
    onNext(521, 7),
    onCompleted(581)
  ]);

  reactiveAssert(t, results2.messages, [
    onNext(401, 5),
    onNext(411, 6),
    onNext(521, 7),
    onCompleted(581)
  ]);

  reactiveAssert(t, results3.messages, [
    onNext(601, 7),
    onCompleted(602)
  ]);

  reactiveAssert(t, results4.messages, [
    onCompleted(901)
  ]);

  t.end();
});
