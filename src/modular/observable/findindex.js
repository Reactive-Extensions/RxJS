'use strict';

var FindValueObservable = require('./_findvalueobservable');

module.exports = function findIndex (source, predicate, thisArg) {
  return new FindValueObservable(source, predicate, thisArg, true);
};
