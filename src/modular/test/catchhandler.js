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
  'throw': require('../observable/throw')
});

Observable.addToPrototype({
  catchHandler: require('../observable/catchhandler')
});

test('Observable#catchHandler specific error caught', function (t) {
  var error = new Error();

  var handlerCalled = false;

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onError(230, error)
  );

  var o2 = scheduler.createHotObservable(
    onNext(240, 4),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return o1.catchHandler(function () {
      handlerCalled = true;
      return o2;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 3),
    onNext(240, 4),
    onCompleted(250)
  ]);

  t.ok(handlerCalled);

  t.end();
});

test('Observable#catchHandler specific error caughtImmediate', function (t) {
  var handlerCalled = false;

  var scheduler = new TestScheduler();

  var o2 = scheduler.createHotObservable(
    onNext(240, 4),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return Observable['throw'](new Error()).catchHandler(function () {
      handlerCalled = true;
      return o2;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(240, 4),
    onCompleted(250)
  ]);

  t.ok(handlerCalled);

  t.end();
});

test('Observable#catchHandler HandlerThrows', function (t) {
  var error = new Error();

  var error2 = new Error();

  var handlerCalled = false;

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onError(230, error)
  );

  var results = scheduler.startScheduler(function () {
    return o1.catchHandler(function () {
      handlerCalled = true;
      throw error2;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 3),
    onError(230, error2)
  ]);

  t.ok(handlerCalled);

  t.end();
});

test('Observable#catchHandler Nested OuterCatches', function (t) {
  var error = new Error();

  var firstHandlerCalled = false;
  var secondHandlerCalled = false;

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(215, error)
  );

  var o2 = scheduler.createHotObservable(
    onNext(220, 3),
    onCompleted(225)
  );

  var o3 = scheduler.createHotObservable(
    onNext(220, 4),
    onCompleted(225)
  );

  var results = scheduler.startScheduler(function () {
    return o1.catchHandler(function () {
      firstHandlerCalled = true;
      return o2;
    }).catchHandler(function () {
      secondHandlerCalled = true;
      return o3;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 3),
    onCompleted(225)
  ]);

  t.ok(firstHandlerCalled);
  t.ok(!secondHandlerCalled);

  t.end();
});

test('Observable#catchHandler throw from nested catch', function (t) {
  var error = new Error();

  var error2 = new Error();

  var firstHandlerCalled = false;
  var secondHandlerCalled = false;

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(215, error)
  );

  var o2 = scheduler.createHotObservable(
    onNext(220, 3),
    onError(225, error2)
  );

  var o3 = scheduler.createHotObservable(
    onNext(230, 4),
    onCompleted(235));

  var results = scheduler.startScheduler(function () {
    return o1.catchHandler(function (e) {
      firstHandlerCalled = true;
      t.equal(e, error);
      return o2;
    }).catchHandler(function (e) {
      secondHandlerCalled = true;
      t.equal(e, error2);
      return o3;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onCompleted(235)
  ]);

  t.ok(firstHandlerCalled);
  t.ok(secondHandlerCalled);

  t.end();
});
