'use strict';

var ObservableBase = require('./observablebase');
var observableFrom = require('./from');
var AbstractObserver = require('../observer/abstractobserver');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var NAryDisposable = require('../narydisposable');
var identity = require('../helpers/identity');
var isFunction = require('../helpers/isfunction');
var isArrayLike = require('../helpers/isarraylike');
var isIterable = require('../helpers/isiterable');
var inherits = require('inherits');
var tryCatch = require('../internal/trycatchutils').tryCatch;

function falseFactory() { return false; }
function emptyArrayFactory() { return []; }
function initializeArray (n, fn) {
  var results = new Array(n);
  for (var i = 0; i < n; i++) {
    results[i] = fn(i);
  }
  return results;
}
function argumentsToArray() {
  var len = arguments.length, args = new Array(len);
  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
  return args;
}

function ZipIterableObserver(s, i) {
  this._s = s;
  this._i = i;
  AbstractObserver.call(this);
}

inherits(ZipIterableObserver, AbstractObserver);

function notEmpty(x) { return x.length > 0; }
function shiftEach(x) { return x.shift(); }
function notTheSame(i) { return function (x, j) { return j !== i; }; }

ZipIterableObserver.prototype.next = function (x) {
  this._s.q[this._i].push(x);
  if (this._s.q.every(notEmpty)) {
    var queuedValues = this._s.q.map(shiftEach),
        res = tryCatch(this._s.cb).apply(null, queuedValues);
    if (res === global.Rx.errorObj) { return this._s.o.onError(res.e); }
    this._s.o.onNext(res);
  } else if (this._s.done.filter(notTheSame(this._i)).every(identity)) {
    this._s.o.onCompleted();
  }
};

ZipIterableObserver.prototype.error = function (e) { this._s.o.onError(e); };

ZipIterableObserver.prototype.completed = function () {
  this._s.done[this._i] = true;
  this._s.done.every(identity) && this._s.o.onCompleted();
};

function ZipIterableObservable(sources, cb) {
  this._sources = sources;
  this._cb = cb;
  ObservableBase.call(this);
}

inherits(ZipIterableObservable, ObservableBase);

ZipIterableObservable.prototype.subscribeCore = function (o) {
  var sources = this._sources, len = sources.length, subscriptions = new Array(len);

  var state = {
    q: initializeArray(len, emptyArrayFactory),
    done: initializeArray(len, falseFactory),
    cb: this._cb,
    o: o
  };

  for (var i = 0; i < len; i++) {
    (function (i) {
      var source = sources[i], sad = new SingleAssignmentDisposable();
      (isArrayLike(source) || isIterable(source)) && (source = observableFrom(source));
      subscriptions[i] = sad;
      sad.setDisposable(source.subscribe(new ZipIterableObserver(state, i)));
    }(i));
  }

  return new NAryDisposable(subscriptions);
};

/**
 * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
 * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
 * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
 */
module.exports = function zipIterable() {
  var len = arguments.length, args = new Array(len);
  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
  var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
  return new ZipIterableObservable(args, resultSelector);
};
