'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var inherits = require('util').inherits;

function DefaultIfEmptyObserver(o, d) {
  this._o = o;
  this._d = d;
  this._f = false;
  AbstractObserver.call(this);
}

inherits(DefaultIfEmptyObserver, AbstractObserver);

DefaultIfEmptyObserver.prototype.next = function (x) {
  this._f = true;
  this._o.onNext(x);
};
DefaultIfEmptyObserver.prototype.error = function (e) { this._o.onError(e); };
DefaultIfEmptyObserver.prototype.completed = function () {
  !this._f && this._o.onNext(this._d);
  this._o.onCompleted();
};

function DefaultIfEmptyObservable(source, defaultValue) {
  this.source = source;
  this._d = defaultValue;
  ObservableBase.call(this);
}

inherits(DefaultIfEmptyObservable, ObservableBase);

DefaultIfEmptyObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new DefaultIfEmptyObserver(o, this._d));
};

/**
 *  Returns the elements of the specified sequence or the specified value in a singleton sequence if the sequence is empty.
 * @param defaultValue The value to return if the sequence is empty. If not provided, this defaults to null.
 * @returns {Observable} An observable sequence that contains the specified default value if the source is empty; otherwise, the elements of the source itself.
 */
module.exports = function defaultIfEmpty(source, defaultValue) {
  return new DefaultIfEmptyObservable(source, defaultValue);
};
