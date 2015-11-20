'use strict';

var ExtremaByObservable = require('./_extremabyobservable');

function defaultComparer (x, y) {
  return x > y ? 1 : y > x ? -1 : 0;
}

module.exports = function maxBy (source, keySelector, comparer) {
  comparer || (comparer = defaultComparer);
  return new ExtremaByObservable(source, keySelector, comparer);
};
