'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var bindCallback = require('../internal/bindcallback');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var inherits = require('inherits');

function SkipWhileObserver(o, p) {
  this._o = o;
  this._p = p;
  this._i = 0;
  this._r = false;
  AbstractObserver.call(this);
}

inherits(SkipWhileObserver, AbstractObserver);

SkipWhileObserver.prototype.next = function (x) {
  if (!this._r) {
    var res = tryCatch(this._p._fn)(x, this._i++, this._p);
    if (res === global.Rx.errorObj) { return this._o.onError(res.e); }
    this._r = !res;
  }
  this._r && this._o.onNext(x);
};
SkipWhileObserver.prototype.error = function (e) { this._o.onError(e); };
SkipWhileObserver.prototype.completed = function () { this._o.onCompleted(); };

function SkipWhileObservable(source, fn) {
  this.source = source;
  this._fn = fn;
  ObservableBase.call(this);
}

inherits(SkipWhileObservable, ObservableBase);

SkipWhileObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new SkipWhileObserver(o, this));
};

module.exports = function skipWhile (source, predicate, thisArg) {
  var fn = bindCallback(predicate, thisArg, 3);
  return new SkipWhileObservable(source, fn);
};
