'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var EmptyError = require('../internal/errors').EmptyError;
var bindCallback = require('../internal/bindcallback');
var isFunction = require('../helpers/isfunction');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var inherits = require('inherits');

function FirstObserver(o, obj, s) {
  this._o = o;
  this._obj = obj;
  this._s = s;
  this._i = 0;
  AbstractObserver.call(this);
}

inherits(FirstObserver, AbstractObserver);

FirstObserver.prototype.next = function (x) {
  if (this._obj.predicate) {
    var res = tryCatch(this._obj.predicate)(x, this._i++, this._s);
    if (res === global._Rx.errorObj) { return this._o.onError(res.e); }
    if (Boolean(res)) {
      this._o.onNext(x);
      this._o.onCompleted();
    }
  } else if (!this._obj.predicate) {
    this._o.onNext(x);
    this._o.onCompleted();
  }
};
FirstObserver.prototype.error = function (e) { this._o.onError(e); };
FirstObserver.prototype.completed = function () {
  if (this._obj.defaultValue === undefined) {
    this._o.onError(new EmptyError());
  } else {
    this._o.onNext(this._obj.defaultValue);
    this._o.onCompleted();
  }
};

function FirstObservable(source, obj) {
  this.source = source;
  this._obj = obj;
  ObservableBase.call(this);
}

inherits(FirstObservable, ObservableBase);

FirstObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new FirstObserver(o, this._obj, this.source));
};

module.exports = function first () {
  var obj = {}, source = arguments[0];
  if (typeof arguments[1] === 'object') {
    obj = arguments[1];
  } else {
    obj = {
      predicate: arguments[1],
      thisArg: arguments[2],
      defaultValue: arguments[3]
    };
  }
  if (isFunction (obj.predicate)) {
    var fn = obj.predicate;
    obj.predicate = bindCallback(fn, obj.thisArg, 3);
  }
  return new FirstObservable(source, obj);
};
