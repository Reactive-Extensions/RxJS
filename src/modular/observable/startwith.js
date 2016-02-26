'use strict';

var concat = require('./concat');
var fromArray = require('./fromarray');
var isScheduler = require('../scheduler').isScheduler;

global._Rx || (global._Rx = {});
if (!global._Rx.immediateScheduler) {
  require('../scheduler/immediatescheduler');
}

module.exports = function startWith () {
  var source = arguments[0], scheduler, start = 1;
  if (isScheduler(arguments[1])) {
    scheduler = arguments[1];
    start = 2;
  } else {
    scheduler = global._Rx.immediateScheduler;
  }
  for(var args = [], i = start, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
  return concat(fromArray(args, scheduler), source);
};
