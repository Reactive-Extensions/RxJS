'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest'),
    onCompleted = ReactiveTest.onCompleted;

Observable.addToObject({
  empty: require('../observable/empty')
});


test('Observable.empty basic', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.empty(scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(201)
  ]);
  t.end();
});

test('Observable.empty disposed', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Observable.empty(scheduler);
  }, { disposed: 200 });

  reactiveAssert(t, results.messages, []);
  t.end();
});

function noop () { }

test('Observable.empty observer throws', function (t) {
  var scheduler = new TestScheduler();

  var xs = Observable.empty(scheduler);

  xs.subscribe(noop, noop, function () { throw new Error(); });

  t.throws(function () {
    scheduler.start();
  });
  t.end();
});
