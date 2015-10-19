'use strict';

function BinaryDisposable(first, second) {
  this._first = first;
  this._second = second;
  this.isDisposed = false;
}

BinaryDisposable.prototype.dispose = function () {
  if (!this.isDisposed) {
    this.isDisposed = true;
    var old1 = this._first;
    this._first = null;
    old1 && old1.dispose();
    var old2 = this._second;
    this._second = null;
    old2 && old2.dispose();
  }
};

module.exports = BinaryDisposable;
