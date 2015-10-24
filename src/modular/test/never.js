'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');

Observable.addToObject({
  never: require('../observable/never')
});

test('never basic', function (t) {
  var scheduler = new TestScheduler();

  var xs = Observable.never();

  var results = scheduler.createObserver();

  xs.subscribe(results);

  scheduler.start();

  reactiveAssert(t, results.messages, []);
  t.end();
});
