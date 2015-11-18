'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var inherits = require('util').inherits;

function TakeLastBufferObserver(o, c) {
  this._o = o;
  this._c = c;
  this._q = [];
  AbstractObserver.call(this);
}

inherits(TakeLastBufferObserver, AbstractObserver);

TakeLastBufferObserver.prototype.next = function (x) {
  this._q.push(x);
  this._q.length > this._c && this._q.shift();
};

TakeLastBufferObserver.prototype.error = function (e) {
  this._o.onError(e);
};

TakeLastBufferObserver.prototype.completed = function () {
  this._o.onNext(this._q);
  this._o.onCompleted();
};

function TakeLastBufferObservable(source, count) {
  this.source = source;
  this._c = count;
  ObservableBase.call(this);
}

inherits(TakeLastBufferObservable, ObservableBase);

TakeLastBufferObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new TakeLastBufferObserver(o, this._c));
};

module.exports = function takeLastBuffer(source, count) {
  count < 0 && (count = 0);
  return new TakeLastBufferObservable(source, count);
};
