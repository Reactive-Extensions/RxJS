'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var bindCallback = require('../internal/bindcallback');
var isFunction = require('../helpers/isfunction');
var inherits = require('util').inherits;
var tryCatchUtils = require('../internal/trycatchutils');
var tryCatch = tryCatchUtils.tryCatch;

function MapObserver(o, selector, source) {
  this._o = o;
  this._fn = selector;
  this._s = source;
  this._i = 0;
  AbstractObserver.call(this);
}

inherits(MapObserver, AbstractObserver);

MapObserver.prototype.next = function(x) {
  var result = tryCatch(this._fn)(x, this._i++, this._s);
  if (result === global.Rx.errorObj) { return this._o.onError(result.e); }
  this._o.onNext(result);
};

MapObserver.prototype.error = function (e) {
  this._o.onError(e);
};

MapObserver.prototype.completed = function () {
  this._o.onCompleted();
};

function MapObservable(source, fn, thisArg) {
  this.source = source;
  this._fn = bindCallback(fn, thisArg, 3);
  ObservableBase.call(this);
}

inherits(MapObservable, ObservableBase);

function innerMap(fn, self) {
  return function (x, i, o) { return fn.call(this, self._fn(x, i, o), i, o); };
}

MapObservable.prototype.internalMap = function (fn, thisArg) {
  return new MapObservable(this.source, innerMap(fn, this), thisArg);
};

MapObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new MapObserver(o, this._fn, this));
};

module.exports = function map (source, fn, thisArg) {
  var thisFn = isFunction(fn) ? fn : function () { return fn; };
  return source instanceof MapObservable ?
    source.internalMap(thisFn, thisArg) :
    new MapObservable(source, thisFn, thisArg);
};
