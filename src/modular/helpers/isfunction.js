'use strict';

module.exports = (function () {
  var isFn = function (value) {
    return typeof value === 'function' || false;
  };

  // fallback for older versions of Chrome and Safari
  if (isFn(/x/)) {
    isFn = function(value) {
      return typeof value === 'function' &&
        Object.prototype.toString.call(value) === '[object Function]';
    };
  }
  return isFn;
}());
