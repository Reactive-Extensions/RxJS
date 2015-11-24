'use strict';

var FindValueObservable = require('./_findvalueobservable');

module.exports = function find (source, predicate, thisArg) {
  return new FindValueObservable(source, predicate, thisArg, false);
};
