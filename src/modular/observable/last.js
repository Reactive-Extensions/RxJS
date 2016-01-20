'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var EmptyError = require('../internal/errors').EmptyError;
var bindCallback = require('../internal/bindcallback');
var isFunction = require('../helpers/isfunction');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var inherits = require('inherits');

function LastObserver(o, obj, s) {
  this._o = o;
  this._obj = obj;
  this._s = s;
  this._i = 0;
  this._hv = false;
  this._v = null;
  AbstractObserver.call(this);
}

inherits(LastObserver, AbstractObserver);

LastObserver.prototype.next = function (x) {
  var shouldYield = false;
  if (this._obj.predicate) {
    var res = tryCatch(this._obj.predicate)(x, this._i++, this._s);
    if (res === global._Rx.errorObj) { return this._o.onError(res.e); }
    Boolean(res) && (shouldYield = true);
  } else if (!this._obj.predicate) {
    shouldYield = true;
  }
  if (shouldYield) {
    this._hv = true;
    this._v = x;
  }
};
LastObserver.prototype.error = function (e) { this._o.onError(e); };
LastObserver.prototype.completed = function () {
  if (this._hv) {
    this._o.onNext(this._v);
    this._o.onCompleted();
  }
  else if (this._obj.defaultValue === undefined) {
    this._o.onError(new EmptyError());
  } else {
    this._o.onNext(this._obj.defaultValue);
    this._o.onCompleted();
  }
};

function LastObservable(source, obj) {
  this.source = source;
  this._obj = obj;
  ObservableBase.call(this);
}

inherits(LastObservable, ObservableBase);

LastObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new LastObserver(o, this._obj, this.source));
};

module.exports = function last () {
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
  return new LastObservable(source, obj);
};
