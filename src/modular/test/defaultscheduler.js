'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');

global.Rx || (global.Rx = {});
if (!global.Rx.defaultScheduler) {
  require('../scheduler/defaultscheduler');
}

test('default now', function (t) {
  var res = global.Rx.defaultScheduler.now() - +new Date();

  t.ok(res < 1000, 'Should be near zero');

  t.end();
});

test('default schedule action', function (t) {
  global.Rx.defaultScheduler.schedule(true, function (s, state) {
    t.ok(state, 'should schedule action');
    t.end();
  });
});

test('default schedule relative', function (t) {
  global.Rx.defaultScheduler.scheduleFuture(+new Date(), 200, function (s, startTime) {
    var endTime = +new Date();
    t.ok(endTime - startTime > 180, endTime - startTime);
    t.end();
  });
});

test('default schedule action cancel', function (t) {
  var set = false;
  var d = global.Rx.defaultScheduler.scheduleFuture(null, 200, function () { set = true; });

  d.dispose();

  setTimeout(function () {
    t.ok(!set, 'after cancel should not be set');
    t.end();
  }, 400);
});
