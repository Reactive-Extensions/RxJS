'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onError = ReactiveTest.onError;

Observable.addToObject({
  'throw': require('../observable/throw')
});

function noop () { }

test('throw basic', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error();

  var results = scheduler.startScheduler(function () {
    return Observable['throw'](error, scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(201, error)
  ]);
  t.end();
});

test('throw disposed', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable['throw'](new Error(), scheduler);
  }, { disposed: 200 });

  reactiveAssert(t, results.messages, []);
  t.end();
});

test('throw observer throws', function (t) {
  var scheduler = new TestScheduler();

  var xs = Observable['throw'](new Error(), scheduler);

  xs.subscribe(noop, function () { throw new Error(); });

  t.throws(function () { scheduler.start(); });
  t.end();
});
