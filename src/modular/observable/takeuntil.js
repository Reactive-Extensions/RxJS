'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var BinaryDisposable = require('../binarydisposable');
var isPromise = require('../helpers/ispromise');
var fromPromise = require('./frompromise');
var noop = require('../helpers/noop');
var inherits = require('util').inherits;

function TakeUntilObserver(o) {
  this._o = o;
  AbstractObserver.call(this);
}

inherits(TakeUntilObserver, AbstractObserver);

TakeUntilObserver.prototype.next = function () { this._o.onCompleted(); };
TakeUntilObserver.prototype.error = function (e) { this._o.onError(e); };
TakeUntilObserver.prototype.onCompleted = noop;

function TakeUntilObservable(source, other) {
  this.source = source;
  this._other = isPromise(other) ? fromPromise(other) : other;
  ObservableBase.call(this);
}

inherits(TakeUntilObservable, ObservableBase);

TakeUntilObservable.prototype.subscribeCore = function(o) {
  return new BinaryDisposable(
    this.source.subscribe(o),
    this._other.subscribe(new TakeUntilObserver(o))
  );
};

/**
 * Returns the values from the source observable sequence until the other observable sequence produces a value.
 * @param {Observable | Promise} other Observable sequence or Promise that terminates propagation of elements of the source sequence.
 * @returns {Observable} An observable sequence containing the elements of the source sequence up to the point the other sequence interrupted further propagation.
 */
module.exports = function takeUntil(source, other) {
  return new TakeUntilObservable(source, other);
};
