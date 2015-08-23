var AnonymousObservable = require('../internal/anonymousobservable');

/**
 *  Creates an observable sequence from a specified subscribe method implementation.
 * @param {Function} subscribe Implementation of the resulting observable sequence's subscribe method, returning a function that will be wrapped in a Disposable.
 * @returns {Observable} The observable sequence with the specified implementation for the Subscribe method.
 */
module.exports = function (subscribe, parent) {
  return new AnonymousObservable(subscribe, parent);
};
