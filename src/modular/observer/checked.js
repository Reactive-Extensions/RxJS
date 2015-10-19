'use strict';

var CheckedObserver = require('./checkedobserver');

/**
 *  Checks access to the observer for grammar violations. This includes checking for multiple OnError or OnCompleted calls, as well as reentrancy in any of the observer methods.
 *  If a violation is detected, an Error is thrown from the offending observer method call.
 * @returns An observer that checks callbacks invocations against the observer grammar and, if the checks pass, forwards those to the specified observer.
 */
module.exports = function (observer) {
  return new CheckedObserver(observer);
};
