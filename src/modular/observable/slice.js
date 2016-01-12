'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var ArgumentOutOfRangeError = require('../internal/errors').ArgumentOutOfRangeError;
var inherits = require('inherits');

function SliceObserver(o, b, e) {
  this._o = o;
  this._b = b;
  this._e = e;
  this._i = 0;
  AbstractObserver.call(this);
}

inherits(SliceObserver, AbstractObserver);

SliceObserver.prototype.next = function (x) {
  if (this._i >= this._b) {
    if (this._e === this._i) {
      this._o.onCompleted();
    } else {
      this._o.onNext(x);
    }
  }
  this._i++;
};
SliceObserver.prototype.error = function (e) { this._o.onError(e); };
SliceObserver.prototype.completed = function () { this._o.onCompleted(); };


function SliceObservable(source, b, e) {
  this.source = source;
  this._b = b;
  this._e = e;
  ObservableBase.call(this);
}

inherits(SliceObservable, ObservableBase);

SliceObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new SliceObserver(o, this._b, this._e));
};

module.exports = function slice(source, begin, end) {
  var start = begin || 0;
  if (start < 0) { throw new ArgumentOutOfRangeError(); }
  if (typeof end === 'number' && end < start) {
    throw new ArgumentOutOfRangeError();
  }
  return new SliceObservable(source, start, end);
};
