'use strict';

var ObservableBase = require('./observablebase');
var fromArray = require('./from');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var AbstractObserver = require('../observer/abstractobserver');
var BinaryDisposable = require('../binarydisposable');
var isEqual = require('../internal/isequal');
var tryCatchUtils = require('../internal/trycatchutils');
var tryCatch = tryCatchUtils.tryCatch, errorObj = tryCatchUtils.errorObj;
var inherits = require('inherits');

var $iterator$ = (typeof global.Symbol === 'function' && global.Symbol.iterator) ||
  '_es6shim_iterator_';
// Bug for mozilla version
if (global.Set && typeof new global.Set()['@@iterator'] === 'function') {
  $iterator$ = '@@iterator';
}

function isIterable(o) {
  return o && o[$iterator$] !== undefined;
}

function isArrayLike (o) {
  return o && o.length !== undefined;
}

function FirstObserver(state) {
  this._s = state;
  AbstractObserver.call(this);
}

inherits(FirstObserver, AbstractObserver);

FirstObserver.prototype.next = function (x) {
  if (this._s.qr.length > 0) {
    var v = this._s.qr.shift();
    var equal = tryCatch(this._s.cmp)(v, x);
    if (equal === errorObj) { return this._s.o.onError(equal.e); }
    if (!equal) {
      this._s.o.onNext(false);
      this._s.o.onCompleted();
    }
  } else if (this._s.doner) {
    this._s.o.onNext(false);
    this._s.o.onCompleted();
  } else {
    this._s.ql.push(x);
  }
};

FirstObserver.prototype.error = function (e) { this._s.o.onError(e); };

FirstObserver.prototype.completed = function () {
  this._s.donel = true;
  if (this._s.ql.length === 0) {
    if (this._s.qr.length > 0) {
      this._s.o.onNext(false);
      this._s.o.onCompleted();
    } else if (this._s.doner) {
      this._s.o.onNext(true);
      this._s.o.onCompleted();
    }
  }
};

function SecondObserver(state) {
  this._s = state;
  AbstractObserver.call(this);
}

inherits(SecondObserver, AbstractObserver);

SecondObserver.prototype.next = function (x) {
  if (this._s.ql.length > 0) {
    var v = this._s.ql.shift();
    var equal = tryCatch(this._s.cmp)(v, x);
    if (equal === errorObj) { return this._s.o.onError(equal.e); }
    if (!equal) {
      this._s.o.onNext(false);
      this._s.o.onCompleted();
    }
  } else if (this._s.donel) {
    this._s.o.onNext(false);
    this._s.o.onCompleted();
  } else {
    this._s.qr.push(x);
  }
};

SecondObserver.prototype.error = function (e) { this._s.o.onError(e); };

SecondObserver.prototype.completed = function () {
  this._s.doner = true;
  if (this._s.qr.length === 0) {
    if (this._s.ql.length > 0) {
      this._s.o.onNext(false);
      this._s.o.onCompleted();
    } else if (this._s.donel) {
      this._s.o.onNext(true);
      this._s.o.onCompleted();
    }
  }
};

function SequenceEqualObservable(first, second, comparer) {
  this._first = first;
  this._second = second;
  this._cmp = comparer;
  ObservableBase.call(this);
}

inherits(SequenceEqualObservable, ObservableBase);

SequenceEqualObservable.prototype.subscribeCore = function (o) {
  (isArrayLike(this._first) || isIterable(this._first)) && (this._first = fromArray(this._first));
  isPromise(this._first) && (this._first = fromPromise(this._first));

  (isArrayLike(this._second) || isIterable(this._second)) && (this._second = fromArray(this._second));
  isPromise(this._second) && (this._second = fromPromise(this._second));

  var state = {
    o: o,
    donel: false,
    doner: false,
    ql: [],
    qr: [],
    cmp: this._cmp
  };

  return new BinaryDisposable(
    this._first.subscribe(new FirstObserver(state)),
    this._second.subscribe(new SecondObserver(state))
  );
};

module.exports = function sequenceEqual (first, second, comparer) {
  comparer || (comparer = isEqual);
  return new SequenceEqualObservable(first, second, comparer);
};
