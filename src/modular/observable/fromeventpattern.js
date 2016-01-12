'use strict';

var ObservableBase = require('./observablebase');
var publish = require('./publish');
var isFunction = require('../helpers/isfunction');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var inherits = require('inherits');

function EventPatternDisposable(del, fn, ret) {
  this._del = del;
  this._fn = fn;
  this._ret = ret;
  this.isDisposed = false;
}

EventPatternDisposable.prototype.dispose = function () {
  if(!this.isDisposed) {
    isFunction(this._del) && this._del(this._fn, this._ret);
    this.isDisposed = true;
  }
};

function EventPatternObservable(add, del, fn) {
  this._add = add;
  this._del = del;
  this._fn = fn;
  ObservableBase.call(this);
}

inherits(EventPatternObservable, ObservableBase);

function createHandler(o, fn) {
  return function handler () {
    var results = arguments[0];
    if (isFunction(fn)) {
      results = tryCatch(fn).apply(null, arguments);
      if (results === global.Rx.errorObj) { return o.onError(results.e); }
    }
    o.onNext(results);
  };
}

EventPatternObservable.prototype.subscribeCore = function (o) {
  var fn = createHandler(o, this._fn);
  var returnValue = this._add(fn);
  return new EventPatternDisposable(this._del, fn, returnValue);
};

/**
 * Creates an observable sequence from an event emitter via an addHandler/removeHandler pair.
 * @param {Function} addHandler The function to add a handler to the emitter.
 * @param {Function} [removeHandler] The optional function to remove a handler from an emitter.
 * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
 * @returns {Observable} An observable sequence which wraps an event from an event emitter
 */
module.exports = function fromEventPattern (addHandler, removeHandler, selector) {
  return publish(new EventPatternObservable(addHandler, removeHandler, selector)).refCount();
};
