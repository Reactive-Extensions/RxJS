'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var AsyncSubject = require('../asyncsubject');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
    onError = ReactiveTest.onError,
    onCompleted = ReactiveTest.onCompleted;

test('AsyncSubject Infinite', function (t) {
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

  var results1 = scheduler.createObserver();
  var results2 = scheduler.createObserver();
  var results3 = scheduler.createObserver();
  var subject;

  var subscription, subscription1, subscription2, subscription3;

  scheduler.scheduleAbsolute(null, 100, function () {
    subject = new AsyncSubject();
  });

  scheduler.scheduleAbsolute(null, 200, function () {
    subscription = xs.subscribe(subject);
  });

  scheduler.scheduleAbsolute(null, 1000, function () {
    subscription.dispose();
  });

  scheduler.scheduleAbsolute(null, 300, function () {
    subscription1 = subject.subscribe(results1);
  });

  scheduler.scheduleAbsolute(null, 400, function () {
    subscription2 = subject.subscribe(results2);
  });

  scheduler.scheduleAbsolute(null, 900, function () {
    subscription3 = subject.subscribe(results3);
  });

  scheduler.scheduleAbsolute(null, 600, function () {
    subscription1.dispose();
  });

  scheduler.scheduleAbsolute(null, 700, function () {
    subscription2.dispose();
  });

  scheduler.scheduleAbsolute(null, 800, function () {
    subscription1.dispose();
  });

  scheduler.scheduleAbsolute(null, 950, function () {
    subscription3.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results1.messages, []);

  reactiveAssert(t, results2.messages, []);

  reactiveAssert(t, results3.messages, []);

  t.end();
});

test('AsyncSubject Finite', function (t) {
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

  var results1 = scheduler.createObserver();
  var results2 = scheduler.createObserver();
  var results3 = scheduler.createObserver();

  var subject;

  var subscription, subscription1, subscription2, subscription3;

  scheduler.scheduleAbsolute(null, 100, function () {
    subject = new AsyncSubject();
  });

  scheduler.scheduleAbsolute(null, 200, function () {
    subscription = xs.subscribe(subject);
  });

  scheduler.scheduleAbsolute(null, 1000, function () {
    subscription.dispose();
  });

  scheduler.scheduleAbsolute(null, 300, function () {
    subscription1 = subject.subscribe(results1);
  });

  scheduler.scheduleAbsolute(null, 400, function () {
    subscription2 = subject.subscribe(results2);
  });

  scheduler.scheduleAbsolute(null, 900, function () {
    subscription3 = subject.subscribe(results3);
  });

  scheduler.scheduleAbsolute(null, 600, function () {
    subscription1.dispose();
  });

  scheduler.scheduleAbsolute(null, 700, function () {
    subscription2.dispose();
  });

  scheduler.scheduleAbsolute(null, 800, function () {
    subscription1.dispose();
  });

  scheduler.scheduleAbsolute(null, 950, function () {
    subscription3.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results1.messages, []);
  reactiveAssert(t, results2.messages, [onNext(630, 7), onCompleted(630)]);
  reactiveAssert(t, results3.messages, [onNext(900, 7), onCompleted(900)]);
  t.end();
});

test('AsyncSubject Error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

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
    onError(660, new Error())
  );

  var results1 = scheduler.createObserver();
  var results2 = scheduler.createObserver();
  var results3 = scheduler.createObserver();
  var subject;

  var subscription, subscription1, subscription2, subscription3;

  scheduler.scheduleAbsolute(null, 100, function () {
    subject = new AsyncSubject();
  });

  scheduler.scheduleAbsolute(null, 200, function () {
    subscription = xs.subscribe(subject);
  });

  scheduler.scheduleAbsolute(null, 1000, function () {
    subscription.dispose();
  });

  scheduler.scheduleAbsolute(null, 300, function () {
    subscription1 = subject.subscribe(results1);
  });

  scheduler.scheduleAbsolute(null, 400, function () {
    subscription2 = subject.subscribe(results2);
  });

  scheduler.scheduleAbsolute(null, 900, function () {
    subscription3 = subject.subscribe(results3);
  });

  scheduler.scheduleAbsolute(null, 600, function () {
    subscription1.dispose();
  });

  scheduler.scheduleAbsolute(null, 700, function () {
    subscription2.dispose();
  });

  scheduler.scheduleAbsolute(null, 800, function () {
    subscription1.dispose();
  });

  scheduler.scheduleAbsolute(null, 950, function () {
    subscription3.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results1.messages, []);
  reactiveAssert(t, results2.messages, [onError(630, error)]);
  reactiveAssert(t, results3.messages, [onError(900, error)]);
  t.end();
});

test('AsyncSubject cancelled', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onCompleted(630),
    onNext(640, 9),
    onCompleted(650),
    onError(660, new Error()));

  var results1 = scheduler.createObserver();
  var results2 = scheduler.createObserver();
  var results3 = scheduler.createObserver();
  var subject;

  var subscription, subscription1, subscription2, subscription3;

  scheduler.scheduleAbsolute(null, 100, function () {
    subject = new AsyncSubject();
  });

  scheduler.scheduleAbsolute(null, 200, function () {
    subscription = xs.subscribe(subject);
  });

  scheduler.scheduleAbsolute(null, 1000, function () {
    subscription.dispose();
  });

  scheduler.scheduleAbsolute(null, 300, function () {
    subscription1 = subject.subscribe(results1);
  });

  scheduler.scheduleAbsolute(null, 400, function () {
    subscription2 = subject.subscribe(results2);
  });

  scheduler.scheduleAbsolute(null, 900, function () {
    subscription3 = subject.subscribe(results3);
  });

  scheduler.scheduleAbsolute(null, 600, function () {
    subscription1.dispose();
  });

  scheduler.scheduleAbsolute(null, 700, function () {
    subscription2.dispose();
  });

  scheduler.scheduleAbsolute(null, 800, function () {
    subscription1.dispose();
  });

  scheduler.scheduleAbsolute(null, 950, function () {
    subscription3.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results1.messages, []);
  reactiveAssert(t, results2.messages, [onCompleted(630)]);
  reactiveAssert(t, results3.messages, [onCompleted(900)]);
  t.end();
});

test('AsyncSubject disposed', function (t) {
  var scheduler = new TestScheduler();

  var results1 = scheduler.createObserver();
  var results2 = scheduler.createObserver();
  var results3 = scheduler.createObserver();
  var subject;

  var subscription1, subscription2, subscription3;

  scheduler.scheduleAbsolute(null, 100, function () {
    subject = new AsyncSubject();
  });

  scheduler.scheduleAbsolute(null, 200, function () {
    subscription1 = subject.subscribe(results1);
  });

  scheduler.scheduleAbsolute(null, 300, function () {
    subscription2 = subject.subscribe(results2);
  });

  scheduler.scheduleAbsolute(null, 400, function () {
    subscription3 = subject.subscribe(results3);
  });

  scheduler.scheduleAbsolute(null, 500, function () {
    subscription1.dispose();
  });

  scheduler.scheduleAbsolute(null, 600, function () {
    subject.dispose();
  });

  scheduler.scheduleAbsolute(null, 700, function () {
    subscription2.dispose();
  });

  scheduler.scheduleAbsolute(null, 800, function () {
    subscription3.dispose();
  });

  scheduler.scheduleAbsolute(null, 150, function () {
    subject.onNext(1);
  });

  scheduler.scheduleAbsolute(null, 250, function () {
    subject.onNext(2);
  });

  scheduler.scheduleAbsolute(null, 350, function () {
    subject.onNext(3);
  });

  scheduler.scheduleAbsolute(null, 450, function () {
    subject.onNext(4);
  });

  scheduler.scheduleAbsolute(null, 550, function () {
    subject.onNext(5);
  });

  scheduler.scheduleAbsolute(null, 650, function () {
    t.throws(function () { subject.onNext(6); });
  });

  scheduler.scheduleAbsolute(null, 750, function () {
    t.throws(function () { subject.onCompleted(); });
  });

  scheduler.scheduleAbsolute(null, 850, function () {
    t.throws(function () { subject.onError(new Error()); });
  });

  scheduler.scheduleAbsolute(null, 950, function () {
    t.throws(function () { subject.subscribe(); });
  });

  scheduler.start();

  reactiveAssert(t, results1.messages, []);
  reactiveAssert(t, results2.messages, []);
  reactiveAssert(t, results3.messages, []);
  t.end();
});
