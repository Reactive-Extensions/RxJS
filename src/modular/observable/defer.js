'use strict';

var ObservableBase = require('./observablebase');
var fromPromise = require('./frompromise');
var throwError = require('./throw');
var isPromise = require('../helpers/ispromise');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var inherits = require('inherits');

function Defer(factory) {
  this._f = factory;
  ObservableBase.call(this);
}

inherits(Defer, ObservableBase);

Defer.prototype.subscribeCore = function (o) {
  var result = tryCatch(this._f)();
  if (result === global.Rx.errorObj) { return throwError(result.e).subscribe(o);}
  isPromise(result) && (result = fromPromise(result));
  return result.subscribe(o);
};


/**
 *  Returns an observable sequence that invokes the specified factory function whenever a new observer subscribes.
 *
 * @example
 *  var res = Rx.Observable.defer(function () { return Rx.Observable.fromArray([1,2,3]); });
 * @param {Function} observableFactory Observable factory function to invoke for each observer that subscribes to the resulting sequence or Promise.
 * @returns {Observable} An observable sequence whose observers trigger an invocation of the given observable factory function.
 */
module.exports = function observableDefer(observableFactory) {
  return new Defer(observableFactory);
};
