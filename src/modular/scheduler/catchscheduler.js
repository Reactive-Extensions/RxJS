'use strict';

var Scheduler = require('../scheduler');
var Disposable = require('../disposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var inherits = require('inherits');
var tryCatchUtils = require('../internal/trycatchutils');
var tryCatch = tryCatchUtils.tryCatch, thrower = tryCatchUtils.thrower;

function CatchScheduler(scheduler, handler) {
  this._scheduler = scheduler;
  this._handler = handler;
  this._recursiveOriginal = null;
  this._recursiveWrapper = null;
  Scheduler.call(this);
}

inherits(CatchScheduler, Scheduler);

CatchScheduler.prototype.schedule = function (state, action) {
  return this._scheduler.schedule(state, this._wrap(action));
};

CatchScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
  return this._scheduler.schedule(state, dueTime, this._wrap(action));
};

CatchScheduler.prototype.now = function () { return this._scheduler.now(); };

CatchScheduler.prototype._clone = function (scheduler) {
  return new CatchScheduler(scheduler, this._handler);
};

CatchScheduler.prototype._wrap = function (action) {
  var parent = this;
  return function (self, state) {
    var res = tryCatch(action)(parent._getRecursiveWrapper(self), state);
    if (res === global.Rx.errorObj) {
      if (!parent._handler(res.e)) { thrower(res.e); }
      return Disposable.empty;
    }
    return Disposable._fixup(res);
  };
};

CatchScheduler.prototype._getRecursiveWrapper = function (scheduler) {
  if (this._recursiveOriginal !== scheduler) {
    this._recursiveOriginal = scheduler;
    var wrapper = this._clone(scheduler);
    wrapper._recursiveOriginal = scheduler;
    wrapper._recursiveWrapper = wrapper;
    this._recursiveWrapper = wrapper;
  }
  return this._recursiveWrapper;
};

CatchScheduler.prototype.schedulePeriodic = function (state, period, action) {
  var self = this, failed = false, d = new SingleAssignmentDisposable();

  d.setDisposable(this._scheduler.schedulePeriodic(state, period, function (state1) {
    if (failed) { return null; }
    var res = tryCatch(action)(state1);
    if (res === global.Rx.errorObj) {
      failed = true;
      if (!self._handler(res.e)) { thrower(res.e); }
      d.dispose();
      return null;
    }
    return res;
  }));

  return d;
};

module.exports = CatchScheduler;
