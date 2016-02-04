'use strict';

var publishValue = require('./publishvalue');

module.exports = function shareValue(source, initialValue) {
  return publishValue(source, initialValue).refCount();
};
