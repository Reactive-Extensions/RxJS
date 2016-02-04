'use strict';

var toAsync = require('./toasync');

module.exports = function start (func, context, scheduler) {
  return toAsync(func, context, scheduler)();
};
