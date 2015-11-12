'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractObserver');
var inherits = require('util').inherits;
var tryCatch = require('../internal/trycatchutils').tryCatch;
var EmptyError = require('../internal/errors').EmptyError;

function ReduceObserver(o, parent) {
  this._o = o;
  this._p = parent;
  this._fn = parent.accumulator;
  this._hs = parent.hasSeed;
  this._s = parent.seed;
  this._ha = false;
  this._a = null;
  this._hv = false;
  this._i = 0;
  AbstractObserver.call(this);
}

inherits(ReduceObserver, AbstractObserver);

ReduceObserver.prototype.next = function (x) {
  !this._hv && (this._hv = true);
  if (this._ha) {
    this._a = tryCatch(this._fn)(this._a, x, this._i, this._p);
  } else {
    this._a = this._hs ? tryCatch(this._fn)(this._s, x, this._i, this._p) : x;
    this._ha = true;
  }
  if (this._a === global.Rx.errorObj) { return this._o.onError(this._a.e); }
  this._i++;
};

ReduceObserver.prototype.error = function (e) { this._o.onError(e); };

ReduceObserver.prototype.completed = function () {
  this._hv && this._o.onNext(this._a);
  !this._hv && this._hs && this._o.onNext(this._s);
  !this._hv && !this._hs && this._o.onError(new EmptyError());
  this._o.onCompleted();
};

function ReduceObservable(source, accumulator, hasSeed, seed) {
  this.source = source;
  this.accumulator = accumulator;
  this.hasSeed = hasSeed;
  this.seed = seed;
  ObservableBase.call(this);
}

inherits(ReduceObservable, ObservableBase);

ReduceObservable.prototype.subscribeCore = function(observer) {
  return this.source.subscribe(new ReduceObserver(observer,this));
};

/**
* Applies an accumulator function over an observable sequence, returning the result of the aggregation as a single element in the result sequence. The specified seed value is used as the initial accumulator value.
* For aggregation behavior with incremental intermediate results, see Observable.scan.
* @param {Function} accumulator An accumulator function to be invoked on each element.
* @param {Any} [seed] The initial accumulator value.
* @returns {Observable} An observable sequence containing a single element with the final accumulator value.
*/
module.exports = function reduce () {
  var hasSeed = false, seed, source = arguments[0], accumulator = arguments[1];
  if (arguments.length === 3) {
    hasSeed = true;
    seed = arguments[2];
  }
  return new ReduceObservable(source, accumulator, hasSeed, seed);
};
