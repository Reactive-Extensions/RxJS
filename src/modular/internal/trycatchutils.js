'use strict';

var isFunction = require('../helpers/isfunction');
var errorObj = module.exports.errorObj = {e: {}};

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

module.exports.tryCatch = function tryCatch(fn) {
  if (!isFunction(fn)) { throw new TypeError('fn must be a function'); }
  return tryCatcherGen(fn);
};

module.exports.thrower = function thrower(e) {
  throw e;
};
