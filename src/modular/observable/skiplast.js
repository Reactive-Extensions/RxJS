'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var inherits = require('inherits');

function SkipLastObserver(o, c) {
  this._o = o;
  this._c = c;
  this._q = [];
  AbstractObserver.call(this);
}

inherits(SkipLastObserver, AbstractObserver);

SkipLastObserver.prototype.next = function (x) {
  this._q.push(x);
  this._q.length > this._c && this._o.onNext(this._q.shift());
};

SkipLastObserver.prototype.error = function (e) { this._o.onError(e); };
SkipLastObserver.prototype.completed = function () { this._o.onCompleted(); };

function SkipLastObservable(source, c) {
  this.source = source;
  this._c = c;
  ObservableBase.call(this);
}

inherits(SkipLastObservable, ObservableBase);

SkipLastObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new SkipLastObserver(o, this._c));
};

module.exports = function skipLast (source, count) {
  count < 0 && (count = 0);
  return new SkipLastObservable(source, count);
};
