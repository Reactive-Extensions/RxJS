'use strict';

function SerialDisposable() {
  this.isDisposed = false;
  this.current = null;
};

SerialDisposable.prototype.getDisposable = function () {
  return this.current;
};

SerialDisposable.prototype.setDisposable = function (value) {
  var shouldDispose = this.isDisposed;
  if (!shouldDispose) {
    var old = this.current;
    this.current = value;
  }
  old && old.dispose();
  shouldDispose && value && value.dispose();
};

SerialDisposable.prototype.dispose = function () {
  if (!this.isDisposed) {
    this.isDisposed = true;
    var old = this.current;
    this.current = null;
  }
  old && old.dispose();
};

module.exports = SerialDisposable;
