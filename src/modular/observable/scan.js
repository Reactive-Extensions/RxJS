'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var inherits = require('inherits');
var tryCatch = require('../internal/trycatchutils').tryCatch;

function ScanObserver(o, parent) {
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

inherits(ScanObserver, AbstractObserver);

ScanObserver.prototype.next = function (x) {
  !this._hv && (this._hv = true);
  if (this._ha) {
    this._a = tryCatch(this._fn)(this._a, x, this._i, this._p);
  } else {
    this._a = this._hs ? tryCatch(this._fn)(this._s, x, this._i, this._p) : x;
    this._ha = true;
  }
  if (this._a === global._Rx.errorObj) { return this._o.onError(this._a.e); }
  this._o.onNext(this._a);
  this._i++;
};

ScanObserver.prototype.error = function (e) { this._o.onError(e); };
ScanObserver.prototype.completed = function () {
  !this._hv && this._hs && this._o.onNext(this._s);
  this._o.onCompleted();
};

function ScanObservable(source, accumulator, hasSeed, seed) {
  this.source = source;
  this.accumulator = accumulator;
  this.hasSeed = hasSeed;
  this.seed = seed;
  ObservableBase.call(this);
}

inherits(ScanObservable, ObservableBase);

ScanObservable.prototype.subscribeCore = function(o) {
  return this.source.subscribe(new ScanObserver(o,this));
};

/**
*  Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.
*  For aggregation behavior with no intermediate results, see Observable.aggregate.
* @param {Mixed} [seed] The initial accumulator value.
* @param {Function} accumulator An accumulator function to be invoked on each element.
* @returns {Observable} An observable sequence containing the accumulated values.
*/
module.exports = function scan () {
  var source = arguments[0], hasSeed = false, seed, accumulator = arguments[1];
  if (arguments.length === 3) {
    hasSeed = true;
    seed = arguments[2];
  }
  return new ScanObservable(source, accumulator, hasSeed, seed);
};
