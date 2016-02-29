'use strict';

var fromArray = require('./fromarray');
var mergeAll = require('./mergeall');
var Scheduler = require('../scheduler');

module.exports = function merge() {
  var scheduler, sources = [], i, len = arguments.length;
  if (!arguments[0]) {
    scheduler = Scheduler.immediate;
    for(i = 1; i < len; i++) { sources.push(arguments[i]); }
  } else if (Scheduler.isScheduler(arguments[0])) {
    scheduler = arguments[0];
    for(i = 1; i < len; i++) { sources.push(arguments[i]); }
  } else {
    scheduler = Scheduler.immediate;
    for(i = 0; i < len; i++) { sources.push(arguments[i]); }
  }
  return mergeAll(fromArray(sources, scheduler));
};
