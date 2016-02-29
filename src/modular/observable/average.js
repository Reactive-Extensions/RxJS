'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var EmptyError = require('../internal/errors').EmptyError;
var isFunction = require('../helpers/isfunction');
var bindCallback = require('../internal/bindcallback');
var tryCatchUtils = require('../internal/trycatchutils');
var tryCatch = tryCatchUtils.tryCatch, errorObj = tryCatchUtils.errorObj;
var inherits = require('inherits');


function AverageObserver(o, fn, s) {
  this._o = o;
  this._fn = fn;
  this._s = s;
  this._c = 0;
  this._t = 0;
  AbstractObserver.call(this);
}

inherits(AverageObserver, AbstractObserver);

AverageObserver.prototype.next = function (x) {
  if(this._fn) {
    var r = tryCatch(this._fn)(x, this._c++, this._s);
    if (r === errorObj) { return this._o.onError(r.e); }
    this._t += r;
  } else {
    this._c++;
    this._t += x;
  }
};
AverageObserver.prototype.error = function (e) { this._o.onError(e); };
AverageObserver.prototype.completed = function () {
  if (this._c === 0) { return this._o.onError(new EmptyError()); }
  this._o.onNext(this._t / this._c);
  this._o.onCompleted();
};

function AverageObservable(source, fn) {
  this.source = source;
  this._fn = fn;
  ObservableBase.call(this);
}

inherits(AverageObservable, ObservableBase);

AverageObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new AverageObserver(o, this._fn, this.source));
};

/**
 * Computes the average of an observable sequence of values that are in the sequence or obtained by invoking a transform function on each element of the input sequence if present.
 * @param {Function} [selector] A transform function to apply to each element.
 * @param {Any} [thisArg] Object to use as this when executing callback.
 * @returns {Observable} An observable sequence containing a single element with the average of the sequence of values.
 */
module.exports = function average (source, keySelector, thisArg) {
  var fn;
  isFunction(keySelector) && (fn = bindCallback(keySelector, thisArg, 3));
  return new AverageObservable(source, fn);
};
