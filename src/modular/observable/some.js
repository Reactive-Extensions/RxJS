'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var bindCallback = require('../internal/bindcallback');
var tryCatchUtils = require('../internal/trycatchutils');
var tryCatch = tryCatchUtils.tryCatch, errorObj = tryCatchUtils.errorObj;
var inherits = require('inherits');

function SomeObserver(o, fn, s) {
  this._o = o;
  this._fn = fn;
  this._s = s;
  this._i = 0;
  AbstractObserver.call(this);
}

inherits(SomeObserver, AbstractObserver);

SomeObserver.prototype.next = function (x) {
  var result = tryCatch(this._fn)(x, this._i++, this._s);
  if (result === errorObj) { return this._o.onError(result.e); }
  if (Boolean(result)) {
    this._o.onNext(true);
    this._o.onCompleted();
  }
};
SomeObserver.prototype.error = function (e) { this._o.onError(e); };
SomeObserver.prototype.completed = function () {
  this._o.onNext(false);
  this._o.onCompleted();
};

function SomeObservable(source, fn) {
  this.source = source;
  this._fn = fn;
  ObservableBase.call(this);
}

inherits(SomeObservable, ObservableBase);

SomeObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new SomeObserver(o, this._fn, this.source));
};

module.exports = function some (source, predicate, thisArg) {
  var fn = bindCallback(predicate, thisArg, 3);
  return new SomeObservable(source, fn);
};
