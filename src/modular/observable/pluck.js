'use strict';

var map = require('./map');

function plucker(args, len) {
  return function mapper(x) {
    var currentProp = x;
    for (var i = 0; i < len; i++) {
      var p = currentProp[args[i]];
      if (typeof p !== 'undefined') {
        currentProp = p;
      } else {
        return undefined;
      }
    }
    return currentProp;
  };
}

/**
 * Retrieves the value of a specified nested property from all elements in
 * the Observable sequence.
 * @param {Arguments} arguments The nested properties to pluck.
 * @returns {Observable} Returns a new Observable sequence of property values.
 */
module.exports = function pluck() {
  var len = arguments.length, args = new Array(len);
  if (len === 0) { throw new Error('List of properties cannot be empty.'); }
  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
  var pluckedArgs = args.slice(1);
  return map(args[0], plucker(pluckedArgs, pluckedArgs.length));
};
