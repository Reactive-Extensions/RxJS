'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var SerialDisposable = require('../serialdisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var bindCallback = require('../internal/bindcallback');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var inherits = require('util').inherits;

function CatchObserver(o, s, fn) {
  this._o = o;
  this._s = s;
  this._fn = fn;
  AbstractObserver.call(this);
}

inherits(CatchObserver, AbstractObserver);

CatchObserver.prototype.next = function (x) { this._o.onNext(x); };
CatchObserver.prototype.completed = function () { return this._o.onCompleted(); };
CatchObserver.prototype.error = function (e) {
  var result = tryCatch(this._fn)(e);
  if (result === global.Rx.errorObj) { return this._o.onError(result.e); }
  isPromise(result) && (result = fromPromise(result));

  var d = new SingleAssignmentDisposable();
  this._s.setDisposable(d);
  d.setDisposable(result.subscribe(this._o));
};

function CatchObservable(source, fn) {
  this.source = source;
  this._fn = fn;
  ObservableBase.call(this);
}

inherits(CatchObservable, ObservableBase);

CatchObservable.prototype.subscribeCore = function (o) {
  var d1 = new SingleAssignmentDisposable(), subscription = new SerialDisposable();
  subscription.setDisposable(d1);
  d1.setDisposable(this.source.subscribe(new CatchObserver(o, subscription, this._fn)));
  return subscription;
};

/**
 * Continues an observable sequence that is terminated by an exception with the next observable sequence.
 * @param {Mixed} handlerOrSecond Exception handler function that returns an observable sequence given the error that occurred in the first sequence, or a second observable sequence used to produce results when an error occurred in the first sequence.
 * @returns {Observable} An observable sequence containing the first sequence's elements, followed by the elements of the handler sequence in case an exception occurred.
 */
module.exports = function catchHandler(source, handler, thisArg) {
  var fn = bindCallback(handler, thisArg, 1);
  return new CatchObservable(source, fn);
};
