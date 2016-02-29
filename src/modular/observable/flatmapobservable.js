'use strict';

var AbstractObserver = require('../observer/abstractobserver');
var ObservableBase = require('./observablebase');
var observableFrom = require('./from');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var isArrayLike = require('../helpers/isarraylike');
var isIterable = require('../helpers/isiterable');
var bindCallback = require('../internal/bindcallback');
var isFunction = require('../helpers/isfunction');
var inherits = require('inherits');
var tryCatchUtils = require('../internal/trycatchutils');
var tryCatch = tryCatchUtils.tryCatch, errorObj = tryCatchUtils.errorObj;

function FlatMapObserver(o, selector, resultSelector, source) {
  this.i = 0;
  this._fn = selector;
  this._resFn = resultSelector;
  this.source = source;
  this._o = o;
  AbstractObserver.call(this);
}

inherits(FlatMapObserver, AbstractObserver);

FlatMapObserver.prototype._wrapResult = function(result, x, i) {
  return isFunction(this._resFn) ?
    result.map(function(y, i2) { return this._resFn(x, y, i, i2); }, this) :
    result;
};

FlatMapObserver.prototype.next = function(x) {
  var i = this.i++;
  var result = tryCatch(this._fn)(x, i, this.source);
  if (result === errorObj) { return this._o.onError(result.e); }

  isPromise(result) && (result = fromPromise(result));
  (isArrayLike(result) || isIterable(result)) && (result = observableFrom(result));
  this._o.onNext(this._wrapResult(result, x, i));
};
FlatMapObserver.prototype.error = function(e) { this._o.onError(e); };
FlatMapObserver.prototype.completed = function() { this._o.onCompleted(); };

function FlatMapObservable(source, fn, resultFn, thisArg) {
  this._resFn = isFunction(resultFn) ? resultFn : null;
  this._fn = bindCallback(isFunction(fn) ? fn : function() { return fn; }, thisArg, 3);
  this.source = source;
  ObservableBase.call(this);
}

inherits(FlatMapObservable, ObservableBase);

FlatMapObservable.prototype.subscribeCore = function(o) {
  return this.source.subscribe(new FlatMapObserver(o, this._fn, this._resFn, this));
};

module.exports = FlatMapObservable;
