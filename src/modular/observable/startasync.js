'use strict';

var fromPromise = require('./frompromise');
var throwError = require('./throw');
var tryCatch = require('../internal/trycatchutils').tryCatch;

module.exports = function startAsync(functionAsync) {
  var promise = tryCatch(functionAsync)();
  if (promise === global._Rx.errorObj) { return throwError(promise.e); }
  return fromPromise(promise);
};
