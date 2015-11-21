'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var Disposable = require('../disposable');
var inherits = require('util').inherits;

function IndexOfObserver(o, e, n) {
  this._o = o;
  this._e = e;
  this._n = n;
  this._i = 0;
  AbstractObserver.call(this);
}

inherits(IndexOfObserver, AbstractObserver);

IndexOfObserver.prototype.next = function (x) {
  if (this._i >= this._n && x === this._e) {
    this._o.onNext(this._i);
    this._o.onCompleted();
  }
  this._i++;
};
IndexOfObserver.prototype.error = function (e) { this._o.onError(e); };
IndexOfObserver.prototype.completed = function () { this._o.onNext(-1); this._o.onCompleted(); };

function IndexOfObservable(source, e, n) {
  this.source = source;
  this._e = e;
  this._n = n;
  ObservableBase.call(this);
}

inherits(IndexOfObservable, ObservableBase);

IndexOfObservable.prototype.subscribeCore = function (o) {
  if (this._n < 0) {
    o.onNext(-1);
    o.onCompleted();
    return Disposable.empty;
  }

  return this.source.subscribe(new IndexOfObserver(o, this._e, this._n));
};

module.exports = function indexOf (source, searchElement, fromIndex) {
  var n = +fromIndex || 0;
  Math.abs(n) === Infinity && (n = 0);
  return new IndexOfObservable(source, searchElement, n);
};
