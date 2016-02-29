'use strict';

var errors = require('./internal/errors');
var Disposable = require('./disposable');
var CompositeDisposable = require('./compositedisposable');

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

function PeriodicDisposable(id) {
  this._id = id;
  this.isDisposed = false;
}

PeriodicDisposable.prototype.dispose = function () {
  if (!this.isDisposed) {
    this.isDisposed = true;
    global.clearInterval(this._id);
  }
};

/**
 * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using window.setInterval for the base implementation.
 * @param {Mixed} state Initial state passed to the action upon the first iteration.
 * @param {Number} period Period for running the work periodically.
 * @param {Function} action Action to be executed, potentially updating the state.
 * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
 */
Scheduler.prototype.schedulePeriodic = function(state, period, action) {
  if (typeof global.setInterval === 'undefined') { throw new errors.NotSupportedError(); }
  period = Scheduler.normalize(period);
  var s = state, id = global.setInterval(function () { s = action(s); }, period);
  return new PeriodicDisposable(id);
};

function invokeRecImmediate(scheduler, pair) {
  var state = pair[0], action = pair[1], group = new CompositeDisposable();
  action(state, innerAction);
  return group;

  function innerAction(state2) {
    var isAdded = false, isDone = false;

    var d = scheduler.schedule(state2, scheduleWork);
    if (!isDone) {
      group.add(d);
      isAdded = true;
    }

    function scheduleWork(_, state3) {
      if (isAdded) {
        group.remove(d);
      } else {
        isDone = true;
      }
      action(state3, innerAction);
      return Disposable.empty;
    }
  }
}

function invokeRecDate(scheduler, pair) {
  var state = pair[0], action = pair[1], group = new CompositeDisposable();
  action(state, innerAction);
  return group;

  function innerAction(state2, dueTime1) {
    var isAdded = false, isDone = false;

    var d = scheduler.scheduleFuture(state2, dueTime1, scheduleWork);
    if (!isDone) {
      group.add(d);
      isAdded = true;
    }

    function scheduleWork(_, state3) {
      if (isAdded) {
        group.remove(d);
      } else {
        isDone = true;
      }
      action(state3, innerAction);
      return Disposable.empty;
    }
  }
}

/**
 * Schedules an action to be executed recursively.
 * @param {Mixed} state State passed to the action to be executed.
 * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in recursive invocation state.
 * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
 */
Scheduler.prototype.scheduleRecursive = function (state, action) {
  return this.schedule([state, action], invokeRecImmediate);
};

/**
 * Schedules an action to be executed recursively after a specified relative or absolute due time.
 * @param {Mixed} state State passed to the action to be executed.
 * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.
 * @param {Number | Date} dueTime Relative or absolute time after which to execute the action for the first time.
 * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
 */
Scheduler.prototype.scheduleRecursiveFuture = function (state, dueTime, action) {
  return this.scheduleFuture([state, action], dueTime, invokeRecDate);
};

var defaultNow = (function () { return !!Date.now ? Date.now : function () { return +new Date(); }; }());

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

var CurrentThreadScheduler = require('./scheduler/currentthreadscheduler');
var ImmediateScheduler = require('./scheduler/immediatescheduler');
var DefaultScheduler = require('./scheduler/defaultscheduler');
var CatchScheduler = require('./scheduler/catchscheduler');

Scheduler.queue = Scheduler.currentThread = new CurrentThreadScheduler();
Scheduler.async = Scheduler['default'] = new DefaultScheduler();
Scheduler.immediate = new ImmediateScheduler();

/**
 * Returns a scheduler that wraps the original scheduler, adding exception handling for scheduled actions.
 * @param {Function} handler Handler that's run if an exception is caught. The exception will be rethrown if the handler returns false.
 * @returns {Scheduler} Wrapper around the original scheduler, enforcing exception handling.
 */
Scheduler.prototype['catch'] = function (handler) {
  return new CatchScheduler(this, handler);
};
