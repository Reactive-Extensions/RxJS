'use strict';

function ObserverBase() {
  this._stopped = false;
}

ObserverBase.prototype.next = function (x) {
  !this._stopped && this._next(x);
};

ObserverBase.prototype._next = function (x) { };

ObserverBase.prototype.error = function (e) {
  if (!this._stopped) {
    this._stopped = true;
    this._error(e);
  }
};

ObserverBase.prototype._error = function (e) { };

ObserverBase.prototype.complete = function () {
  if (!this._stopped) {
    this._stopped = true;
    this._complete();
  }
};

ObserverBase.prototype._complete = function () { };

ObserverBase.prototype.dispose = ObserverBase.prototype.unsubscribe = function () {
  this._stopped = true;
};

ObserverBase.prototype.fail = function (e) {
  if (!this._stopped) {
    this._stopped = true;
    this._error(e);
    return true;
  }
  return false;
};

module.exports = ObserverBase;