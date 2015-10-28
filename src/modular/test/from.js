'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
    onError = ReactiveTest.onError,
    onCompleted = ReactiveTest.onCompleted;

Observable.addToObject({
  from: require('../observable/from')
});

test('Observable.from Array', function (t) {
  var array = [1, 2, 3, 4, 5];

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.from(array, null, null, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 1),
    onNext(202, 2),
    onNext(203, 3),
    onNext(204, 4),
    onNext(205, 5),
    onCompleted(206)
  ]);

  t.end();
});

test('Observable.from Array disposed', function (t) {
  var array = [1, 2, 3, 4, 5];

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.from(array, null, null, scheduler);
  }, { disposed: 204 });

  reactiveAssert(t, results.messages, [
    onNext(201, 1),
    onNext(202, 2),
    onNext(203, 3)
  ]);

  t.end();
});

test('Observable.from array empty', function (t) {
  var array = [];

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.from(array, null, null, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(201)
  ]);

  t.end();
});

test('Observable.from with length', function (t) {
  var array = { length: 5 };

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.from(array, function (v, k) { return k; }, null, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 0),
    onNext(202, 1),
    onNext(203, 2),
    onNext(204, 3),
    onNext(205, 4),
    onCompleted(206)
  ]);

  t.end();
});

test('Observable.from With String', function (t) {
  var array = 'foo';

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.from(array, null, null, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 'f'),
    onNext(202, 'o'),
    onNext(203, 'o'),
    onCompleted(204)
  ]);

  t.end();
});

test('Observable.from with selector', function (t) {
  var array = [1,2,3];

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.from(array, function (x) { return x + x; }, null, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 2),
    onNext(202, 4),
    onNext(203, 6),
    onCompleted(204)
  ]);

  t.end();
});

test('Observable.from with selector error', function (t) {
  var array = [1,2,3];
  var error = new Error('woops');

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.from(array, function () { throw error; }, null, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(201, error)
  ]);

  t.end();
});

test('Observable.from with selector some error', function (t) {
  var array = [1,2,3];
  var error = new Error('woops');

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.from(array, function (x, i) {
      if (i > 1) { throw error; }
      return x + x;
    }, null, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 2),
    onNext(202, 4),
    onError(203, error)
  ]);

  t.end();
});

test('Observable.from With Selector And Context', function (t) {
  var array = [1,2,3];
  var context = 42;

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.from(array, function (x) {
      t.equal(this, context);
      return x + x;
    }, context, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 2),
    onNext(202, 4),
    onNext(203, 6),
    onCompleted(204)
  ]);

  t.end();
});

// Shim in iterator support
var $iterator$ = (typeof global.Symbol === 'function' && global.Symbol.iterator) ||
  '_es6shim_iterator_';
// Bug for mozilla version
if (global.Set && typeof new global.Set()['@@iterator'] === 'function') {
  $iterator$ = '@@iterator';
}

// Check for Map
if (!!global.Map && new global.Map()[$iterator$] !== undefined) {
  test('Observable.from With Map', function (t) {
    var array = new global.Map([[1, 2], [2, 4], [4, 8]]);

    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.from(array, null, null, scheduler);
    });

    reactiveAssert(t, results.messages, [
      onNext(201, [1,2]),
      onNext(202, [2,4]),
      onNext(203, [4,8]),
      onCompleted(204)
    ]);

    t.end();
  });
}

if (!!global.Set && new global.Set()[$iterator$] !== undefined) {
  test('Observable.from With Set', function (t) {
    var array = new global.Set(['foo','bar','baz']);

    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.from(array, null, null, scheduler);
    });

    reactiveAssert(t, results.messages, [
      onNext(201, 'foo'),
      onNext(202, 'bar'),
      onNext(203, 'baz'),
      onCompleted(204)
    ]);

    t.end();
  });
}
