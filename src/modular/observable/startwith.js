'use strict';

var concat = require('./concat');
var fromArray = require('./fromarray');
var Scheduler = require('../scheduler');

module.exports = function startWith () {
  var source = arguments[0], scheduler, start = 1;
  if (Scheduler.isScheduler(arguments[1])) {
    scheduler = arguments[1];
    start = 2;
  } else {
    scheduler = Scheduler.immediate;
  }
  for(var args = [], i = start, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
  return concat(fromArray(args, scheduler), source);
};
