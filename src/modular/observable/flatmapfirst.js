'use strict';

var FlatMapObservable = require('./flatmapobservable');
var switchFirst = require('./switchfirst');

module.exports = function flatMapFirst(selector, resultSelector, thisArg) {
  return switchFirst(new FlatMapObservable(this, selector, resultSelector, thisArg));
};
