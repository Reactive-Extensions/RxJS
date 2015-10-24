'use strict';

function InnerSubscription(s, o) {
  this._s = s;
  this._o = o;
}

InnerSubscription.prototype.dispose = function () {
  if (!this._s.isDisposed && this._o !== null) {
    var idx = this._s.observers.indexOf(this._o);
    this._s.observers.splice(idx, 1);
    this._o = null;
  }
};

module.exports = InnerSubscription;
