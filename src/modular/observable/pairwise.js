'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var inherits = require('util').inherits;

function PairwiseObserver(o) {
  this._o = o;
  this._p = null;
  this._hp = false;
  AbstractObserver.call(this);
}

inherits(PairwiseObserver, AbstractObserver);

PairwiseObserver.prototype.next = function (x) {
  if (this._hp) {
    this._o.onNext([this._p, x]);
  } else {
    this._hp = true;
  }
  this._p = x;
};
PairwiseObserver.prototype.error = function (err) { this._o.onError(err); };
PairwiseObserver.prototype.completed = function () { this._o.onCompleted(); };

function PairwiseObservable(source) {
  this.source = source;
  ObservableBase.call(this);
}

inherits(PairwiseObservable, ObservableBase);

PairwiseObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new PairwiseObserver(o));
};

module.exports = function pairwise (source) {
  return new PairwiseObservable(source);
};
