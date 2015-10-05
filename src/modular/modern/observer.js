'use strict';

var noop = require('./helpers/noop');
var throwError = require('./helpers/throwerror');
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
  onError || (onError = throwError);
  onCompleted || (onCompleted = noop);
  return new AnonymousObserver(onNext, onError, onCompleted);
};

Observer.addToObject = function (operators) {
  operators.forEach(function (operator) {
    Observer[operator] = operator[operator];
  });
};

Observer.addToPrototype = function (operators) {
  operators.forEach(function (operator) {
    Observer.prototype[operator] = function () {
      var args = [this];
      args.push.apply(args, arguments);
      return operators[operator].apply(null, args);
    };
  });
};

module.exports = Observer;
