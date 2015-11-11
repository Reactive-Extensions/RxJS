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
  fromArray: require('../observable/fromarray')
});

Observable.addToPrototype({
  'switchFirst': require('../observable/switchfirst')
});

test('Observable#switchFirst Promise', function (t) {
  var sources = Observable.fromArray([
    Promise.resolve(0),
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3)
  ]);

  sources['switchFirst']().subscribe(function (x) {
    t.equal(0, x);
    t.end();
  });
});

test('Observable#switchFirst Promise error', function (t) {
  var sources = Observable.fromArray([
    Promise.resolve(0),
    Promise.resolve(1),
    Promise.reject(2),
    Promise.resolve(3)
  ]);

  sources['switchFirst']().subscribe(function (x) {
    t.equal(0, x);
    t.end();
  }, function (err) {
    t.equal(2, err);
    t.end();
  });
});

test('Observable#switchFirst Data', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, scheduler.createColdObservable(
      onNext(10, 101),
      onNext(20, 102),
      onNext(110, 103),
      onNext(120, 104),
      onNext(210, 105),
      onNext(220, 106),
      onCompleted(230))
    ),
    onNext(400, scheduler.createColdObservable(
      onNext(10, 201),
      onNext(20, 202),
      onNext(30, 203),
      onNext(40, 204),
      onCompleted(50))
    ),
    onNext(500, scheduler.createColdObservable(
      onNext(10, 301),
      onNext(20, 302),
      onNext(30, 303),
      onNext(40, 304),
      onCompleted(150))
    ),
    onCompleted(600)
  );

  var results = scheduler.startScheduler(function () {
    return xs['switchFirst']();
  });

  reactiveAssert(t, results.messages, [
    onNext(310, 101),
    onNext(320, 102),
    onNext(410, 103),
    onNext(420, 104),
    onNext(510, 105),
    onNext(520, 106),
    onCompleted(600)
  ]);

  t.end();
});

test('Observable#switchFirst inner throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, scheduler.createColdObservable(
      onNext(10, 101),
      onNext(20, 102),
      onNext(110, 103),
      onNext(120, 104),
      onNext(210, 105),
      onNext(220, 106),
      onCompleted(230))
    ),
    onNext(400, scheduler.createColdObservable(
      onNext(10, 201),
      onNext(20, 202),
      onNext(30, 203),
      onNext(40, 204),
      onError(50, error))
    ),
    onNext(500, scheduler.createColdObservable(
      onNext(10, 301),
      onNext(20, 302),
      onNext(30, 303),
      onNext(40, 304),
      onCompleted(150))
    ),
    onCompleted(600)
  );

  var results = scheduler.startScheduler(function () {
    return xs['switchFirst']();
  });

  reactiveAssert(t, results.messages, [
    onNext(310, 101),
    onNext(320, 102),
    onNext(410, 103),
    onNext(420, 104),
    onNext(510, 105),
    onNext(520, 106),
    onCompleted(600)
  ]);

  t.end();
});

test('Observable#switchFirst outer throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, scheduler.createColdObservable(
      onNext(10, 101),
      onNext(20, 102),
      onNext(110, 103),
      onNext(120, 104),
      onNext(210, 105),
      onNext(220, 106),
      onCompleted(230))
    ),
    onNext(400, scheduler.createColdObservable(
      onNext(10, 201),
      onNext(20, 202),
      onNext(30, 203),
      onNext(40, 204),
      onCompleted(50))
    ),
    onError(500, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs['switchFirst']();
  });

  reactiveAssert(t, results.messages, [
    onNext(310, 101),
    onNext(320, 102),
    onNext(410, 103),
    onNext(420, 104),
    onError(500, error)
  ]);

  t.end();
});

test('Observable#switchFirst no inner', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onCompleted(500)
  );

  var results = scheduler.startScheduler(function () {
    return xs['switchFirst']();
  });

  reactiveAssert(t, results.messages, [
    onCompleted(500)
  ]);

  t.end();
});

test('Observable#switchFirst inner completes', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, scheduler.createColdObservable(
      onNext(10, 101),
      onNext(20, 102),
      onNext(110, 103),
      onNext(120, 104),
      onNext(210, 105),
      onNext(220, 106),
      onCompleted(230))
    ),
    onCompleted(540)
  );

  var results = scheduler.startScheduler(function () {
    return xs['switchFirst']();
  });

  reactiveAssert(t, results.messages, [
    onNext(310, 101),
    onNext(320, 102),
    onNext(410, 103),
    onNext(420, 104),
    onNext(510, 105),
    onNext(520, 106),
    onCompleted(540)
  ]);

  t.end();
});
