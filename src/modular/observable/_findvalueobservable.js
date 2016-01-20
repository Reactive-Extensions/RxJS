'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var bindCallback = require('../internal/bindcallback');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var inherits = require('inherits');

function FindValueObserver(observer, source, callback, yieldIndex) {
  this._o = observer;
  this._s = source;
  this._cb = callback;
  this._y = yieldIndex;
  this._i = 0;
  AbstractObserver.call(this);
}

inherits(FindValueObserver, AbstractObserver);

FindValueObserver.prototype.next = function (x) {
  var shouldRun = tryCatch(this._cb)(x, this._i, this._s);
  if (shouldRun === global._Rx.errorObj) { return this._o.onError(shouldRun.e); }
  if (shouldRun) {
    this._o.onNext(this._y ? this._i : x);
    this._o.onCompleted();
  } else {
    this._i++;
  }
};

FindValueObserver.prototype.error = function (e) {
  this._o.onError(e);
};

FindValueObserver.prototype.completed = function () {
  this._y && this._o.onNext(-1);
  this._o.onCompleted();
};

function FindValueObservable(source, cb, thisArg, yieldIndex) {
  this.source = source;
  this._cb = bindCallback(cb, thisArg, 3);
  this._yieldIndex = yieldIndex;
  ObservableBase.call(this);
}

inherits(FindValueObservable, ObservableBase);

FindValueObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new FindValueObserver(o, this.source, this._cb, this._yieldIndex));
};

module.exports = FindValueObservable;
