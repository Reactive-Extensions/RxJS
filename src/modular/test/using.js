'use strict';

var test = require('tape');
var MockDisposable = require('../testing/mockdisposable');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe;

Observable.addToObject({
  using: require('../observable/using')
});

test('Observable.using null', function (t) {
  var xs, _d, disposable;

  var scheduler = new TestScheduler();

  var disposeInvoked = 0;
  var createInvoked = 0;

  var results = scheduler.startScheduler(function () {
    return Observable.using(function () {
      disposeInvoked++;
      disposable = null;
      return disposable;
    }, function (d) {
      _d = d;
      createInvoked++;

      xs = scheduler.createColdObservable(
        onNext(100, scheduler.clock),
        onCompleted(200));

      return xs;
    });
  });

  t.equal(disposable, _d);

  reactiveAssert(t, results.messages, [
    onNext(300, 200),
    onCompleted(400)
  ]);

  t.equal(1, createInvoked);
  t.equal(1, disposeInvoked);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  t.equal(disposable, null);

  t.end();
});

test('Observable.using complete', function (t) {
  var disposable, xs, _d;

  var scheduler = new TestScheduler();

  var disposeInvoked = 0;
  var createInvoked = 0;

  var results = scheduler.startScheduler(function () {
    return Observable.using(function () {
      disposeInvoked++;
      disposable = new MockDisposable(scheduler);
      return disposable;
    }, function (d) {
      _d = d;
      createInvoked++;
      xs = scheduler.createColdObservable(onNext(100, scheduler.clock), onCompleted(200));
      return xs;
    });
  });

  t.equal(disposable, _d);

  reactiveAssert(t, results.messages, [
    onNext(300, 200),
    onCompleted(400)
  ]);

  t.equal(1, createInvoked);
  t.equal(1, disposeInvoked);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)
  ]);

  reactiveAssert(t, disposable.disposes, [
    200, 400
  ]);

  t.end();
});

test('Observable.using error', function (t) {
  var disposable, xs, _d;

  var scheduler = new TestScheduler();

  var disposeInvoked = 0;
  var createInvoked = 0;

  var error = new Error();

  var results = scheduler.startScheduler(function () {
    return Observable.using(function () {
      disposeInvoked++;
      disposable = new MockDisposable(scheduler);
      return disposable;
    }, function (d) {
      _d = d;
      createInvoked++;
      xs = scheduler.createColdObservable(
        onNext(100, scheduler.clock),
        onError(200, error));

      return xs;
    });
  });

  t.equal(disposable, _d);

  reactiveAssert(t, results.messages, [
    onNext(300, 200),
    onError(400, error)
  ]);

  t.equal(1, createInvoked);
  t.equal(1, disposeInvoked);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 400)]
  );

  reactiveAssert(t, disposable.disposes, [200, 400]);

  t.end();
});

test('Observable.using dispose', function (t) {
  var disposable, xs, _d;

  var scheduler = new TestScheduler();

  var disposeInvoked = 0;
  var createInvoked = 0;

  var results = scheduler.startScheduler(function () {
    return Observable.using(function () {
      disposeInvoked++;
      disposable = new MockDisposable(scheduler);
      return disposable;
    }, function (d) {
      _d = d;
      createInvoked++;
      xs = scheduler.createColdObservable(
        onNext(100, scheduler.clock),
        onNext(1000, scheduler.clock + 1));

      return xs;
    });
  });

  t.equal(disposable, _d);

  reactiveAssert(t, results.messages, [
    onNext(300, 200)
  ]);

  t.equal(1, createInvoked);
  t.equal(1, disposeInvoked);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  reactiveAssert(t, disposable.disposes, [200, 1000]);

  t.end();
});

test('Observable.using throw resource selector', function (t) {
  var scheduler = new TestScheduler();

  var disposeInvoked = 0;
  var createInvoked = 0;

  var error = new Error();

  var results = scheduler.startScheduler(function () {
    return Observable.using(function () {
      disposeInvoked++;
      throw error;
    }, function () {
      createInvoked++;
      return Observable.never();
    });
  });

  reactiveAssert(t, results.messages, [
    onError(200, error)
  ]);

  t.equal(0, createInvoked);
  t.equal(1, disposeInvoked);

  t.end();
});

test('Observable.using throw resource usage', function (t) {
  var disposable;

  var scheduler = new TestScheduler();

  var disposeInvoked = 0;
  var createInvoked = 0;

  var error = new Error();

  var results = scheduler.startScheduler(function () {
    return Observable.using(function () {
      disposeInvoked++;
      disposable = new MockDisposable(scheduler);
      return disposable;
    }, function () {
      createInvoked++;
      throw error;
    });
  });

  reactiveAssert(t, results.messages, [
    onError(200, error)
  ]);

  t.equal(1, createInvoked);
  t.equal(1, disposeInvoked);

  reactiveAssert(t, disposable.disposes, [200, 200]);

  t.end();
});
