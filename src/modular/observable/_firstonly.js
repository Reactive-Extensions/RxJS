'use strict';

var EmptyError = require('../internal/errors').EmptyError;

module.exports = function firstOnly(x) {
  if (x.length === 0) { throw new EmptyError(); }
  return x[0];
};
