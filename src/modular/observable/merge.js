'use strict';

var fromArray = require('./fromarray');
var mergeAll = require('./mergeall');
var isScheduler = require('../scheduler').isScheduler;

global._Rx || (global._Rx = {});
if (!global._Rx.immediateScheduler) {
  require('../scheduler/immediatescheduler');
}

module.exports = function merge() {
  var scheduler, sources = [], i, len = arguments.length;
  if (!arguments[0]) {
    scheduler = global._Rx.immediateScheduler;
    for(i = 1; i < len; i++) { sources.push(arguments[i]); }
  } else if (isScheduler(arguments[0])) {
    scheduler = arguments[0];
    for(i = 1; i < len; i++) { sources.push(arguments[i]); }
  } else {
    scheduler = global._Rx.immediateScheduler;
    for(i = 0; i < len; i++) { sources.push(arguments[i]); }
  }
  sources.forEach(function (x) { console.log(x); });
  return mergeAll(fromArray(sources, scheduler));
};
