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
  never: require('../observable/never')
});

Observable.addToPrototype({
  repeatWhen: require('../observable/repeatwhen'),
  scan: require('../observable/scan'),
  takeWhile: require('../observable/takewhile')
});

test('Observable#repeatWhen never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.repeatWhen(function () {
      return Observable.empty(scheduler);
    });
  });

  reactiveAssert(t, results.messages, [
    onCompleted(250)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#repeatWhen Observable never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.repeatWhen(function () {
      return Observable.never();
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#repeatWhen Observable never complete', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.repeatWhen(function () {
      return Observable.never();
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 250)
  ]);

  t.end();
});

test('Observable#repeatWhen Observable Empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(100, 1),
    onNext(150, 2),
    onNext(200, 3),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.repeatWhen(function() {
      return Observable.empty(scheduler);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(300, 1),
    onNext(350, 2),
    onNext(400, 3),
    onCompleted(450)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 450)
  ]);

  t.end();
});

test('Observable#repeatWhen Observable Next Error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(10, 1),
    onNext(20, 2),
    onError(30, error),
    onCompleted(40)
  );

  var results = scheduler.startScheduler(function () {
    return xs.repeatWhen(function(attempts) {
      return attempts.scan(function(count) {
        if(++count === 2) {
          throw error;
        }
        return count;
      }, 0); // returning any nexting observable should cause a continue
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 1),
    onNext(220, 2),
    onError(230, error)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 230)
  ]);

  t.end();
});

test('Observable#repeatWhen Observable complete', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(10, 1),
    onNext(20, 2),
    onCompleted(30)
  );

  var results = scheduler.startScheduler(function () {
    return xs.repeatWhen(function() {
      return Observable.empty(scheduler); // a completing observable completes
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 1),
    onNext(220, 2),
    onCompleted(230)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 230)
  ]);

  t.end();
});

test('Observable#repeatWhen Observable next complete', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(10, 1),
    onNext(20, 2),
    onCompleted(30)
  );

  var results = scheduler.startScheduler(function () {
    return xs.repeatWhen(function(attempts) {
      return attempts.scan(function(count) {
        return count + 1;
      }, 0).takeWhile(function(count) {
        return count < 2;
      }); // returning any nexting observable should cause a continue
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 1),
    onNext(220, 2),
    onNext(240, 1),
    onNext(250, 2),
    onCompleted(260)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 230),
    subscribe(230, 260)
  ]);

  t.end();
});

test('Observable#repeatWhen Observable infinite', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(10, 1),
    onNext(20, 2),
    onCompleted(30)
  );

  var results = scheduler.startScheduler(function () {
    return xs.repeatWhen(function(){
      return Observable.never();
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 1),
    onNext(220, 2)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 230)
  ]);

  t.end();
});
