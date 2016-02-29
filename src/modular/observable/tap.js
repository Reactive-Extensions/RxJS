'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var create = require('../observer/create');
var isFunction = require('../helpers/isfunction');
var noop = require('../helpers/noop');
var inherits = require('inherits');
var tryCatchUtils = require('../internal/trycatchutils');
var tryCatch = tryCatchUtils.tryCatch, errorObj = tryCatchUtils.errorObj;

function TapObserver(o, p) {
  this._o = o;
  this._t = !p._oN || isFunction(p._oN) ?
    create(p._oN || noop, p._oE || noop, p._oC || noop) :
    p._oN;
  this.isStopped = false;
  AbstractObserver.call(this);
}

inherits(TapObserver, AbstractObserver);

TapObserver.prototype.next = function(x) {
  var res = tryCatch(this._t.onNext).call(this._t, x);
  if (res === errorObj) { this._o.onError(res.e); }
  this._o.onNext(x);
};

TapObserver.prototype.error = function(e) {
  var res = tryCatch(this._t.onError).call(this._t, e);
  if (res === errorObj) { return this._o.onError(res.e); }
  this._o.onError(e);
};

TapObserver.prototype.completed = function() {
  var res = tryCatch(this._t.onCompleted).call(this._t);
  if (res === errorObj) { return this._o.onError(res.e); }
  this._o.onCompleted();
};

function TapObservable(source, observerOrOnNext, onError, onCompleted) {
  this.source = source;
  this._oN = observerOrOnNext;
  this._oE = onError;
  this._oC = onCompleted;
  ObservableBase.call(this);
}

inherits(TapObservable, ObservableBase);

TapObservable.prototype.subscribeCore = function(o) {
  return this.source.subscribe(new TapObserver(o, this));
};

/**
*  Invokes an action for each element in the observable sequence and invokes an action upon graceful or exceptional termination of the observable sequence.
*  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
* @param {Function | Observer} observerOrOnNext Action to invoke for each element in the observable sequence or an o.
* @param {Function} [onError]  Action to invoke upon exceptional termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
* @param {Function} [onCompleted]  Action to invoke upon graceful termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
* @returns {Observable} The source sequence with the side-effecting behavior applied.
*/
module.exports = function tap(source, observerOrOnNext, onError, onCompleted) {
  return new TapObservable(source, observerOrOnNext, onError, onCompleted);
};
