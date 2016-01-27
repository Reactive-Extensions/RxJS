'use strict';

var Pattern = require('../joins/pattern');

module.exports = function and (left, right) {
  return new Pattern([left, right]);
};
