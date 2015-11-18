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

Observable.addToPrototype({
  pluck: require('../observable/pluck')
});

test('Observable#pluck completed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, {prop: 1}),
    onNext(210, {prop: 2}),
    onNext(240, {prop: 3}),
    onNext(290, {prop: 4}),
    onNext(350, {prop: 5}),
    onCompleted(400),
    onNext(410, {prop: -1}),
    onCompleted(420),
    onError(430, new Error('ex'))
  );

  var results = scheduler.startScheduler(function () {
    return xs.pluck('prop');
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(350, 5),
    onCompleted(400)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  t.end();
});

test('deep pluck nested completed', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, {a: {b: {c: 1}}}),
    onNext(210, {a: {b: {c: 2}}}),
    onNext(240, {a: {b: {c: 3}}}),
    onNext(290, {a: {b: {c: 4}}}),
    onNext(350, {a: {b: {c: 5}}}),
    onCompleted(400),
    onNext(410, {a: {b: {c: -1}}}),
    onCompleted(420),
    onError(430, new Error('ex'))
  );

  var results = scheduler.startScheduler(function () {
    return xs.pluck('a', 'b', 'c');
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(240, 3),
    onNext(290, 4),
    onNext(350, 5),
    onCompleted(400)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  t.end();
});

test('deep pluck nested edge cases', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, {a: {b: {c: 1}}}),
    onNext(210, {a: {b: 2}}),
    onNext(240, {a: {c: {c: 3}}}),
    onNext(290, {}),
    onNext(350, {a: {b: {c: 5}}}),
    onCompleted(400),
    onNext(410, {a: {b: {c: -1}}}),
    onCompleted(420),
    onError(430, new Error('ex'))
  );

  var results = scheduler.startScheduler(function () {
    return xs.pluck('a', 'b', 'c');
  });

  reactiveAssert(t, results.messages, [
    onNext(210, undefined),
    onNext(240, undefined),
    onNext(290, undefined),
    onNext(350, 5),
    onCompleted(400)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  t.end();
});
