'use strict';

var Disposable = require('./disposable');

function InnerDisposable(disposable) {
  this.disposable = disposable;
  this.disposable.count++;
  this.isInnerDisposed = false;
}

InnerDisposable.prototype.dispose = function () {
  if (!this.disposable.isDisposed && !this.isInnerDisposed) {
    this.isInnerDisposed = true;
    this.disposable.count--;
    if (this.disposable.count === 0 && this.disposable.isPrimaryDisposed) {
      this.disposable.isDisposed = true;
      this.disposable.underlyingDisposable.dispose();
    }
  }
};

/**
 * Represents a disposable resource that only disposes its underlying disposable resource when all dependent disposable objects have been disposed.
 */
function RefCountDisposable(disposable) {
  this.underlyingDisposable = disposable;
  this.isDisposed = false;
  this.isPrimaryDisposed = false;
  this.count = 0;
}

/**
 * Disposes the underlying disposable only when all dependent disposables have been disposed
 */
RefCountDisposable.prototype.dispose = function () {
  if (!this.isDisposed && !this.isPrimaryDisposed) {
    this.isPrimaryDisposed = true;
    if (this.count === 0) {
      this.isDisposed = true;
      this.underlyingDisposable.dispose();
    }
  }
};

/**
 * Returns a dependent disposable that when disposed decreases the refcount on the underlying disposable.
 * @returns {Disposable} A dependent disposable contributing to the reference count that manages the underlying disposable's lifetime.
 */
RefCountDisposable.prototype.getDisposable = function () {
  return this.isDisposed ? Disposable.empty : new InnerDisposable(this);
};

module.exports = RefCountDisposable;
