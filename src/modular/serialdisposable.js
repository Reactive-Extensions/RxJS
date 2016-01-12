'use strict';

function SerialDisposable() {
  this.isDisposed = false;
  this._current = null;
}

SerialDisposable.prototype.getDisposable = function () {
  return this._current;
};

SerialDisposable.prototype.setDisposable = function (value) {
  var shouldDispose = this.isDisposed;
  if (!shouldDispose) {
    var old = this._current;
    this._current = value;
    old && old.dispose();
  }

  shouldDispose && value && value.dispose();
};

SerialDisposable.prototype.dispose = function () {
  if (!this.isDisposed) {
    this.isDisposed = true;
    var old = this._current;
    this._current = null;
    old && old.dispose();
  }
};

module.exports = SerialDisposable;
