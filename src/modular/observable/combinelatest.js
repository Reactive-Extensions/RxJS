'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var NAryDisposable = require('../narydisposable');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var identity = require('../helpers/identity');
var isFunction = require('../helpers/isfunction');
var inherits = require('inherits');
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

function CombineLatestObserver(o, i, cb, state) {
  this._o = o;
  this._i = i;
  this._cb = cb;
  this._state = state;
  AbstractObserver.call(this);
}

inherits(CombineLatestObserver, AbstractObserver);

function notTheSame(i) {
  return function (x, j) {
    return j !== i;
  };
}

CombineLatestObserver.prototype.next = function (x) {
  this._state.values[this._i] = x;
  this._state.hasValue[this._i] = true;
  if (this._state.hasValueAll || (this._state.hasValueAll = this._state.hasValue.every(identity))) {
    var res = tryCatch(this._cb).apply(null, this._state.values);
    if (res === global.Rx.errorObj) { return this._o.onError(res.e); }
    this._o.onNext(res);
  } else if (this._state.isDone.filter(notTheSame(this._i)).every(identity)) {
    this._o.onCompleted();
  }
};

CombineLatestObserver.prototype.error = function (e) { this._o.onError(e); };
CombineLatestObserver.prototype.completed = function () {
  this._state.isDone[this._i] = true;
  this._state.isDone.every(identity) && this._o.onCompleted();
};


function CombineLatestObservable(params, cb) {
  this._params = params;
  this._cb = cb;
  ObservableBase.call(this);
}

inherits(CombineLatestObservable, ObservableBase);

CombineLatestObservable.prototype.subscribeCore = function(observer) {
  var len = this._params.length,
      subscriptions = new Array(len);

  var state = {
    hasValue: initializeArray(len, falseFactory),
    hasValueAll: false,
    isDone: initializeArray(len, falseFactory),
    values: new Array(len)
  };

  for (var i = 0; i < len; i++) {
    var source = this._params[i], sad = new SingleAssignmentDisposable();
    subscriptions[i] = sad;
    isPromise(source) && (source = fromPromise(source));
    sad.setDisposable(source.subscribe(new CombineLatestObserver(observer, i, this._cb, state)));
  }

  return new NAryDisposable(subscriptions);
};

/**
* Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
*
* @example
* 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
* 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
* @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
*/
module.exports = function combineLatest () {
  var len = arguments.length, args = new Array(len);
  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
  var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
  return new CombineLatestObservable(args, resultSelector);
};
