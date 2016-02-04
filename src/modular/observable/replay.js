'use strict';

var multicast = require('./multicast');
var ReplaySubject = require('../replaysubject');
var isFunction = require('../helpers/isfunction');

module.exports = function replay (source, selector, bufferSize, windowSize, scheduler) {
  return isFunction(selector) ?
    multicast(source, function () { return new ReplaySubject(bufferSize, windowSize, scheduler); }, selector) :
    multicast(source, new ReplaySubject(bufferSize, windowSize, scheduler));
};
