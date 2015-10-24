'use strict';

var fromArray = require('./fromarray');

module.exports = function () {
  var len = arguments.length, args = new Array(len);
  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
  return fromArray(args);
};
