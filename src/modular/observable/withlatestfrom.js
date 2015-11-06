'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var NAryDisposable = require('../narydisposable');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var identity = require('../helpers/identity');
var noop = require('../helpers/noop');
var isFunction = require('../helpers/isfunction');
var inherits = require('util').inherits;
var tryCatch = require('../internal/trycatchutils').tryCatch;

function falseFactory() { return false; }
function initializeArray (n, fn) {
  var results = new Array(n);
  for (var i = 0; i < n; i++) {
    results[i] = fn(i);
  }
  return results;
}
function argumentsToArray() {
  var len = arguments.length, args = new Array(len);
  for (var i = 0; i < len; i++) { args[i] = arguments[i]; }
  return args;
}

function WithLatestFromOtherObserver(o, i, state) {
  this._o = o;
  this._i = i;
  this._state = state;
  AbstractObserver.call(this);
}

inherits(WithLatestFromOtherObserver, AbstractObserver);

WithLatestFromOtherObserver.prototype.next = function (x) {
  this._state.values[this._i] = x;
  this._state.hasValue[this._i] = true;
  this._state.hasValueAll = this._state.hasValue.every(identity);
};

WithLatestFromOtherObserver.prototype.error = function (e) { this._o.onError(e); };
WithLatestFromOtherObserver.prototype.completed = noop;

function WithLatestFromSourceObserver(o, cb, state) {
  this._o = o;
  this._cb = cb;
  this._state = state;
  AbstractObserver.call(this);
}

inherits(WithLatestFromSourceObserver, AbstractObserver);

WithLatestFromSourceObserver.prototype.next = function (x) {
  var allValues = [x].concat(this._state.values);
  if (!this._state.hasValueAll) { return; }
  var res = tryCatch(this._cb).apply(null, allValues);
  if (res === global.Rx.errorObj) { return this._o.onError(res.e); }
  this._o.onNext(res);
};

WithLatestFromSourceObserver.prototype.error = function (e) { this._o.onError(e); };
WithLatestFromSourceObserver.prototype.completed = function () { this._o.onCompleted(); };

function WithLatestFromObservable(source, sources, resultSelector) {
  this._s = source;
  this._ss = sources;
  this._cb = resultSelector;
  ObservableBase.call(this);
}

inherits(WithLatestFromObservable, ObservableBase);

WithLatestFromObservable.prototype.subscribeCore = function (o) {
  var len = this._ss.length;
  var state = {
    hasValue: initializeArray(len, falseFactory),
    hasValueAll: false,
    values: new Array(len)
  };

  var n = this._ss.length, subscriptions = new Array(n + 1);
  for (var i = 0; i < n; i++) {
    var other = this._ss[i], sad = new SingleAssignmentDisposable();
    isPromise(other) && (other = fromPromise(other));
    sad.setDisposable(other.subscribe(new WithLatestFromOtherObserver(o, i, state)));
    subscriptions[i] = sad;
  }

  var outerSad = new SingleAssignmentDisposable();
  outerSad.setDisposable(this._s.subscribe(new WithLatestFromSourceObserver(o, this._cb, state)));
  subscriptions[n] = outerSad;

  return new NAryDisposable(subscriptions);
};

/**
 * Merges the specified observable sequences into one observable sequence by using the selector function only when the (first) source observable sequence produces an element.
 * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
 */
module.exports = function withLatestFrom () {
  var len = arguments.length, args = new Array(len);
  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
  var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;

  return new WithLatestFromObservable(args[0], args.slice(1), resultSelector);
};
