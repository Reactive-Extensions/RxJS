'use strict';

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted;

Observable.addToObject({
  amb: require('../observable/amb'),
  never: require('../observable/never')
});

Observable.addToPrototype({
  amb: require('../observable/amb'),
  tap: require('../observable/tap')
});

test('Observable.amb never 2', function (t) {
  var scheduler = new TestScheduler();

  var l = Observable.never();
  var r = Observable.never();

  var results = scheduler.startScheduler(function () {
    return l.amb(r);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable.amb never 3', function (t) {
  var scheduler = new TestScheduler();

  var n1 = Observable.never();
  var n2 = Observable.never();
  var n3 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return Observable.amb(n1, n2, n3);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable.amb never empty', function (t) {
  var scheduler = new TestScheduler();

  var n = Observable.never();
  var e = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(225)
  );

  var results = scheduler.startScheduler(function () {
    return n.amb(e);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(225)
  ]);

  t.end();
});

test('Observable.amb empty never', function (t) {
  var scheduler = new TestScheduler();

  var n = Observable.never();
  var e = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(225));

  var results = scheduler.startScheduler(function () {
    return e.amb(n);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(225)
  ]);

  t.end();
});

test('Observable.amb regular should dispose loser', function (t) {
  var scheduler = new TestScheduler();

  var sourceNotDisposed = false;

  var o1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(240));
  var o2 = scheduler.createHotObservable(onNext(150, 1), onNext(220, 3), onCompleted(250)).tap(function () {
    return sourceNotDisposed = true;
  });

  var results = scheduler.startScheduler(function () {
    return o1.amb(o2);
  });

  reactiveAssert(t, results.messages, [onNext(210, 2), onCompleted(240)]);
  t.ok(!sourceNotDisposed);

  t.end();
});

test('Observable.amb WinnerThrows', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var sourceNotDisposed = false;

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(220, error)
  );

  var o2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 3),
    onCompleted(250)).tap(function () { return sourceNotDisposed = true; });

  var results = scheduler.startScheduler(function () {
    return o1.amb(o2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onError(220, error)
  ]);

  t.ok(!sourceNotDisposed);

  t.end();
});

test('Observable.amb loser throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var sourceNotDisposed = false;

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 2),
    onError(230, error)).tap(function () { return sourceNotDisposed = true; });

  var o2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 3),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return o1.amb(o2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 3), onCompleted(250)
  ]);

  t.ok(!sourceNotDisposed);

  t.end();
});

test('Observable.amb throws before election', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var sourceNotDisposed = false;

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(210, error)
  );

  var o2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 3),
    onCompleted(250)).tap(function () { return sourceNotDisposed = true; });

  var results = scheduler.startScheduler(function () {
    return o1.amb(o2);
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.ok(!sourceNotDisposed);

  t.end();
});
