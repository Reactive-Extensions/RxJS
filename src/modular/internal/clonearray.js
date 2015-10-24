'use strict';

module.exports = function cloneArray(arr) {
  var len = arr.length, a = new Array(len);
  for(var i = 0; i < len; i++) { a[i] = arr[i]; }
  return a;
};
