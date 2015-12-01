'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var inherits = require('util').inherits;

function ToMapObserver(o, k, e) {
  this._o = o;
  this._k = k;
  this._e = e;
  this._m = new global.Map();
  AbstractObserver.call(this);
}

inherits(ToMapObserver, AbstractObserver);

ToMapObserver.prototype.next = function (x) {
  var key = tryCatch(this._k)(x);
  if (key === global.Rx.errorObj) { return this._o.onError(key.e); }
  var elem = x;
  if (this._e) {
    elem = tryCatch(this._e)(x);
    if (elem === global.Rx.errorObj) { return this._o.onError(elem.e); }
  }

  this._m.set(key, elem);
};

ToMapObserver.prototype.error = function (e) {
  this._o.onError(e);
};

ToMapObserver.prototype.completed = function () {
  this._o.onNext(this._m);
  this._o.onCompleted();
};

function ToMapObservable(source, k, e) {
  this.source = source;
  this._k = k;
  this._e = e;
  ObservableBase.call(this);
}

inherits(ToMapObservable, ObservableBase);

ToMapObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new ToMapObserver(o, this._k, this._e));
};

module.exports = function toMap(source, keySelector, elementSelector) {
  if (typeof global.Map === 'undefined') { throw new TypeError(); }
  return new ToMapObservable(source, keySelector, elementSelector);
};
