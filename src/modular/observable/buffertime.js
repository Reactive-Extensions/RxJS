'use strict';

var flatMap = require('./flatmap');
var windowTime = require('./windowtime');

function toArray(x) { return x.toArray(); }

module.exports = function bufferTime (source, timeSpan, timeShiftOrScheduler, scheduler) {
  return flatMap(windowTime(source, timeSpan, timeShiftOrScheduler, scheduler), toArray);
};
