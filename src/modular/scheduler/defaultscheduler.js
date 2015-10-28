'use strict';

var Disposable = require('../disposable');
var BinaryDisposable = require('../binarydisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var Scheduler = require('../scheduler');
var isFunction = require('../helpers/isfunction');
var noop = require('../helpers/noop');
var inherits = require('util').inherits;

// TODO: Add more speed here
var scheduleMethod, clearMethod;
if (isFunction(global.setImmediate)) {
  scheduleMethod = global.setImmediate;
  clearMethod = global.clearImmediate;
} else if (isFunction(global.process.nextTick)) {
  scheduleMethod = global.nextTick;
  clearMethod = noop;
} else {
  scheduleMethod = function (fn) { return global.setTimeout(fn, 0); };
  clearMethod = global.clearTimeout;
}

/**
* Gets a scheduler that schedules work via a timed callback based upon platform.
*/
function DefaultScheduler() {
  Scheduler.call(this);
}

inherits(DefaultScheduler, Scheduler);

function scheduleAction(disposable, action, scheduler, state) {
  return function schedule() {
    disposable.setDisposable(Disposable._fixup(action(scheduler, state)));
  };
}

function ClearDisposable(method, id) {
  this._id = id;
  this._method = method;
  this.isDisposed = false;
}

ClearDisposable.prototype.dispose = function () {
  if (!this.isDisposed) {
    this.isDisposed = true;
    this._method.call(null, this._id);
  }
};

DefaultScheduler.prototype.schedule = function (state, action) {
  var disposable = new SingleAssignmentDisposable(),
      id = scheduleMethod(scheduleAction(disposable, action, this, state));
  return new BinaryDisposable(disposable, new ClearDisposable(clearMethod, id));
};

DefaultScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
  if (dueTime === 0) { return this.schedule(state, action); }
  var disposable = new SingleAssignmentDisposable(),
      id = global.setTimeout(scheduleAction(disposable, action, this, state), dueTime);
  return new BinaryDisposable(disposable, new ClearDisposable(global.clearTimeout, id));
};

global.Rx || (global.Rx = {});
global.Rx.defaultScheduler = new DefaultScheduler();
