'use strict';

var ObservableBase = require('./observablebase');
var Disposable = require('../disposable');
var inherits = require('util').inherits;

function NeverObservable() {
  ObservableBase.call(this);
}

inherits(NeverObservable, ObservableBase);

NeverObservable.prototype.subscribeCore = function () {
  return Disposable.empty;
};

var NEVER_OBSERVABLE = new NeverObservable();

/**
 * Returns a non-terminating observable sequence, which can be used to denote an infinite duration (e.g. when using reactive joins).
 * @returns {Observable} An observable sequence whose observers will never get called.
 */
module.exports = function never () {
  return NEVER_OBSERVABLE;
};
