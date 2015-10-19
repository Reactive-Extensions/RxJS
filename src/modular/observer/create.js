'use strict';

var noop = require('../helpers/noop');
var AnonymousObserver = require('./anonymousobserver');

function throwError(e) { throw e; }

/**
 *  Creates an observer from the specified OnNext, along with optional OnError, and OnCompleted actions.
 * @param {Function} [onNext] Observer's OnNext action implementation.
 * @param {Function} [onError] Observer's OnError action implementation.
 * @param {Function} [onCompleted] Observer's OnCompleted action implementation.
 * @returns {Observer} The observer object implemented using the given actions.
 */
module.exports = function (onNext, onError, onCompleted) {
  return new AnonymousObserver(onNext || noop, onError || throwError, onCompleted || noop);
};
