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
  for (var i = 0; i < len; i++) { args[i] = arguments[i]; }
  return args;
}

function ZipObserver(o, i, p, q, d) {
  this._o = o;
  this._i = i;
  this._p = p;
  this._q = q;
  this._d = d;
  AbstractObserver.call(this);
}

inherits(ZipObserver, AbstractObserver);

function notEmpty(x) { return x.length > 0; }
function shiftEach(x) { return x.shift(); }
function notTheSame(i) { return function (x, j) { return j !== i; }; }

ZipObserver.prototype.next = function (x) {
  this._q[this._i].push(x);
  if (this._q.every(notEmpty)) {
    var queuedValues = this._q.map(shiftEach);
    var res = tryCatch(this._p._cb).apply(null, queuedValues);
    if (res === global.Rx.errorObj) { return this._o.onError(res.e); }
    this._o.onNext(res);
  } else if (this._d.filter(notTheSame(this._i)).every(identity)) {
    this._o.onCompleted();
  }
};

ZipObserver.prototype.error = function (e) { this._o.onError(e); };
ZipObserver.prototype.completed = function () {
  this._d[this._i] = true;
  this._d.every(identity) && this._o.onCompleted();
};


function ZipObservable(s, cb) {
  this._s = s;
  this._cb = cb;
  ObservableBase.call(this);
}

inherits(ZipObservable, ObservableBase);

ZipObservable.prototype.subscribeCore = function(observer) {
  var n = this._s.length,
      subscriptions = new Array(n),
      done = initializeArray(n, falseFactory),
      q = initializeArray(n, emptyArrayFactory);

  for (var i = 0; i < n; i++) {
    var source = this._s[i], sad = new SingleAssignmentDisposable();
    subscriptions[i] = sad;
    isPromise(source) && (source = fromPromise(source));
    sad.setDisposable(source.subscribe(new ZipObserver(observer, i, this, q, done)));
  }

  return new NAryDisposable(subscriptions);
};

/**
* Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
* The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
* @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
*/
module.exports = function zip () {
  if (arguments.length === 0) { throw new Error('invalid arguments'); }
  var len = arguments.length, args = new Array(len);
  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
  var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
  return new ZipObservable(args, resultSelector);
};
