'use strict';
/* jshint undef: true, unused: true */
/* globals Promise */

var test = require('tape');
var Observable = require('../observable');
var isEqual = require('../internal/isequal');
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
  mergeAll: require('../observable/mergeall')
});

// Polyfilling
require('lie/polyfill');

test('Observable#mergeAll Promise', function (t) {
  var sources = Observable.fromArray([
    Promise.resolve(0),
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3),
  ]);

  var res = [];
  sources.mergeAll().subscribe(
    function (x) {
      res.push(x);
    },
    function () {
      t.ok(false);
    },
    function () {
      t.ok(isEqual([0,1,2,3], res));
      t.end();
    });
});

test('Observable#mergeAll Promise error', function (t) {
  var sources = Observable.fromArray([
    Promise.resolve(0),
    Promise.reject(1),
    Promise.resolve(2),
    Promise.resolve(3),
  ]);

  var res = [];
  sources.mergeAll().subscribe(
    function (x) {
      res.push(x);
    },
    function (err) {
      t.ok(res.length === 1);
      t.equal(1, err);
      t.end();
    });
});

test('Observable#mergeAll Observable of Observable data', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300,
      scheduler.createColdObservable(
        onNext(10, 101),
        onNext(20, 102),
        onNext(110, 103),
        onNext(120, 104),
        onNext(210, 105),
        onNext(220, 106),
        onCompleted(230))),
    onNext(400,
      scheduler.createColdObservable(
        onNext(10, 201),
        onNext(20, 202),
        onNext(30, 203),
        onNext(40, 204),
        onCompleted(50))),
    onNext(500,
      scheduler.createColdObservable(
        onNext(10, 301),
        onNext(20, 302),
        onNext(30, 303),
        onNext(40, 304),
        onNext(120, 305),
        onCompleted(150))),
    onCompleted(600));

  var results = scheduler.startScheduler(function () {
    return xs.mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(310, 101),
    onNext(320, 102),
    onNext(410, 103),
    onNext(410, 201),
    onNext(420, 104),
    onNext(420, 202),
    onNext(430, 203),
    onNext(440, 204),
    onNext(510, 105),
    onNext(510, 301),
    onNext(520, 106),
    onNext(520, 302),
    onNext(530, 303),
    onNext(540, 304),
    onNext(620, 305),
    onCompleted(650)
  ]);

  t.end();
});

test('Observable#mergeAll Observable of Observable data non-overlapped', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300,
      scheduler.createColdObservable(
        onNext(10, 101),
        onNext(20, 102),
        onCompleted(230))),
    onNext(400,
      scheduler.createColdObservable(
        onNext(10, 201),
        onNext(20, 202),
        onNext(30, 203),
        onNext(40, 204),
        onCompleted(50))),
    onNext(500,
      scheduler.createColdObservable(
        onNext(10, 301),
        onNext(20, 302),
        onNext(30, 303),
        onNext(40, 304),
        onCompleted(50))),
    onCompleted(600));

  var results = scheduler.startScheduler(function () {
    return xs.mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(310, 101),
    onNext(320, 102),
    onNext(410, 201),
    onNext(420, 202),
    onNext(430, 203),
    onNext(440, 204),
    onNext(510, 301),
    onNext(520, 302),
    onNext(530, 303),
    onNext(540, 304),
    onCompleted(600)
  ]);

  t.end();
});

test('Observable#mergeAll Observable of Observable inner throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300,
      scheduler.createColdObservable(
        onNext(10, 101),
        onNext(20, 102),
        onCompleted(230))),
    onNext(400,
      scheduler.createColdObservable(
        onNext(10, 201),
        onNext(20, 202),
        onNext(30, 203),
        onNext(40, 204),
        onError(50, error))),
    onNext(500,
      scheduler.createColdObservable(
        onNext(10, 301),
        onNext(20, 302),
        onNext(30, 303),
        onNext(40, 304),
        onCompleted(50))),
    onCompleted(600));

  var results = scheduler.startScheduler(function () {
    return xs.mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(310, 101),
    onNext(320, 102),
    onNext(410, 201),
    onNext(420, 202),
    onNext(430, 203),
    onNext(440, 204),
    onError(450, error)
  ]);

  t.end();
});

test('Observable#mergeAll Observable of Observable outer throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300,
      scheduler.createColdObservable(
        onNext(10, 101),
        onNext(20, 102),
        onCompleted(230))),
    onNext(400,
      scheduler.createColdObservable(
        onNext(10, 201),
        onNext(20, 202),
        onNext(30, 203),
        onNext(40, 204),
        onCompleted(50))),
    onError(500, error));

  var results = scheduler.startScheduler(function () {
    return xs.mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(310, 101),
    onNext(320, 102),
    onNext(410, 201),
    onNext(420, 202),
    onNext(430, 203),
    onNext(440, 204),
    onError(500, error)
  ]);

  t.end();
});
