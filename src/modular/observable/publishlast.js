'use strict';

var AsyncSubject = require('../asyncsubject');
var multicast = require('./multicast');
var isFunction = require('../helpers/isfunction');

module.exports = function publishLast (source, selector) {
  return isFunction(selector) ?
    multicast(source, function () { return new AsyncSubject(); }, selector) :
    multicast(source, new AsyncSubject());
};
