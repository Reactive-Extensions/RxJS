'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var bindCallback = require('../internal/bindcallback');
var inherits = require('inherits');
var tryCatch = require('../internal/trycatchutils').tryCatch;

function FilterObserver(o, predicate, source) {
  this._o = o;
  this._fn = predicate;
  this.source = source;
  this._i = 0;
  AbstractObserver.call(this);
}

inherits(FilterObserver, AbstractObserver);

FilterObserver.prototype.next = function(x) {
  var shouldYield = tryCatch(this._fn)(x, this._i++, this.source);
  if (shouldYield === global.Rx.errorObj) {
    return this._o.onError(shouldYield.e);
  }
  shouldYield && this._o.onNext(x);
};

FilterObserver.prototype.error = function (e) { this._o.onError(e); };
FilterObserver.prototype.completed = function () { this._o.onCompleted(); };

function FilterObservable(source, predicate, thisArg) {
  this.source = source;
  this._fn = bindCallback(predicate, thisArg, 3);
  ObservableBase.call(this);
}

inherits(FilterObservable, ObservableBase);

FilterObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new FilterObserver(o, this._fn, this));
};

function innerPredicate(fn, self) {
  return function(x, i, o) { return self._fn(x, i, o) && fn.call(this, x, i, o); };
}

FilterObservable.prototype.internalFilter = function(fn, thisArg) {
  return new FilterObservable(this.source, innerPredicate(fn, this), thisArg);
};

/**
*  Filters the elements of an observable sequence based on a predicate by incorporating the element's index.
* @param {Function} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
* @param {Any} [thisArg] Object to use as this when executing callback.
* @returns {Observable} An observable sequence that contains elements from the input sequence that satisfy the condition.
*/
module.exports = function filter(source, predicate, thisArg) {
  return source instanceof FilterObservable ? source.internalFilter(predicate, thisArg) :
    new FilterObservable(source, predicate, thisArg);
};
