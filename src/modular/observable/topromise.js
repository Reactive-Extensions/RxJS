'use strict';

module.exports = function toPromise(source, promiseCtor) {
  promiseCtor || (promiseCtor = global.Promise);
  return new promiseCtor(function (resolve, reject) {
    // No cancellation can be done
    var value;
    source.subscribe(function (v) {
      value = v;
    }, reject, function () {
      resolve(value);
    });
  });
};
