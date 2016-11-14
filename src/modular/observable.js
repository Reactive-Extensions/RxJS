'use strict';

var create = require('./observer/create');
var isFunction = require('./helpers/isfunction');

function Observable() { }

/**
* Determines whether the given object is an Observable
* @param {Any} An object to determine whether it is an Observable
* @returns {Boolean} true if an Observable, else false.
*/
Observable.isObservable = function (o) {
  return o && isFunction(o.subscribe);
};

/**
 *  Subscribes an o to the observable sequence.
 *  @param {Mixed} [oOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
 *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
 *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
 *  @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
 */
Observable.prototype.subscribe = function (oOrOnNext, onError, onCompleted) {
  return this._subscribe(typeof oOrOnNext === 'object' ?
    oOrOnNext :
    create(oOrOnNext, onError, onCompleted));
};

/**
 * Subscribes to the next value in the sequence with an optional "this" argument.
 * @param {Function} onNext The function to invoke on each element in the observable sequence.
 * @param {Any} [thisArg] Object to use as this when executing callback.
 * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
 */
Observable.prototype.subscribeOnNext = function (onNext, thisArg) {
  return this._subscribe(create(typeof thisArg !== 'undefined' ? function(x) { onNext.call(thisArg, x); } : onNext));
};

/**
 * Subscribes to an exceptional condition in the sequence with an optional "this" argument.
 * @param {Function} onError The function to invoke upon exceptional termination of the observable sequence.
 * @param {Any} [thisArg] Object to use as this when executing callback.
 * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
 */
Observable.prototype.subscribeOnError = function (onError, thisArg) {
  return this._subscribe(create(null, typeof thisArg !== 'undefined' ? function(e) { onError.call(thisArg, e); } : onError));
};

/**
 * Subscribes to the next value in the sequence with an optional "this" argument.
 * @param {Function} onCompleted The function to invoke upon graceful termination of the observable sequence.
 * @param {Any} [thisArg] Object to use as this when executing callback.
 * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
 */
Observable.prototype.subscribeOnCompleted = function (onCompleted, thisArg) {
  return this._subscribe(create(null, null, typeof thisArg !== 'undefined' ? function() { onCompleted.call(thisArg); } : onCompleted));
};

Observable.addToObject = function (operators) {
  Object.keys(operators).forEach(function (operator) {
    Observable[operator] = operators[operator];
  });
};

Observable.addToPrototype = function (operators) {
  Object.keys(operators).forEach(function (operator) {
    Observable.prototype[operator] = function () {
      var args = [this];
      args.push.apply(args, arguments);
      return operators[operator].apply(null, args);
    };
  });
};

module.exports = Observable;
