'use strict';

var ObservableBase = require('../observable/observablebase');
var BinaryDisposable = require('../binarydisposable');
var inherits = require('util').inherits;

function AddRefObservable(xs, r) {
  this._xs = xs;
  this._r = r;
  ObservableBase.call(this);
}

inherits(AddRefObservable, ObservableBase);

AddRefObservable.prototype.subscribeCore = function (o) {
  return new BinaryDisposable(this._r.getDisposable(), this._xs.subscribe(o));
};

module.exports = function addRef (xs, r) {
  return new AddRefObservable(xs, r);
};
