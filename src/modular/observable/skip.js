'use strict';

var AbstractObserver = require('../observer/abstractobserver');
var ObservableBase = require('./observablebase');
var errors = require('../internal/errors');
var inherits = require('util').inherits;

function SkipObserver(o, r) {
  this._o = o;
  this._r = r;
  AbstractObserver.call(this);
}

inherits(SkipObserver, AbstractObserver);

SkipObserver.prototype.next = function (x) {
  if (this._r <= 0) {
    this._o.onNext(x);
  } else {
    this._r--;
  }
};
SkipObserver.prototype.error = function(e) { this._o.onError(e); };
SkipObserver.prototype.completed = function() { this._o.onCompleted(); };

function SkipObservable(source, count) {
  this.source = source;
  this._count = count;
  ObservableBase.call(this);
}

inherits(SkipObservable, ObservableBase);

SkipObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new SkipObserver(o, this._count));
};

/**
 * Bypasses a specified number of elements in an observable sequence and then returns the remaining elements.
 * @param {Number} count The number of elements to skip before returning the remaining elements.
 * @returns {Observable} An observable sequence that contains the elements that occur after the specified index in the input sequence.
 */
module.exports = function skip(source, count) {
  if (count < 0) { throw new errors.ArgumentOutOfRangeError(); }
  return new SkipObservable(source, count);
};
