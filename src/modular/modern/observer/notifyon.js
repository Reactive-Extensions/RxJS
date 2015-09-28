'use strict';

var ObserveOnObserver = require('./observeronobserver');

/**
 * Schedules the invocation of observer methods on the given scheduler.
 * @param {Scheduler} scheduler Scheduler to schedule observer messages on.
 * @returns {Observer} Observer whose messages are scheduled on the given scheduler.
 */
module.exports = function (observer, scheduler) {
  return new ObserveOnObserver(scheduler, observer);
};
