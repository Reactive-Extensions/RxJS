'use strict';

var FlatMapObservable = require('./flatmapobservable');
var switchFirst = require('./switchfirst');

module.exports = function flatMapFirst(source, selector, resultSelector, thisArg) {
  return switchFirst(new FlatMapObservable(source, selector, resultSelector, thisArg));
};
