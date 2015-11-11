'use strict';

var AbstractObserver = require('../observer/abstractobserver');
var ObservableBase = require('./observablebase');
var BinaryDisposable = require('../binarydisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var inherits = require('util').inherits;

function SkipUntilSourceObserver(o, p) {
  this._o = o;
  this._p = p;
  AbstractObserver.call(this);
}

inherits(SkipUntilSourceObserver, AbstractObserver);

SkipUntilSourceObserver.prototype.next = function (x) { this._p._open && this._o.onNext(x); };
SkipUntilSourceObserver.prototype.error = function (err) { this._o.onError(err); };
SkipUntilSourceObserver.prototype.onCompleted = function () { this._p._open && this._o.onCompleted(); };

function SkipUntilOtherObserver(o, p, r) {
  this._o = o;
  this._p = p;
  this._r = r;
  AbstractObserver.call(this);
}

inherits(SkipUntilOtherObserver, AbstractObserver);

SkipUntilOtherObserver.prototype.next = function () { this._p._open = true; this._r.dispose(); };
SkipUntilOtherObserver.prototype.error = function (err) { this._o.onError(err); };
SkipUntilOtherObserver.prototype.onCompleted = function () { this._r.dispose(); };

function SkipUntilObservable(source, other) {
  this._s = source;
  this._o = isPromise(other) ? fromPromise(other) : other;
  this._open = false;
  ObservableBase.call(this);
}

inherits(SkipUntilObservable, ObservableBase);

SkipUntilObservable.prototype.subscribeCore = function(o) {
  var leftSubscription = new SingleAssignmentDisposable();
  leftSubscription.setDisposable(this._s.subscribe(new SkipUntilSourceObserver(o, this)));

  isPromise(this._o) && (this._o = fromPromise(this._o));

  var rightSubscription = new SingleAssignmentDisposable();
  rightSubscription.setDisposable(this._o.subscribe(new SkipUntilOtherObserver(o, this, rightSubscription)));

  return new BinaryDisposable(leftSubscription, rightSubscription);
};

/**
 * Returns the values from the source observable sequence only after the other observable sequence produces a value.
 * @param {Observable | Promise} other The observable sequence or Promise that triggers propagation of elements of the source sequence.
 * @returns {Observable} An observable sequence containing the elements of the source sequence starting from the point the other sequence triggered propagation.
 */
module.exports = function skipUntil (source, other) {
  return new SkipUntilObservable(source, other);
};
