'use strict';

var ExtremaByObservable = require('./_extremabyobservable');

function defaultComparer (x, y) {
  return x > y ? 1 : y > x ? -1 : 0;
}

function minByFn(comparer) {
  return function (x, y) { return comparer(x, y) * -1; };
}

module.exports = function minBy (source, keySelector, comparer) {
  comparer || (comparer = defaultComparer);
  return new ExtremaByObservable(source, keySelector, minByFn(comparer));
};
