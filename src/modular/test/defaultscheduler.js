'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var Scheduler = require('../scheduler');

test('Scheduler.async now', function (t) {
  var res = Scheduler.async.now() - +new Date();

  t.ok(res < 1000, 'Should be near zero');

  t.end();
});

test('Scheduler.async schedule action', function (t) {
  Scheduler.async.schedule(true, function (s, state) {
    t.ok(state, 'should schedule action');
    t.end();
  });
});

test('Scheduler.async schedule relative', function (t) {
  Scheduler.async.scheduleFuture(+new Date(), 200, function (s, startTime) {
    var endTime = +new Date();
    t.ok(endTime - startTime > 180, endTime - startTime);
    t.end();
  });
});

test('Scheduler.async schedule action cancel', function (t) {
  var set = false;
  var d = Scheduler.async.scheduleFuture(null, 200, function () { set = true; });

  d.dispose();

  setTimeout(function () {
    t.ok(!set, 'after cancel should not be set');
    t.end();
  }, 400);
});
