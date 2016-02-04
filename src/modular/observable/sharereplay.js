'use strict';

var replay = require('./replay');

module.exports = function shareReplay(source, bufferSize, windowSize, scheduler) {
  return replay(source, null, bufferSize, windowSize, scheduler).refCount();
};
