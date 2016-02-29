'use strict';

var fromPromise = require('./frompromise');
var throwError = require('./throw');
var tryCatchUtils = require('../internal/trycatchutils');
var tryCatch = tryCatchUtils.tryCatch, errorObj = tryCatchUtils.errorObj;

module.exports = function startAsync(functionAsync) {
  var promise = tryCatch(functionAsync)();
  if (promise === errorObj) { return throwError(promise.e); }
  return fromPromise(promise);
};
