'use strict';

var multicast = require('./multicast');
var BehaviorSubject = require('../behaviorsubject');

function createBehaviorSubject(initialValue) {
  return function fn() { return new BehaviorSubject(initialValue); };
}

module.exports = function publishValue() {
  var source = arguments[0];
  if (arguments.length === 3) {
    return multicast(source, createBehaviorSubject(arguments[2]), arguments[1]);
  } else if (arguments.length === 2) {
    return multicast(source, new BehaviorSubject(arguments[1]));
  } else {
    throw new Error('Invalid arguments');
  }
};
