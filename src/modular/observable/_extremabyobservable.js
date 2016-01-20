'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var inherits = require('inherits');

function ExtremaByObserver(o, k, c) {
  this._o = o;
  this._k = k;
  this._c = c;
  this._v = null;
  this._hv = false;
  this._l = [];
  AbstractObserver.call(this);
}

inherits(ExtremaByObserver, AbstractObserver);

ExtremaByObserver.prototype.next = function (x) {
  var key = tryCatch(this._k)(x);
  if (key === global._Rx.errorObj) { return this._o.onError(key.e); }
  var comparison = 0;
  if (!this._hv) {
    this._hv = true;
    this._v = key;
  } else {
    comparison = tryCatch(this._c)(key, this._v);
    if (comparison === global._Rx.errorObj) { return this._o.onError(comparison.e); }
  }
  if (comparison > 0) {
    this._v = key;
    this._l = [];
  }
  if (comparison >= 0) { this._l.push(x); }
};

ExtremaByObserver.prototype.error = function (e) { this._o.onError(e); };

ExtremaByObserver.prototype.completed = function () {
  this._o.onNext(this._l);
  this._o.onCompleted();
};

function ExtremaByObservable(source, k, c) {
  this.source = source;
  this._k = k;
  this._c = c;
  ObservableBase.call(this);
}

inherits(ExtremaByObservable, ObservableBase);

ExtremaByObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new ExtremaByObserver(o, this._k, this._c));
};

module.exports = ExtremaByObservable;
