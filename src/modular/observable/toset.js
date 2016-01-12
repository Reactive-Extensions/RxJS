'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var inherits = require('inherits');

function ToSetObserver(o) {
  this._o = o;
  this._s = new global.Set();
  AbstractObserver.call(this);
}

inherits(ToSetObserver, AbstractObserver);

ToSetObserver.prototype.next = function (x) { this._s.add(x); };
ToSetObserver.prototype.error = function (e) { this._o.onError(e); };
ToSetObserver.prototype.completed = function () {
  this._o.onNext(this._s);
  this._o.onCompleted();
};

function ToSetObservable(source) {
  this.source = source;
  ObservableBase.call(this);
}

inherits(ToSetObservable, ObservableBase);

ToSetObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new ToSetObserver(o));
};

module.exports = function toSet (source) {
  if (typeof global.Set === 'undefined') { throw new TypeError(); }
  return new ToSetObservable(source);
};
