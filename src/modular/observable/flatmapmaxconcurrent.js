'use strict';

var FlatMapObservable = require('./flatmapobservable');
var mergeConcat = require('./mergeconcat');

module.exports = function flatMapLatest (source, limit, selector, resultSelector, thisArg) {
  return mergeConcat(new FlatMapObservable(source, selector, resultSelector, thisArg), limit);
};
