'use strict';

var noop = require('../internal/noop');
var isFunction = require('../internal/isfunction');
var ObjectDisposedError = require('../internal/errors').ObjectDisposedError;

/**
 * Provides a set of static methods for creating Disposables.
 * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
 */
function Disposable (action) {
  this.isDisposed = false;
  this.action = action || noop;
}

/** Performs the task of cleaning up resources. */
Disposable.prototype.dispose = Disposable.prototype.unsubscribe = function () {
  if (!this.isDisposed) {
    this.action();
    this.isDisposed = true;
  }
};

/**
 * Creates a disposable object that invokes the specified action when disposed.
 * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
 * @return {Disposable} The disposable object that runs the given action upon disposal.
 */
Disposable.create = function (action) { return new Disposable(action); };

/**
 * Gets the disposable that does nothing when disposed.
 */
Disposable.empty = { dispose: noop };

/**
 * Validates whether the given object is a disposable
 * @param {Object} Object to test whether it has a dispose method
 * @returns {Boolean} true if a disposable object, else false.
 */
Disposable.isDisposable = function (d) {
  return d && isFunction(d.dispose);
};

Disposable.checkDisposed = function (disposable) {
  if (disposable.isDisposed) { throw new ObjectDisposedError(); }
};

Disposable._fixup = function (result) {
  return Disposable.isDisposable(result) ? result : Disposable.empty;
};

module.exports = Disposable;
