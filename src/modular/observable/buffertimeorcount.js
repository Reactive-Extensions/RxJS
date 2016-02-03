'use strict';

var flatMap = require('./flatmap');
var windowTimeOrCount = require('./windowtimeorcount');

function toArray(x) { return x.toArray(); }

module.exports = function bufferTimeOrCount (source, timeSpan, count, scheduler) {
  return flatMap(windowTimeOrCount(source, timeSpan, count, scheduler), toArray);
};
