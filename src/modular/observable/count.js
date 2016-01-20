'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var bindCallback = require('../internal/bindcallback');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var inherits = require('inherits');

function CountObserver(o, fn, s) {
  this._o = o;
  this._fn = fn;
  this._s = s;
  this._i = 0;
  this._c = 0;
  AbstractObserver.call(this);
}

inherits(CountObserver, AbstractObserver);

CountObserver.prototype.next = function (x) {
  if (this._fn) {
    var result = tryCatch(this._fn)(x, this._i++, this._s);
    if (result === global._Rx.errorObj) { return this._o.onError(result.e); }
    Boolean(result) && (this._c++);
  } else {
    this._c++;
  }
};
CountObserver.prototype.error = function (e) { this._o.onError(e); };
CountObserver.prototype.completed = function () {
  this._o.onNext(this._c);
  this._o.onCompleted();
};

function CountObservable(source, fn) {
  this.source = source;
  this._fn = fn;
  ObservableBase.call(this);
}

inherits(CountObservable, ObservableBase);

CountObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new CountObserver(o, this._fn, this.source));
};

module.exports = function count (source, predicate, thisArg) {
  var fn = bindCallback(predicate, thisArg, 3);
  return new CountObservable(source, fn);
};
