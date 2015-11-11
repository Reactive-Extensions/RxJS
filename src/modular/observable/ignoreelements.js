'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var noop = require('../helpers/noop');
var inherits = require('util').inherits;

function IgnoreElementsObserver(o) {
  this._o = o;
  AbstractObserver.call(this);
}

inherits(IgnoreElementsObserver, AbstractObserver);

IgnoreElementsObserver.prototype.next = noop;
IgnoreElementsObserver.prototype.error = function (e) { this._o.onError(e); };
IgnoreElementsObserver.prototype.completed = function () { this._o.onCompleted(); };

function IgnoreElementsObservable(source) {
  this.source = source;
  ObservableBase.call(this);
}

inherits(IgnoreElementsObservable, ObservableBase);

IgnoreElementsObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new IgnoreElementsObserver(o));
};

/**
 *  Ignores all elements in an observable sequence leaving only the termination messages.
 * @returns {Observable} An empty observable sequence that signals termination, successful or exceptional, of the source sequence.
 */
module.exports = function ignoreElements (source) {
  return new IgnoreElementsObservable(source);
};
