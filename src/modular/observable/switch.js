'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var BinaryDisposable = require('../binarydisposable');
var SerialDisposable = require('../serialdisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var inherits = require('inherits');

function InnerObserver(p, id) {
  this._p = p;
  this._id = id;
  AbstractObserver.call(this);
}

inherits(InnerObserver, AbstractObserver);

InnerObserver.prototype.next = function (x) { this._p._latest === this._id && this._p._o.onNext(x); };
InnerObserver.prototype.error = function (e) { this._p._latest === this._id && this._p._o.onError(e); };
InnerObserver.prototype.completed = function () {
  if (this._p._latest === this._id) {
    this._p._hasLatest = false;
    this._p._stopped && this._p._o.onCompleted();
  }
};

function SwitchObserver(o, inner) {
  this._o = o;
  this._inner = inner;
  this._stopped = false;
  this._latest = 0;
  this._hasLatest = false;
  AbstractObserver.call(this);
}

inherits(SwitchObserver, AbstractObserver);

SwitchObserver.prototype.next = function (innerSource) {
  var d = new SingleAssignmentDisposable(), id = ++this._latest;
  this._hasLatest = true;
  this._inner.setDisposable(d);
  isPromise(innerSource) && (innerSource = fromPromise(innerSource));
  d.setDisposable(innerSource.subscribe(new InnerObserver(this, id)));
};
SwitchObserver.prototype.error = function (e) { this._o.onError(e); };
SwitchObserver.prototype.completed = function () { this._stopped = true; !this._hasLatest && this._o.onCompleted(); };

function SwitchObservable(source) {
  this.source = source;
  ObservableBase.call(this);
}

inherits(SwitchObservable, ObservableBase);

SwitchObservable.prototype.subscribeCore = function (o) {
  var inner = new SerialDisposable(), s = this.source.subscribe(new SwitchObserver(o, inner));
  return new BinaryDisposable(s, inner);
};

/**
* Transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.
* @returns {Observable} The observable sequence that at any point in time produces the elements of the most recent inner observable sequence that has been received.
*/
module.exports = function switch_(source) {
  return new SwitchObservable(source);
};
