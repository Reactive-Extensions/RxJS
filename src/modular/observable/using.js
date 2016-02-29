'use strict';

var ObservableBase = require('./observablebase');
var throwError = require('./throw');
var BinaryDisposable = require('../binarydisposable');
var Disposable = require('../disposable');
var tryCatchUtils = require('../internal/trycatchutils');
var tryCatch = tryCatchUtils.tryCatch, errorObj = tryCatchUtils.errorObj;
var inherits = require('inherits');

function UsingObservable(resFn, obsFn) {
  this._resFn = resFn;
  this._obsFn = obsFn;
  ObservableBase.call(this);
}

inherits(UsingObservable, ObservableBase);

UsingObservable.prototype.subscribeCore = function (o) {
  var disposable = Disposable.empty;
  var resource = tryCatch(this._resFn)();
  if (resource === errorObj) {
    return new BinaryDisposable(throwError(resource.e).subscribe(o), disposable);
  }
  resource && (disposable = resource);
  var source = tryCatch(this._obsFn)(resource);
  if (source === errorObj) {
    return new BinaryDisposable(throwError(source.e).subscribe(o), disposable);
  }
  return new BinaryDisposable(source.subscribe(o), disposable);
};

/**
 * Constructs an observable sequence that depends on a resource object, whose lifetime is tied to the resulting observable sequence's lifetime.
 * @param {Function} resourceFactory Factory function to obtain a resource object.
 * @param {Function} observableFactory Factory function to obtain an observable sequence that depends on the obtained resource.
 * @returns {Observable} An observable sequence whose lifetime controls the lifetime of the dependent resource object.
 */
module.exports = function using (resourceFactory, observableFactory) {
  return new UsingObservable(resourceFactory, observableFactory);
};
