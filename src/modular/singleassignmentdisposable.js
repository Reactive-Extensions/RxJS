'use strict';

function SingleAssignmentDisposable () {
  this.isDisposed = false;
  this._current = null;
}

SingleAssignmentDisposable.prototype.getDisposable = function () {
  return this._current;
};

SingleAssignmentDisposable.prototype.setDisposable = function (value) {
  if (this._current) { throw new Error('Disposable has already been assigned'); }
  var shouldDispose = this.isDisposed;
  !shouldDispose && (this._current = value);
  shouldDispose && value && value.dispose();
};

SingleAssignmentDisposable.prototype.dispose = function () {
  if (!this.isDisposed) {
    this.isDisposed = true;
    var old = this._current;
    this._current = null;
    old && old.dispose();
  }
};

module.exports = SingleAssignmentDisposable;
