'use strict';

var noop = require('./helpers/noop');
var defaultError = require('./helpers/defaulterror');
var AnonymousObserver = require('./observer/anonymousobserver');

/**
 * Supports push-style iteration over an observable sequence.
 */
function Observer () { }

/**
 *  Creates an observer from the specified OnNext, along with optional OnError, and OnCompleted actions.
 * @param {Function} [onNext] Observer's OnNext action implementation.
 * @param {Function} [onError] Observer's OnError action implementation.
 * @param {Function} [onCompleted] Observer's OnCompleted action implementation.
 * @returns {Observer} The observer object implemented using the given actions.
 */
Observer.create = function (onNext, onError, onCompleted) {
  onNext || (onNext = noop);
  onError || (onError = defaultError);
  onCompleted || (onCompleted = noop);
  return new AnonymousObserver(onNext, onError, onCompleted);
};

module.exports = Observer;
