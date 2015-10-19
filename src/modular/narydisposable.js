'use strict';

function NAryDisposable(disposables) {
  this._disposables = disposables;
  this.isDisposed = false;
}

NAryDisposable.prototype.dispose = function () {
  if (!this.isDisposed) {
    this.isDisposed = true;
    for (var i = 0, len = this._disposables.length; i < len; i++) {
      this._disposables[i].dispose();
    }
    this._disposables.length = 0;
  }
};

module.exports = NAryDisposable;
