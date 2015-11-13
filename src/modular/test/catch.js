'use strict';

var test = require('tape');
var Observable = require('../observable');
var create = require('../observable/create');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted;

Observable.addToObject({
  'catch': require('../observable/catch'),
  never: require('../observable/never')
});

Observable.addToPrototype({
  'catch': require('../observable/catch')
});

test('Observable.catch NoErrors', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onCompleted(230)
  );

  var o2 = scheduler.createHotObservable(
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return o1['catch'](o2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 3),
    onCompleted(230)
  ]);

  t.end();
});

test('Observable.catch never', function (t) {
  var scheduler = new TestScheduler();

  var o1 = Observable.never();

  var o2 = scheduler.createHotObservable(
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return o1['catch'](o2);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('Observable.catch empty', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(230)
  );

  var o2 = scheduler.createHotObservable(
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return o1['catch'](o2);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(230)
  ]);

  t.end();
});

test('Observable.catch return', function (t) {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(230)
  );

  var o2 = scheduler.createHotObservable(
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return o1['catch'](o2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onCompleted(230)
  ]);

  t.end();
});

test('Observable.catch error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onError(230, error)
  );

  var o2 = scheduler.createHotObservable(
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return o1['catch'](o2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 3),
    onNext(240, 5),
    onCompleted(250)
  ]);

  t.end();
});

test('Observable.catch error never', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onError(230, error)
  );

  var o2 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return o1['catch'](o2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 3)
  ]);

  t.end();
});

test('Observable.catch error error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onError(230, new Error())
  );

  var o2 = scheduler.createHotObservable(
    onNext(240, 4),
    onError(250, error)
  );

  var results = scheduler.startScheduler(function () {
    return o1['catch'](o2);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 3),
    onNext(240, 4),
    onError(250, error)
  ]);

  t.end();
});

test('Observable.catch multiple', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(215, error)
  );

  var o2 = scheduler.createHotObservable(
    onNext(220, 3),
    onError(225, error)
  );

  var o3 = scheduler.createHotObservable(
    onNext(230, 4),
    onCompleted(235)
  );

  var results = scheduler.startScheduler(function () {
    return Observable['catch'](o1, o2, o3);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onCompleted(235)
  ]);

  t.end();
});

test('Observable.catch does not lose subscription to underlying observable', function (t) {
  var subscribes = 0,
    unsubscribes = 0,
    tracer = create(function () { ++subscribes; return function () { ++unsubscribes; }; }),
    s;

  // Try it without catchError()
  s = tracer.subscribe();
  t.equal(subscribes, 1, '1 subscribes');
  t.equal(unsubscribes, 0, '0 unsubscribes');
  s.dispose();
  t.equal(subscribes, 1, 'After dispose: 1 subscribes');
  t.equal(unsubscribes, 1, 'After dispose: 1 unsubscribes');

  // Now try again with catchError(Observable):
  subscribes = unsubscribes = 0;
  s = tracer['catch'](Observable.never()).subscribe();
  t.equal(subscribes, 1, 'catchError(Observable): 1 subscribes');
  t.equal(unsubscribes, 0, 'catchError(Observable): 0 unsubscribes');
  s.dispose();
  t.equal(subscribes, 1, 'catchError(Observable): After dispose: 1 subscribes');
  t.equal(unsubscribes, 1, 'catchError(Observable): After dispose: 1 unsubscribes');

  // And now try again with catchError(function()):
  subscribes = unsubscribes = 0;
  s = tracer['catch'](function () { return Observable.never(); }).subscribe();
  t.equal(subscribes, 1, 'catchError(function): 1 subscribes');
  t.equal(unsubscribes, 0, 'catchError(function): 0 unsubscribes');
  s.dispose();
  t.equal(subscribes, 1, 'catchError(function): After dispose: 1 subscribes');
  t.equal(unsubscribes, 1, 'catchError(function): After dispose: 1 unsubscribes'); // this one FAILS (unsubscribes is 0)

  t.end();
});
