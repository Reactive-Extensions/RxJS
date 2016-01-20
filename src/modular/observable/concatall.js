'use strict';

var mergeConcat = require('./mergeconcat');

module.exports = function concatAll (sources) {
  return mergeConcat(sources, 1);
};
