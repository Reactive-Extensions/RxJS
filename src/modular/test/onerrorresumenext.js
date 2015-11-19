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
  onErrorResumeNext: require('../observable/onerrorresumenext')
});

Observable.addToPrototype({
  onErrorResumeNext: require('../observable/onerrorresumenext')
});

test('Observable.onErrorResumeNext error multiple', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(220, new Error())
  );

  var o2 = scheduler.createHotObservable(
    onNext(230, 4),
    onError(240, new Error())
  );

  var o3 = scheduler.createHotObservable(
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.onErrorResumeNext(o1, o2, o3);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(230, 4),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable.onErrorResumeNext empty return throw and more', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(205)
  );

  var o2 = scheduler.createHotObservable(
    onNext(215, 2),
    onCompleted(220)
  );

  var o3 = scheduler.createHotObservable(
    onNext(225, 3),
    onNext(230, 4),
    onCompleted(235)
  );

  var o4 = scheduler.createHotObservable(
    onError(240, new Error())
  );

  var o5 = scheduler.createHotObservable(
    onNext(245, 5), onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.onErrorResumeNext(o1, o2, o3, o4, o5);
  });

  reactiveAssert(t, results.messages, [
    onNext(215, 2),
    onNext(225, 3),
    onNext(230, 4),
    onNext(245, 5),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable.onErrorResumeNext single source throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onError(230, error)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.onErrorResumeNext(o1);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(230)
  ]);

  t.end();
});

test('Observable.onErrorResumeNext end with never', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(220)
  );

  var o2 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return Observable.onErrorResumeNext(o1, o2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2)
  ]);

  t.end();
});

test('Observable.onErrorResumeNext start with never', function (t) {
  var scheduler = new TestScheduler();

  var o1 = Observable.never();

  var o2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(220)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.onErrorResumeNext(o1, o2);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable.onErrorResumeNext no errors', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onCompleted(230)
  );

  var o2 = scheduler.createHotObservable(
    onNext(240, 4),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return o1.onErrorResumeNext(o2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 3),
    onNext(240, 4),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable.onErrorResumeNext error', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onError(230, new Error())
  );

  var o2 = scheduler.createHotObservable(
    onNext(240, 4),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return o1.onErrorResumeNext(o2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 3),
    onNext(240, 4),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable.onErrorResumeNext empty return throw and more', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(220)
  );

  var o2 = scheduler.createHotObservable(
    onError(230, error)
  );

  var results = scheduler.startScheduler(function () {
    return o1.onErrorResumeNext(o2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onCompleted(230)
  ]);

  t.end();
});
