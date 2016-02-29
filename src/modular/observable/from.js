'use strict';

var ObservableBase = require('./observablebase');
var Scheduler = require('../scheduler');
var isFunction = require('../helpers/isfunction');
var $iterator$ = require('../helpers/iterator');
var bindCallback = require('../internal/bindcallback');
var inherits = require('inherits');
var tryCatch = require('../internal/trycatchutils').tryCatch;

var doneEnumerator = { done: true, value: undefined };

function FromObservable(iterable, fn, scheduler) {
  this._iterable = iterable;
  this._fn = fn;
  this._scheduler = scheduler;
  ObservableBase.call(this);
}

inherits(FromObservable, ObservableBase);

function createScheduleMethod(o, it, fn) {
  return function loopRecursive(i, recurse) {
    var next = tryCatch(it.next).call(it);
    if (next === global._Rx.errorObj) { return o.onError(next.e); }
    if (next.done) { return o.onCompleted(); }

    var result = next.value;

    if (isFunction(fn)) {
      result = tryCatch(fn)(result, i);
      if (result === global._Rx.errorObj) { return o.onError(result.e); }
    }

    o.onNext(result);
    recurse(i + 1);
  };
}

FromObservable.prototype.subscribeCore = function (o) {
  var list = Object(this._iterable),
      it = getIterable(list);

  return this._scheduler.scheduleRecursive(0, createScheduleMethod(o, it, this._fn));
};

var maxSafeInteger = Math.pow(2, 53) - 1;

function StringIterable(s) {
  this._s = s;
}

StringIterable.prototype[$iterator$] = function () {
  return new StringIterator(this._s);
};

function StringIterator(s) {
  this._s = s;
  this._l = s.length;
  this._i = 0;
}

StringIterator.prototype[$iterator$] = function () {
  return this;
};

StringIterator.prototype.next = function () {
  return this._i < this._l ? { done: false, value: this._s.charAt(this._i++) } : doneEnumerator;
};

function ArrayIterable(a) {
  this._a = a;
}

ArrayIterable.prototype[$iterator$] = function () {
  return new ArrayIterator(this._a);
};

function ArrayIterator(a) {
  this._a = a;
  this._l = toLength(a);
  this._i = 0;
}

ArrayIterator.prototype[$iterator$] = function () {
  return this;
};

ArrayIterator.prototype.next = function () {
  return this._i < this._l ? { done: false, value: this._a[this._i++] } : doneEnumerator;
};

function numberIsFinite(value) {
  return typeof value === 'number' && global.isFinite(value);
}

function getIterable(o) {
  var i = o[$iterator$], it;
  if (!i && typeof o === 'string') {
    it = new StringIterable(o);
    return it[$iterator$]();
  }
  if (!i && o.length !== undefined) {
    it = new ArrayIterable(o);
    return it[$iterator$]();
  }
  if (!i) { throw new TypeError('Object is not iterable'); }
  return o[$iterator$]();
}

function sign(value) {
  var number = +value;
  if (number === 0) { return number; }
  if (isNaN(number)) { return number; }
  return number < 0 ? -1 : 1;
}

function toLength(o) {
  var len = +o.length;
  if (isNaN(len)) { return 0; }
  if (len === 0 || !numberIsFinite(len)) { return len; }
  len = sign(len) * Math.floor(Math.abs(len));
  if (len <= 0) { return 0; }
  if (len > maxSafeInteger) { return maxSafeInteger; }
  return len;
}

/**
* This method creates a new Observable sequence from an array-like or iterable object.
* @param {Any} arrayLike An array-like or iterable object to convert to an Observable sequence.
* @param {Function} [mapFn] Map function to call on every element of the array.
* @param {Any} [thisArg] The context to use calling the mapFn if provided.
* @param {Scheduler} [scheduler] Optional scheduler to use for scheduling.  If not provided, defaults to Scheduler.currentThread.
*/
module.exports = function (iterable, mapFn, thisArg, scheduler) {
  if (iterable == null) { throw new Error('iterable cannot be null.'); }
  if (mapFn && !isFunction(mapFn)) { throw new Error('mapFn when provided must be a function'); }

  var mapper;
  if (mapFn) { mapper = bindCallback(mapFn, thisArg, 2); }
  Scheduler.isScheduler(scheduler) || (scheduler = Scheduler.queue);
  return new FromObservable(iterable, mapper, scheduler);
};
