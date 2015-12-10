'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var Subject = require('../subject');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var RefCountDisposable = require('../refcountdisposable');
var ArgumentOutOfRangeError = require('../internal/errors').ArgumentOutOfRangeError;
var addRef = require('../internal/addref');
var inherits = require('util').inherits;

function createWindow(state) {
  var s = new Subject();
  state.q.push(s);
  state.o.onNext(addRef(s, state.refCountDisposable));
}

function WindowCountObserver(state) {
  this._s = state;
  AbstractObserver.call(this);
}

inherits(WindowCountObserver, AbstractObserver);

WindowCountObserver.prototype.next = function (x) {
  for (var i = 0, len = this._s.q.length; i < len; i++) { this._s.q[i].onNext(x); }
  var c = this._s.n - this._s.count + 1;
  c >= 0 && c % this._s.skip === 0 && this._s.q.shift().onCompleted();
  ++this._s.n % this._s.skip === 0 && createWindow(this._s);
};

WindowCountObserver.prototype.error = function (e) {
  while (this._s.q.length > 0) { this._s.q.shift().onError(e); }
  this._s.o.onError(e);
};

WindowCountObserver.prototype.completed = function () {
  while (this._s.q.length > 0) { this._s.q.shift().onCompleted(); }
  this._s.o.onCompleted();
};

function WindowCountObservable(source, count, skip) {
  this.source = source;
  this._count = count;
  this._skip = skip;
  ObservableBase.call(this);
}

inherits(WindowCountObservable, ObservableBase);

WindowCountObservable.prototype.subscribeCore = function (o) {
  var m = new SingleAssignmentDisposable(),
    refCountDisposable = new RefCountDisposable(m);

  var state = {
    m: m,
    refCountDisposable: refCountDisposable,
    q: [],
    n: 0,
    count: this._count,
    skip: this._skip,
    o: o
  };

  createWindow(state);
  m.setDisposable(this.source.subscribe(new WindowCountObserver(state)));

  return refCountDisposable;
};

module.exports = function (source, count, skip) {
  +count || (count = 0);
  Math.abs(count) === Infinity && (count = 0);
  if (count <= 0) { throw new ArgumentOutOfRangeError(); }
  skip == null && (skip = count);
  +skip || (skip = 0);
  Math.abs(skip) === Infinity && (skip = 0);

  if (skip <= 0) { throw new ArgumentOutOfRangeError(); }
  return new WindowCountObservable(source, count, skip);
};
