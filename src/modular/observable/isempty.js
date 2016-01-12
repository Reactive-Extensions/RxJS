'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var inherits = require('inherits');

function IsEmptyObserver(o) {
  this._o = o;
  AbstractObserver.call(this);
}

inherits(IsEmptyObserver, AbstractObserver);

IsEmptyObserver.prototype.next = function () {
  this._o.onNext(false);
  this._o.onCompleted();
};
IsEmptyObserver.prototype.error = function (e) { this._o.onError(e); };
IsEmptyObserver.prototype.completed = function () {
  this._o.onNext(true);
  this._o.onCompleted();
};

function IsEmptyObservable(source) {
  this.source = source;
  ObservableBase.call(this);
}

inherits(IsEmptyObservable, ObservableBase);

IsEmptyObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new IsEmptyObserver(o));
};

module.exports = function isEmpty (source) {
  return new IsEmptyObservable(source);
};
