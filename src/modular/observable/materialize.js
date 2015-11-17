'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var Notification = require('../notification');
var inherits = require('util').inherits;

function MaterializeObserver(o) {
  this._o = o;
  AbstractObserver.call(this);
}

inherits(MaterializeObserver, AbstractObserver);

MaterializeObserver.prototype.next = function (x) { this._o.onNext(Notification.createOnNext(x)); };
MaterializeObserver.prototype.error = function (e) { this._o.onNext(Notification.createOnError(e)); this._o.onCompleted(); };
MaterializeObserver.prototype.completed = function () { this._o.onNext(Notification.createOnCompleted()); this._o.onCompleted(); };

function MaterializeObservable(source) {
  this.source = source;
  ObservableBase.call(this);
}

inherits(MaterializeObservable, ObservableBase);

MaterializeObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new MaterializeObserver(o));
};

/**
 *  Materializes the implicit notifications of an observable sequence as explicit notification values.
 * @returns {Observable} An observable sequence containing the materialized notification values from the source sequence.
 */
module.exports = function materialize (source) {
  return new MaterializeObservable(source);
};
