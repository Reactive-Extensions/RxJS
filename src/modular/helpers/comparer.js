'use strict';

module.exports = function comparer (x, y) {
  if (x > y) { return 1; }
  if (y > x) { return -1; }
  return 0;
};
