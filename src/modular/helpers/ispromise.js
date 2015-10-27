'use strict';

var isFunction = require('./isfunction');

module.exports = function isPromise (p) {
  return p && isFunction(p.then);
};
