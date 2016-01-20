'use strict';

var ObservableBase = require('./observablebase');
var inherits = require('inherits');
var bindCallback = require('../internal/bindcallback');
var tryCatchUtils = require('../internal/trycatchutils');
var tryCatch = tryCatchUtils.tryCatch, thrower = tryCatchUtils.thrower;

function FinallyDisposable(s, fn) {
  this.isDisposed = false;
  this._s = s;
  this._fn = fn;
}

FinallyDisposable.prototype.dispose = function () {
  if (!this.isDisposed) {
    var res = tryCatch(this._s.dispose).call(this._s);
    this._fn();
    res === global._Rx.errorObj && thrower(res.e);
  }
};

function FinallyObservable(source, fn, thisArg) {
  this.source = source;
  this._fn = bindCallback(fn, thisArg, 0);
  ObservableBase.call(this);
}

inherits(FinallyObservable, ObservableBase);

FinallyObservable.prototype.subscribeCore = function (o) {
  var d = tryCatch(this.source.subscribe).call(this.source, o);
  if (d === global._Rx.errorObj) {
    this._fn();
    thrower(d.e);
  }

  return new FinallyDisposable(d, this._fn);
};

/**
 *  Invokes a specified action after the source observable sequence terminates gracefully or exceptionally.
 * @param {Function} finallyAction Action to invoke after the source observable sequence terminates.
 * @returns {Observable} Source sequence with the action-invoking termination behavior applied.
 */
module.exports = function finally_ (source, action, thisArg) {
  return new FinallyObservable(source, action, thisArg);
};
