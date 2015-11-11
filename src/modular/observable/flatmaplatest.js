'use strict';

var FlatMapObservable = require('./flatmapobservable');
var switchLatest = require('./switch');

module.exports = function flatMapLatest (source, selector, resultSelector, thisArg) {
  return switchLatest(new FlatMapObservable(source, selector, resultSelector, thisArg));
};
