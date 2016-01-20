'use strict';

var fromArray = require('./fromarray');

/**
*  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
* @param {Scheduler} scheduler A scheduler to use for scheduling the arguments.
* @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
*/
module.exports = function ofscheduled() {
  var len = arguments.length, args = new Array(len - 1), scheduler = arguments[0];
  for(var i = 1; i < len; i++) { args[i - 1] = arguments[i]; }
  return fromArray(args, scheduler);
};
