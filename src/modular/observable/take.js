'use strict';

var AbstractObserver = require('../observer/abstractobserver');
var ObservableBase = require('./observablebase');
var empty = require('./empty');
var errors = require('../internal/errors');
var inherits = require('inherits');

function TakeObserver(o, c) {
  this._o = o;
  this._c = c;
  this._r = c;
  AbstractObserver.call(this);
}

inherits(TakeObserver, AbstractObserver);

TakeObserver.prototype.next = function (x) {
  if (this._r-- > 0) {
    this._o.onNext(x);
    this._r <= 0 && this._o.onCompleted();
  }
};

TakeObserver.prototype.error = function (e) { this._o.onError(e); };
TakeObserver.prototype.completed = function () { this._o.onCompleted(); };

function TakeObservable(source, count) {
  this.source = source;
  this._count = count;
  ObservableBase.call(this);
}

inherits(TakeObservable, ObservableBase);

TakeObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new TakeObserver(o, this._count));
};

/**
 *  Returns a specified number of contiguous elements from the start of an observable sequence, using the specified scheduler for the edge case of take(0).
 * @param {Number} count The number of elements to return.
 * @param {Scheduler} [scheduler] Scheduler used to produce an OnCompleted message in case <paramref name="count count</paramref> is set to 0.
 * @returns {Observable} An observable sequence that contains the specified number of elements from the start of the input sequence.
 */
module.exports = function (source, count, scheduler) {
  if (count < 0) { throw new errors.ArgumentOutOfRangeError(); }
  if (count === 0) { return empty(scheduler); }
  return new TakeObservable(source, count);
};
