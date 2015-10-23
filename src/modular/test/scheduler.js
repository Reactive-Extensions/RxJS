'use strict';
/* jshint undef: true, unused: true */

var Scheduler = require('../scheduler');
var Disposable = require('../disposable');
var inherits = require('util').inherits;
var test = require('tape');

global.Rx || (global.Rx = {});
if (!global.Rx.immediateScheduler) {
  require('../scheduler/immediatescheduler');
}

function MyScheduler(now) {
  if (now !== undefined) { this.now = function () { return now; }; }
  this.waitCycles = 0;
  Scheduler.call(this);
}

inherits(MyScheduler, Scheduler);

MyScheduler.prototype.schedule = function (state, action) {
  return action(this, state);
};

MyScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
  var self = this;
  this.check(function (o) { return action(self, o); }, state, dueTime);
  this.waitCycles += dueTime;
  return action(this, state);
};

test('scheduler schedule non-recursive', function (t) {
  var ms = new MyScheduler();

  var res = false;

  ms.scheduleRecursive(null, function () { res = true; });

  t.ok(res);
  t.end();
});

test('scheduler schedule recursive', function (t) {
  var ms = new MyScheduler();

  var i = 0;

  ms.scheduleRecursive(null, function (_, a) { ++i < 10 && a(); });

  t.equal(10, i);
  t.end();
});

test('scheduler schedule with time non-recursive', function (t) {
  var now = new Date();

  var ms = new MyScheduler(now);

  var res = false;

  ms.check = function (a, s, t) { t.equal(t, 0); };
  ms.scheduleFuture(null, now, function () { res = true; });

  t.ok(res);

  t.equal(ms.waitCycles, 0);

  t.end();
});

test('scheduler schedule with absolute time recursive', function (t) {
  var now = new Date();

  var i = 0;

  var ms = new MyScheduler(now);

  ms.check = function (a, s, t) { t.equal(t, 0); };

  ms.scheduleRecursiveFuture(null, now, function (_, a) {
    ++i < 10 && a(null, now);
  });

  t.equal(ms.waitCycles, 0);
  t.equal(10, i);
  t.end();
});

test('scheduler schedule with relative time non-recursive', function (t) {
  var now = new Date().getTime();

  var ms = new MyScheduler(now);

  ms.check = function (a, s, t) { t.equal(t, 0);   };

  var res = false;
  ms.scheduleRecursiveFuture(null, 0, function () { res = true; });

  t.ok(res);
  t.equal(ms.waitCycles, 0);
  t.end();
});

test('scheduler schedule with time recursive', function (t) {
  var now = +new Date();

  var i = 0;

  var ms = new MyScheduler(now);

  ms.check = function (a, s, tt) {
    return t.ok(tt < 10);
  };

  ms.scheduleRecursiveFuture(null, 0, function (_, a) {
    ++i < 10 && a(null, i);
  });

  t.equal(ms.waitCycles, 45);
  t.equal(10, i);
  t.end();
});

test('catch builtin swallow shallow', function (t) {
  var swallow = global.Rx.immediateScheduler.catchError(function () { return true; });

  swallow.schedule(null, function () { throw new Error('Should be swallowed'); });

  t.ok(true);
  t.end();
});

test('catch builtin swallow recursive', function (t) {
  var swallow = global.Rx.immediateScheduler.catchError(function () { return true; });

  swallow.schedule(42, function (self) {
    return self.schedule(null, function () { new Error('Should be swallowed'); });
  });

  t.ok(true);
  t.end();
});

function MyErrorScheduler(onError) {
  this._onError = onError;
  Scheduler.call(this);
}

inherits(MyErrorScheduler, Scheduler);

MyErrorScheduler.prototype.schedule = function (state, action) {
  try {
    return action(this, state);
  } catch (e) {
    this._onError(e);
    return Disposable.empty;
  }
};

MyErrorScheduler.prototype.schedulePeriodic = function (state, period, action) {
  global.Rx.immediateScheduler.schedule(this, function (_, self) {
    try {
      var s = state;
      for(var i = 0; true; i++) {
        if (i > 10) { break; }
        s = action(s);
      }
    } catch (e) {
      self._onError(e);
    }
  });
};

test('catch custom unhandled', function (t) {
  var err;

  var scheduler = new MyErrorScheduler(function (ex) { err = ex; });

  scheduler
    .catchError(function () { return true; })
    .schedule(null, function () { throw new Error('Should be caught'); });

  t.ok(!err);

  var ex1 = 'error';
  scheduler
    .catchError(function () { return ex1 instanceof Error; })
    .schedule(null, function () { throw ex1; });

  t.equal(err, ex1);
  t.end();
});

test('catch custom periodic caught', function (t) {
  var err;

  var scheduler = new MyErrorScheduler(function (ex) { err = ex; });

  var catcher = scheduler.catchError(function () { return true; });

  catcher.schedulePeriodic(42, 0, function () {
    throw new Error('Should be caught');
  });

  t.ok(!err);
  t.end();
});

test('catch custom periodic uncaught', function (t) {
  var ex = new Error('Error1');

  var err;

  var scheduler = new MyErrorScheduler(function (e) { err = e; });

  var catcher = scheduler.catchError(function (e) { return e instanceof String; });

  catcher.schedulePeriodic(42, 0, function () { throw ex; });

  t.equal(err, ex);
  t.end();
});
