'use strict';

module.exports = function addProperties() {
  var obj = arguments[0];
  for(var sources = [], i = 1, len = arguments.length; i < len; i++) { sources.push(arguments[i]); }
  for (var idx = 0, ln = sources.length; idx < ln; idx++) {
    var source = sources[idx];
    for (var prop in source) {
      obj[prop] = source[prop];
    }
  }
};
