'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var Disposable = require('../disposable');
var inherits = require('util').inherits;

function IncludesObserver(o, elem, n) {
  this._o = o;
  this._elem = elem;
  this._n = n;
  this._i = 0;
  AbstractObserver.call(this);
}

inherits(IncludesObserver, AbstractObserver);

function comparer(a, b) {
  return (a === 0 && b === 0) || (a === b || (isNaN(a) && isNaN(b)));
}

IncludesObserver.prototype.next = function (x) {
  if (this._i++ >= this._n && comparer(x, this._elem)) {
    this._o.onNext(true);
    this._o.onCompleted();
  }
};
IncludesObserver.prototype.error = function (e) { this._o.onError(e); };
IncludesObserver.prototype.completed = function () { this._o.onNext(false); this._o.onCompleted(); };

function IncludesObservable(source, elem, idx) {
  var n = +idx || 0;
  Math.abs(n) === Infinity && (n = 0);

  this.source = source;
  this._elem = elem;
  this._n = n;
  ObservableBase.call(this);
}

inherits(IncludesObservable, ObservableBase);

IncludesObservable.prototype.subscribeCore = function (o) {
  if (this._n < 0) {
    o.onNext(false);
    o.onCompleted();
    return Disposable.empty;
  }

  return this.source.subscribe(new IncludesObserver(o, this._elem, this._n));
};

module.exports = function includes (source, searchElement, fromIndex) {
  return new IncludesObservable(source, searchElement, fromIndex);
};
