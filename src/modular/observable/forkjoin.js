'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var CompositeDisposable = require('../compositedisposable');
var Disposable = require('../disposable');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var isFunction = require('../helpers/isfunction');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var inherits = require('util').inherits;

function argumentsToArray() {
  var len = arguments.length, args = new Array(len);
  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
  return args;
}

function ForkJoinObserver(o, s, i, cb, subs) {
  this._o = o;
  this._s = s;
  this._i = i;
  this._cb = cb;
  this._subs = subs;
  AbstractObserver.call(this);
}

inherits(ForkJoinObserver, AbstractObserver);

ForkJoinObserver.prototype.next = function (x) {
  if (!this._s.finished) {
    this._s.hasResults[this._i] = true;
    this._s.results[this._i] = x;
  }
};

ForkJoinObserver.prototype.error = function (e) {
  this._s.finished = true;
  this._o.onError(e);
  this._subs.dispose();
};

ForkJoinObserver.prototype.completed = function () {
  if (!this._s.finished) {
    if (!this._s.hasResults[this._i]) {
      return this._o.onCompleted();
    }
    this._s.hasCompleted[this._i] = true;
    for (var i = 0; i < this._s.results.length; i++) {
      if (!this._s.hasCompleted[i]) { return; }
    }
    this._s.finished = true;

    var res = tryCatch(this._cb).apply(null, this._s.results);
    if (res === global.Rx.errorObj) { return this._o.onError(res.e); }

    this._o.onNext(res);
    this._o.onCompleted();
  }
};

function ForkJoinObservable(sources, cb) {
  this._sources = sources;
  this._cb = cb;
  ObservableBase.call(this);
}

inherits(ForkJoinObservable, ObservableBase);

ForkJoinObservable.prototype.subscribeCore = function (o) {
  if (this._sources.length === 0) {
    o.onCompleted();
    return Disposable.empty;
  }

  var count = this._sources.length;
  var state = {
    finished: false,
    hasResults: new Array(count),
    hasCompleted: new Array(count),
    results: new Array(count)
  };

  var subscriptions = new CompositeDisposable();
  for (var i = 0, len = this._sources.length; i < len; i++) {
    var source = this._sources[i];
    isPromise(source) && (source = fromPromise(source));
    subscriptions.add(source.subscribe(new ForkJoinObserver(o, state, i, this._cb, subscriptions)));
  }

  return subscriptions;
};

module.exports = function forkJoin () {
  var len = arguments.length, args = new Array(len);
  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
  var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
  return new ForkJoinObservable(args, resultSelector);
};
