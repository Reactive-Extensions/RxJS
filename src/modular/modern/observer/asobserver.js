'use strict';

var AnonymousObserver = require('./anonymousobserver');

/**
 *  Hides the identity of an observer.
 * @returns An observer that hides the identity of the specified observer.
 */
module.exports = function (observer) {
  return new AnonymousObserver(
    function (x) { observer.onNext(x); },
    function (err) { observer.onError(err); },
    function () { observer.onCompleted(); });
};
