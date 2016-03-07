'use strict';

var Observable = require('../observable');
var ObservableBase = require('./observablebase');
var asObservable = require('./asobservable');
var Disposable = require('../disposable');
var inherits = require('inherits');

function RefCountDisposable(p, s) {
  this._p = p;
  this._s = s;
  this.isDisposed = false;
}

RefCountDisposable.prototype.dispose = function () {
  if (!this.isDisposed) {
    this.isDisposed = true;
    this._s.dispose();
    --this._p._count === 0 && this._p._connectableSubscription.dispose();
  }
};

function RefCountObservable(source) {
  this.source = source;
  this._count = 0;
  this._connectableSubscription = null;
  ObservableBase.call(this);
}

inherits(RefCountObservable, ObservableBase);

RefCountObservable.prototype.subscribeCore = function (o) {
  var subscription = this.source.subscribe(o);
  ++this._count === 1 && (this._connectableSubscription = this.source.connect());
  return new RefCountDisposable(this, subscription);
};

function ConnectableObservable(source, subject) {
  this.source = source;
  this._connection = null;
  this._source = asObservable(source);
  this._subject = subject;
  Observable.call(this);
}

inherits(ConnectableObservable, Observable);

function ConnectDisposable(parent, subscription) {
  this._p = parent;
  this._s = subscription;
}

ConnectDisposable.prototype.dispose = function () {
  if (this._s) {
    this._s.dispose();
    this._s = null;
    this._p._connection = null;
  }
};

ConnectableObservable.prototype.connect = function () {
  if (!this._connection) {
    if (this._subject.isStopped) { return Disposable.empty; }

    var subscription = this._source.subscribe(this._subject);
    this._connection = new ConnectDisposable(this, subscription);
  }
  return this._connection;
};

ConnectableObservable.prototype._subscribe = function (o) {
  return this._subject.subscribe(o);
};

ConnectableObservable.prototype.refCount = function () {
  return new RefCountObservable(this);
};

module.exports = ConnectableObservable;
