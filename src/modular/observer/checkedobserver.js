'use strict';

var Observer = require('../observer');
var tryCatchUtils = require('../internal/trycatchutils');
var tryCatch = tryCatchUtils.tryCatch, thrower = tryCatchUtils.thrower;

function CheckedObserver(observer) {
  Observer.call(this);
  this._observer = observer;
  this._state = 0; // 0 - idle, 1 - busy, 2 - done
}
CheckedObserver.prototype.onNext = function (value) {
  this.checkAccess();
  var res = tryCatch(this._observer.onNext).call(this._observer, value);
  this._state = 0;
  res === global._Rx.errorObj && thrower(res.e);
};

CheckedObserver.prototype.onError = function (err) {
  this.checkAccess();
  var res = tryCatch(this._observer.onError).call(this._observer, err);
  this._state = 2;
  res === global._Rx.errorObj && thrower(res.e);
};

CheckedObserver.prototype.onCompleted = function () {
  this.checkAccess();
  var res = tryCatch(this._observer.onCompleted).call(this._observer);
  this._state = 2;
  res === global._Rx.errorObj && thrower(res.e);
};

CheckedObserver.prototype.checkAccess = function () {
  if (this._state === 1) { throw new Error('Re-entrancy detected'); }
  if (this._state === 2) { throw new Error('Observer completed'); }
  if (this._state === 0) { this._state = 1; }
};

module.exports = CheckedObserver;
