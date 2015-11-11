'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var isFunction = require('../helpers/isfunction');
var isEqual = require('../internal/isequal');
var inherits = require('util').inherits;
var tryCatch = require('../internal/trycatchutils').tryCatch;

function DistinctUntilChangedObserver(o, fn, cmp) {
  this._o = o;
  this._fn = fn;
  this._cmp = cmp;
  this._hk = false;
  this._k = null;
  AbstractObserver.call(this);
}

inherits(DistinctUntilChangedObserver, AbstractObserver);

DistinctUntilChangedObserver.prototype.next = function (x) {
  var key = x, comparerEquals;
  if (isFunction(this._fn)) {
    key = tryCatch(this._fn)(x);
    if (key === global.Rx.errorObj) { return this._o.onError(key.e); }
  }
  if (this._hk) {
    comparerEquals = tryCatch(this._cmp)(this._k, key);
    if (comparerEquals === global.Rx.errorObj) { return this._o.onError(comparerEquals.e); }
  }
  if (!this._hk || !comparerEquals) {
    this._hk = true;
    this._k = key;
    this._o.onNext(x);
  }
};
DistinctUntilChangedObserver.prototype.error = function(e) { this._o.onError(e); };
DistinctUntilChangedObserver.prototype.completed = function () { this._o.onCompleted(); };

function DistinctUntilChangedObservable(source, fn, cmp) {
  this.source = source;
  this._fn = fn;
  this._cmp = cmp;
  ObservableBase.call(this);
}

inherits(DistinctUntilChangedObservable, ObservableBase);

DistinctUntilChangedObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new DistinctUntilChangedObserver(o, this._fn, this._cmp));
};

/**
*  Returns an observable sequence that contains only distinct contiguous elements according to the keyFn and the comparer.
* @param {Function} [keyFn] A function to compute the comparison key for each element. If not provided, it projects the value.
* @param {Function} [comparer] Equality comparer for computed key values. If not provided, defaults to an equality comparer function.
* @returns {Observable} An observable sequence only containing the distinct contiguous elements, based on a computed key value, from the source sequence.
*/
module.exports = function distinctUntilChanged (source, keyFn, comparer) {
  comparer || (comparer = isEqual);
  return new DistinctUntilChangedObservable(source, keyFn, comparer);
};
