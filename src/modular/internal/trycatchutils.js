'use strict';

var isFunction = require('../helpers/isfunction');

global._Rx || (global._Rx = {});
var errorObj = global._Rx.errorObj = {e: {}};

function tryCatcherGen(tryCatchTarget) {
  return function tryCatcher() {
    try {
      return tryCatchTarget.apply(this, arguments);
    } catch (e) {
      errorObj.e = e;
      return errorObj;
    }
  };
}

function tryCatch(fn) {
  if (!isFunction(fn)) { throw new TypeError('fn must be a function'); }
  return tryCatcherGen(fn);
}

function thrower(e) {
  throw e;
}

module.exports = {
  tryCatch: tryCatch,
  thrower: thrower
};
