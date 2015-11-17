'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var inherits = require('util').inherits;

function DematerializeObserver(o) {
  this._o = o;
  AbstractObserver.call(this);
}

inherits(DematerializeObserver, AbstractObserver);

DematerializeObserver.prototype.next = function (x) { x.accept(this._o); };
DematerializeObserver.prototype.error = function (e) { this._o.onError(e); };
DematerializeObserver.prototype.completed = function () { this._o.onCompleted(); };

function DematerializeObservable(source) {
  this.source = source;
  ObservableBase.call(this);
}

inherits(DematerializeObservable, ObservableBase);

DematerializeObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new DematerializeObserver(o));
};

/**
 * Dematerializes the explicit notification values of an observable sequence as implicit notifications.
 * @returns {Observable} An observable sequence exhibiting the behavior corresponding to the source sequence's notification values.
 */
module.exports = function dematerialize (source) {
  return new DematerializeObservable(source);
};
