'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var Disposable = require('../disposable');
var inherits = require('util').inherits;

function LastIndexOfObserver(o, e, n) {
  this._o = o;
  this._e = e;
  this._n = n;
  this._v = 0;
  this._hv = false;
  this._i = 0;
  AbstractObserver.call(this);
}

inherits(LastIndexOfObserver, AbstractObserver);

LastIndexOfObserver.prototype.next = function (x) {
  if (this._i >= this._n && x === this._e) {
    this._hv = true;
    this._v = this._i;
  }
  this._i++;
};
LastIndexOfObserver.prototype.error = function (e) { this._o.onError(e); };
LastIndexOfObserver.prototype.completed = function () {
  if (this._hv) {
    this._o.onNext(this._v);
  } else {
    this._o.onNext(-1);
  }
  this._o.onCompleted();
};

function LastIndexOfObservable(source, e, n) {
  this.source = source;
  this._e = e;
  this._n = n;
  ObservableBase.call(this);
}

inherits(LastIndexOfObservable, ObservableBase);

LastIndexOfObservable.prototype.subscribeCore = function (o) {
  if (this._n < 0) {
    o.onNext(-1);
    o.onCompleted();
    return Disposable.empty;
  }

  return this.source.subscribe(new LastIndexOfObserver(o, this._e, this._n));
};

module.exports = function lastIndexOf (source, searchElement, fromIndex) {
  var n = +fromIndex || 0;
  Math.abs(n) === Infinity && (n = 0);
  return new LastIndexOfObservable(source, searchElement, n);
};
