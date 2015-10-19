'use strict';

/**
 *  Creates a notification callback from an observer.
 * @returns The action that forwards its input notification to the underlying observer.
 */
module.exports = function (observer) {
  return function (n) { return n.accept(observer); };
};
