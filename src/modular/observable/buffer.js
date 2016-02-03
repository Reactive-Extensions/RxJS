'use strict';

var flatMap = require('./flatmap');
var window = require('./window');

function toArray(x) { return x.toArray(); }

module.exports = function buffer (source, windowOpeningsOrClosingSelector, windowClosingSelector) {
  return flatMap(window(source, windowOpeningsOrClosingSelector, windowClosingSelector), toArray);
};
