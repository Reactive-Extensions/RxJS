'use strict';

var FlatMapObservable = require('./flatmapobservable');
var mergeAll = require('./mergeall');

module.exports = function flatMap (source, selector, resultSelector, thisArg) {
  var obs = new FlatMapObservable(source, selector, resultSelector, thisArg);
  return mergeAll(obs);
};
