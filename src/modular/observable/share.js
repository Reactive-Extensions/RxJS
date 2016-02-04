'use strict';

var publish = require('./publish');

module.exports = function share (source) {
  return publish(source).refCount();
};
