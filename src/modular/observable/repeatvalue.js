'use strict';

var just = require('./just');
var repeat = require('./repeat');
var isScheduler = require('../scheduler').isScheduler;

global._Rx || (global._Rx = {});
if (!global._Rx.currentThreadScheduler) {
  require('../scheduler/currentthreadscheduler');
}

module.exports = function repeatValue(value, repeatCount, scheduler) {
  isScheduler(scheduler) || (scheduler = global._Rx.currentThreadScheduler);
  return repeat(just(value, scheduler), repeatCount);
};
