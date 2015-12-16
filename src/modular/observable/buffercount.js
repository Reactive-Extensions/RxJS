'use strict';

var filter = require('./filter');
var flatMap = require('./flatmap');
var windowCount = require('./windowcount');

function toArray(x) { return x.toArray(); }
function notEmpty(x) { return x.length > 0; }

module.exports = function bufferCount (source, count, skip) {
  typeof skip !== 'number' && (skip = count);
  return filter(flatMap(windowCount(source, count, skip), toArray), notEmpty);
};
