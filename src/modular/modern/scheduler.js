'use strict';

var errors = require('./helpers/errors');

function Scheduler() { }

/** Determines whether the given object is a scheduler */
Scheduler.isScheduler = function (s) {
  return s instanceof Scheduler;
};

/**
* Schedules an action to be executed.
* @param state State passed to the action to be executed.
* @param {Function} action Action to be executed.
* @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
*/
Scheduler.prototype.schedule = function (state, action) {
  throw new errors.NotImplementedError();
};

/**
* Schedules an action to be executed after dueTime.
* @param state State passed to the action to be executed.
* @param {Function} action Action to be executed.
* @param {Number} dueTime Relative time after which to execute the action.
* @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
*/
Scheduler.prototype.scheduleFuture = function (state, dueTime, action) {
  var dt = dueTime;
  dt instanceof Date && (dt = dt - this.now());
  dt = Scheduler.normalize(dt);

  if (dt === 0) { return this.schedule(state, action); }

  return this._scheduleFuture(state, dt, action);
};

Scheduler.prototype._scheduleFuture = function (state, dueTime, action) {
  throw new errors.NotImplementedError();
};

var defaultNow = (function () { return !!Date.now ? Date.now : function () { return +new Date; }; }())

/** Gets the current time according to the local machine's system clock. */
Scheduler.now = defaultNow;

/** Gets the current time according to the local machine's system clock. */
Scheduler.prototype.now = defaultNow;

/**
 * Normalizes the specified TimeSpan value to a positive value.
 * @param {Number} timeSpan The time span value to normalize.
 * @returns {Number} The specified TimeSpan value if it is zero or positive; otherwise, 0
 */
Scheduler.normalize = function (timeSpan) {
  timeSpan < 0 && (timeSpan = 0);
  return timeSpan;
};

module.exports = Scheduler;
