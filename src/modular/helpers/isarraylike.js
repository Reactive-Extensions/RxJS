'use strict'

module.exports = function isArrayLike (o) {
  return o && o.length !== undefined;
};
