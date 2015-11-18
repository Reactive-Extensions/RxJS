'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var isFunction = require('../helpers/isfunction');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var isEqual = require('../internal/isequal');
var inherits = require('util').inherits;

function arrayIndexOfComparer(array, item, comparer) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (comparer(array[i], item)) { return i; }
  }
  return -1;
}

function HashSet(cmp) {
  this._cmp = cmp;
  this._set = [];
}

HashSet.prototype.push = function(v) {
  var retValue = arrayIndexOfComparer(this._set, v, this._cmp) === -1;
  retValue && this._set.push(v);
  return retValue;
};

function DistinctObserver(o, keyFn, cmpFn) {
  this._o = o;
  this._keyFn = keyFn;
  this._h = new HashSet(cmpFn);
  AbstractObserver.call(this);
}

inherits(DistinctObserver, AbstractObserver);

DistinctObserver.prototype.next = function (x) {
  var key = x;
  if (isFunction(this._keyFn)) {
    key = tryCatch(this._keyFn)(x);
    if (key === global.Rx.errorObj) { return this._o.onError(key.e); }
  }
  this._h.push(key) && this._o.onNext(x);
};

DistinctObserver.prototype.error = function (e) { this._o.onError(e); };
DistinctObserver.prototype.completed = function () { this._o.onCompleted(); };

function DistinctObservable(source, keyFn, cmpFn) {
  this.source = source;
  this._keyFn = keyFn;
  this._cmpFn = cmpFn;
  ObservableBase.call(this);
}

inherits(DistinctObservable, ObservableBase);

DistinctObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new DistinctObserver(o, this._keyFn, this._cmpFn));
};

module.exports = function distinct (source, keySelector, comparer) {
  comparer || (comparer = isEqual);
  return new DistinctObservable(source, keySelector, comparer);
};
