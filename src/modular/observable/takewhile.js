'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var bindCallback = require('../internal/bindcallback');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var inherits = require('inherits');

function TakeWhileObserver(o, p) {
  this._o = o;
  this._p = p;
  this._i = 0;
  this._r = true;
  AbstractObserver.call(this);
}

inherits(TakeWhileObserver, AbstractObserver);

TakeWhileObserver.prototype.next = function (x) {
  if (this._r) {
    this._r = tryCatch(this._p._fn)(x, this._i++, this._p);
    if (this._r === global._Rx.errorObj) { return this._o.onError(this._r.e); }
  }
  if (this._r) {
    this._o.onNext(x);
  } else {
    this._o.onCompleted();
  }
};
TakeWhileObserver.prototype.error = function (e) { this._o.onError(e); };
TakeWhileObserver.prototype.completed = function () { this._o.onCompleted(); };

function TakeWhileObservable(source, fn) {
  this.source = source;
  this._fn = fn;
  ObservableBase.call(this);
}

inherits(TakeWhileObservable, ObservableBase);

TakeWhileObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new TakeWhileObserver(o, this));
};

module.exports = function takeWhile (source, predicate, thisArg) {
  var fn = bindCallback(predicate, thisArg, 3);
  return new TakeWhileObservable(source, fn);
};
