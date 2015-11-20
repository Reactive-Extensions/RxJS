'use strict';

var filter = require('./filter');
var bindCallback = require('../internal/bindcallback');

module.exports = function partition (source, predicate, thisArg) {
  var fn = bindCallback(predicate, thisArg, 3);
  return [
    filter(source, predicate, thisArg),
    filter(source, function (x, i, o) { return !fn(x, i, o); })
  ];
};
