'use strict';

var ObservableBase = require('./observablebase');
var defer = require('./defer');
var interval = require('./interval');
var Scheduler = require('../scheduler');
var inherits = require('util').inherits;

global.Rx || (global.Rx = {});
if (!global.Rx.defaultScheduler) {
  require('../scheduler/defaultscheduler');
}

function TimerObservable(dt, s) {
  this._dt = dt;
  this._s = s;
  ObservableBase.call(this);
}

inherits(TimerObservable, ObservableBase);

function scheduleTimer(s, o) {
  o.onNext(0);
  o.onCompleted();
}

TimerObservable.prototype.subscribeCore = function (o) {
  return this._s.scheduleFuture(o, this._dt, scheduleTimer);
};

function TimerPeriodObservable(dt, period, scheduler) {
  this._dt = dt;
  this._period = Scheduler.normalize(period);
  this._scheduler = scheduler;
  ObservableBase.call(this);
}

inherits(TimerPeriodObservable, ObservableBase);

function scheduleTimerPeriod(state, recurse) {
  if (state.p > 0) {
    var now = state.scheduler.now();
    state.dt = new Date(state.dt.getTime() + state.p);
    state.dt.getTime() <= now && (state.dt = new Date(now + state.p));
  }
  state.o.onNext(state.i++);
  recurse(state, new Date(state.dt));
}

TimerPeriodObservable.prototype.subscribeCore = function (o) {
  var state = {
    o: o,
    i: 0,
    p: this._period,
    dt: this._dt,
    scheduler: this._scheduler
  };
  return this._scheduler.scheduleRecursiveFuture(state, this._dt, scheduleTimerPeriod);
};

function timerRelativeAndPeriod(dt, period, scheduler) {
  if (dt === period) { return interval(dt, scheduler); }
  return defer(function () {
    return new TimerPeriodObservable(new Date(scheduler.now() + dt), period, scheduler);
  });
}

/**
 *  Returns an observable sequence that produces a value after dueTime has elapsed and then after each period.
 * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) at which to produce the first value.
 * @param {Mixed} [periodOrScheduler]  Period to produce subsequent values (specified as an integer denoting milliseconds), or the scheduler to run the timer on. If not specified, the resulting timer is not recurring.
 * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, the timeout scheduler is used.
 * @returns {Observable} An observable sequence that produces a value after due time has elapsed and then each period.
 */
module.exports = function timer (dueTime, periodOrScheduler, scheduler) {
  var period;
  Scheduler.isScheduler(scheduler) || (scheduler = global.Rx.defaultScheduler);
  if (periodOrScheduler != null && typeof periodOrScheduler === 'number') {
    period = periodOrScheduler;
  } else if (Scheduler.isScheduler(periodOrScheduler)) {
    scheduler = periodOrScheduler;
  }
  if ((dueTime instanceof Date || typeof dueTime === 'number') && period === undefined) {
    return new TimerObservable(dueTime, scheduler);
  }
  if (dueTime instanceof Date && period !== undefined) {
    return new TimerPeriodObservable(dueTime, periodOrScheduler, scheduler);
  }
  return timerRelativeAndPeriod(dueTime, period, scheduler);
};
