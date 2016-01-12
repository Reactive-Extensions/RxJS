'use strict';

var AbstractObserver = require('./abstractobserver');
var inherits = require('inherits');

/**
 * Creates an observer from the specified OnNext, OnError, and OnCompleted actions.
 * @param {Any} onNext Observer's OnNext action implementation.
 * @param {Any} onError Observer's OnError action implementation.
 * @param {Any} onCompleted Observer's OnCompleted action implementation.
 */
function AnonymousObserver(onNext, onError, onCompleted) {
  AbstractObserver.call(this);
  this._onNext = onNext;
  this._onError = onError;
  this._onCompleted = onCompleted;
}

inherits(AnonymousObserver, AbstractObserver);

/**
 * Calls the onNext action.
 * @param {Any} value Next element in the sequence.
 */
AnonymousObserver.prototype.next = function (value) {
  this._onNext(value);
};

/**
 * Calls the onError action.
 * @param {Any} error The error that has occurred.
 */
AnonymousObserver.prototype.error = function (error) {
  this._onError(error);
};

/**
 *  Calls the onCompleted action.
 */
AnonymousObserver.prototype.completed = function () {
  this._onCompleted();
};

module.exports = AnonymousObserver;
