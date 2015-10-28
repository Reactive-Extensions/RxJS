'use strict';

var ObservableBase = require('./observablebase');
var Scheduler = require('../scheduler');
var inherits = require('util').inherits;

global.Rx || (global.Rx = {});
if (!global.Rx.defaultScheduler) {
  require('../scheduler/defaultscheduler');
}

function IntervalObservable(period, scheduler) {
  this._period = period;
  this._scheduler = scheduler;
  ObservableBase.call(this);
}

inherits(IntervalObservable, ObservableBase);

function createScheduleMethod(o) {
  return function scheduleMethod (count) {
    o.onNext(count);
    return count + 1;
  };
}

IntervalObservable.prototype.subscribeCore = function (o) {
  return this._scheduler.schedulePeriodic(0, this._period, createScheduleMethod(o));
};

/**
*  Returns an observable sequence that produces a value after each period.
* @param {Number} period Period for producing the values in the resulting sequence (specified as an integer denoting milliseconds).
* @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, Rx.Scheduler.timeout is used.
* @returns {Observable} An observable sequence that produces a value after each period.
*/
module.exports = function interval (period, scheduler) {
  Scheduler.isScheduler(scheduler) || (scheduler = global.Rx.defaultScheduler);
  return new IntervalObservable(period, scheduler);
};
