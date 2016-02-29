'use strict';

var just = require('./just');
var repeat = require('./repeat');
var Scheduler = require('../scheduler');

module.exports = function repeatValue(value, repeatCount, scheduler) {
  Scheduler.isScheduler(scheduler) || (scheduler = Scheduler.queue);
  return repeat(just(value, scheduler), repeatCount);
};
