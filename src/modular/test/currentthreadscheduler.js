'use strict';

var test = require('tape');

global._Rx || (global._Rx = {});
if (!global._Rx.currentThreadScheduler) {
  require('../scheduler/currentthreadscheduler');
}

global._Rx.currentThreadScheduler.ensureTrampoline = function (action) {
  if (this.scheduleRequired()) { this.schedule(null, action); } else { action(); }
};

test('current thread now', function (t) {
  var res = global._Rx.currentThreadScheduler.now() - new Date().getTime();

  t.ok(res < 1000);

  t.end();
});

test('current thread schedule action', function (t) {
  var ran = false;

  global._Rx.currentThreadScheduler.schedule(null, function () { ran = true; });

  t.ok(ran);

  t.end();
});

test('current thread schedule action error', function (t) {
  var error = new Error();

  try {
    global._Rx.currentThreadScheduler.schedule(error, function (_, e) { throw e; });
    t.ok(false);
  } catch (e) {
    t.equal(e, error);
  }

  t.end();
});

test('current thread schedule nested', function (t) {
  var ran = false;

  global._Rx.currentThreadScheduler.schedule(null, function () {
    global._Rx.currentThreadScheduler.schedule(null, function () { ran = true; });
  });

  t.ok(ran);

  t.end();
});

test('current thread ensure trampoline', function (t) {
  var ran1 = false, ran2 = false;

  global._Rx.currentThreadScheduler.ensureTrampoline(function () {
    global._Rx.currentThreadScheduler.schedule(null, function () { ran1 = true; });
    global._Rx.currentThreadScheduler.schedule(null, function () { ran2 = true; });
  });

  t.ok(ran1);
  t.ok(ran2);

  t.end();
});

test('current thread ensure trampoline nested', function (t) {
  var ran1 = false, ran2 = false;

  global._Rx.currentThreadScheduler.ensureTrampoline(function () {
    global._Rx.currentThreadScheduler.ensureTrampoline(function () { ran1 = true; });
    global._Rx.currentThreadScheduler.ensureTrampoline(function () { ran2 = true; });
  });

  t.ok(ran1);
  t.ok(ran2);

  t.end();
});

test('current thread ensure trampoline and cancel', function (t) {
  var ran1 = false, ran2 = false;

  global._Rx.currentThreadScheduler.ensureTrampoline(function () {
    global._Rx.currentThreadScheduler.schedule(null, function () {
      ran1 = true;
      var d = global._Rx.currentThreadScheduler.schedule(null, function () { ran2 = true; });
      d.dispose();
    });
  });

  t.ok(ran1);
  t.ok(!ran2);

  t.end();
});
