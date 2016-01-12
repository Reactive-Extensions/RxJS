'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var bindCallback = require('../internal/bindcallback');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var inherits = require('inherits');

function EveryObserver(o, fn, s) {
  this._o = o;
  this._fn = fn;
  this._s = s;
  this._i = 0;
  AbstractObserver.call(this);
}

inherits(EveryObserver, AbstractObserver);

EveryObserver.prototype.next = function (x) {
  var result = tryCatch(this._fn)(x, this._i++, this._s);
  if (result === global.Rx.errorObj) { return this._o.onError(result.e); }
  if (!Boolean(result)) {
    this._o.onNext(false);
    this._o.onCompleted();
  }
};
EveryObserver.prototype.error = function (e) { this._o.onError(e); };
EveryObserver.prototype.completed = function () {
  this._o.onNext(true);
  this._o.onCompleted();
};

function EveryObservable(source, fn) {
  this.source = source;
  this._fn = fn;
  ObservableBase.call(this);
}

inherits(EveryObservable, ObservableBase);

EveryObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new EveryObserver(o, this._fn, this.source));
};

module.exports = function every (source, predicate, thisArg) {
  var fn = bindCallback(predicate, thisArg, 3);
  return new EveryObservable(source, fn);
};
