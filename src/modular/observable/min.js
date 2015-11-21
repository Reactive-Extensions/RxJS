'use strict';

var minBy = require('./minby');
var firstOnly = require('./_firstonly');
var identity = require('../helpers/identity');

module.exports = function min (source, comparer) {
  return minBy(source, identity, comparer).map(firstOnly);
};
