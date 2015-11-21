'use strict';

var maxBy = require('./maxby');
var firstOnly = require('./_firstonly');
var identity = require('../helpers/identity');

module.exports = function max (source, comparer) {
  return maxBy(source, identity, comparer).map(firstOnly);
};
