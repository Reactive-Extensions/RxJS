function SingleAssignmentDisposable () {
  this.isDisposed = false;
  this.current = null;
}

SingleAssignmentDisposable.prototype.getDisposable = function () {
  return this.current;
};

SingleAssignmentDisposable.prototype.setDisposable = function (value) {
  if (this.current) { throw new Error('Disposable has already been assigned'); }
  var shouldDispose = this.isDisposed;
  !shouldDispose && (this.current = value);
  shouldDispose && value && value.dispose();
};

SingleAssignmentDisposable.prototype.dispose = function () {
  if (!this.isDisposed) {
    this.isDisposed = true;
    var old = this.current;
    this.current = null;
    old && old.dispose();
  }
};

module.exports = SingleAssignmentDisposable;
