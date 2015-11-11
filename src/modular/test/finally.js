'use strict';

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe;

Observable.addToObject({
  empty: require('../observable/empty'),
  'throw': require('../observable/throw')
});

Observable.addToPrototype({
  'finally': require('../observable/finally')
});

test('Observable#finally has orders of effects', function (t) {
  var results = [];
  function noop () {}

  var someObservable = Observable.empty()['finally'](function () {
    results.push('invoked');
  });

  someObservable.subscribe(noop, noop, function () {
    results.push('completed');
  });

  t.equal(results[0], 'completed');
  t.equal(results[1], 'invoked');

  t.end();
});

test('Observable#finally calls finally before throwing', function (t) {
  var invoked = false;

  var someObservable = Observable['throw'](new Error())['finally'](function () {
    invoked = true;
  });

  t.throws(function () {
    someObservable.subscribe();
  });

  t.ok(invoked, 'should have been invoked');

  t.end();
});

test('Observable#finally only called once on empty', function (t) {
  var invokeCount = 0;

  var someObservable = Observable.empty()['finally'](function () {
    invokeCount++;
  });

  var d = someObservable.subscribe();

  d.dispose();
  d.dispose();

  t.equal(1, invokeCount);

  t.end();
});

test('Observable#finally called with empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var invoked = false;

  var results = scheduler.startScheduler(function () {
    return xs['finally'](function () {
      invoked = true;
    });
  });

  reactiveAssert(t, results.messages, [
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.ok(invoked);

  t.end();
});

test('Observable#finally called with never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var invoked = false;

  var results = scheduler.startScheduler(function () {
    return xs['finally'](function () {
      invoked = true;
    });
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.ok(invoked);

  t.end();
});


test('Observable#finally called with single value', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );

  var invoked = false;

  var results = scheduler.startScheduler(function () {
    return xs['finally'](function () {
      invoked = true;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.ok(invoked);

  t.end();
});

test('Observable#finally on throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onError(250, error)
  );

  var invoked = false;

  var results = scheduler.startScheduler(function () {
    return xs['finally'](function () {
      invoked = true;
    });
  });

  reactiveAssert(t, results.messages, [
    onError(250, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.ok(invoked);

  t.end();
});
