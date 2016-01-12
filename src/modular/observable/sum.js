'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var bindCallback = require('../internal/bindcallback');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var inherits = require('inherits');

function SumObserver(o, fn, s) {
  this._o = o;
  this._fn = fn;
  this._s = s;
  this._i = 0;
  this._c = 0;
  AbstractObserver.call(this);
}

inherits(SumObserver, AbstractObserver);

SumObserver.prototype.next = function (x) {
  if (this._fn) {
    var result = tryCatch(this._fn)(x, this._i++, this._s);
    if (result === global.Rx.errorObj) { return this._o.onError(result.e); }
    this._c += result;
  } else {
    this._c += x;
  }
};
SumObserver.prototype.error = function (e) { this._o.onError(e); };
SumObserver.prototype.completed = function () {
  this._o.onNext(this._c);
  this._o.onCompleted();
};

function SumObservable(source, fn) {
  this.source = source;
  this._fn = fn;
  ObservableBase.call(this);
}

inherits(SumObservable, ObservableBase);

SumObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new SumObserver(o, this._fn, this.source));
};

module.exports = function sum (source, keySelector, thisArg) {
  var fn = bindCallback(keySelector, thisArg, 3);
  return new SumObservable(source, fn);
};
