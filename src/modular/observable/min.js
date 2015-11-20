'use strict';

var minBy = require('./minby');
var EmptyError = require('../internal/errors').EmptyError;
var identity = require('../helpers/identity');

function firstOnly(x) {
  if (x.length === 0) { throw new EmptyError(); }
  return x[0];
}

module.exports = function min (source, comparer) {
  return minBy(source, identity, comparer).map(firstOnly);
};
