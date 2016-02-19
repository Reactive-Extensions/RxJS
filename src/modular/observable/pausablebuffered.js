'use strict';

var Observable = require('../observable');
var ObservableBase = require('./observablebase');
var distinctUntilChanged = require('./distinctuntilchanged');
var merge = require('./merge');
var startWith = require('./startwith');
var Subject = require('../subject');
var AbstractObserver = require('../observer/abstractobserver');
var BinaryDisposable = require('../binarydisposable');
var identity = require('../helpers/identity');
var tryCatch = require('../trycatchutils').tryCatch;
var inherits = require('inherits');

function next(state, x, i) {
  state.values[i] = x;
  state.hasValue[i] = true;
  if (state.hasValueAll || (state.hasValueAll = state.hasValue.every(identity))) {
    if (state.err) { return state.o.onError(state.err); }
    var res = tryCatch(state.fn).apply(null, state.values);
    if (res === global._Rx.errorObj) { return state.o.onError(res.e); }
    state.o.onNext(res);
  }
  state.isDone && state.values[1] && state.o.onCompleted();
}

function SourceObserver(state) {
  this._s = state;
  AbstractObserver.call(this);
}

inherits(SourceObserver, AbstractObserver);

SourceObserver.prototype.next = function (x) { next(this._s, x, 0); };
SourceObserver.prototype.error = function (e) {
  if (this._s.values[1]) {
    this._s.o.onError(e);
  } else {
    this._s.err = e;
  }
};
SourceObserver.prototype.completed = function () {
  this._s.isDone = true;
  this._s.values[1] && this._s.o.onCompleted();
};

function SubjectObserver(state) {
  this._s = state;
  AbstractObserver.call(this);
}

inherits(SubjectObserver, AbstractObserver);

SubjectObserver.prototype.next = function (x) { next(this._s, x, 1); };
SubjectObserver.prototype.error = function (e) { this._s.o.onError(e); };
SubjectObserver.prototype.completed = function () {
  this._s.isDone = true;
  next(this._s, true, 1);
};

function CombineLatestObservable(source, subject, fn) {
  this.source = source;
  this.subject = subject;
  this.fn = fn;
  ObservableBase.call(this);
}

inherits(CombineLatestObservable, ObservableBase);

CombineLatestObservable.prototype.subscribeCore = function (o) {
  var state = {
    hasValue: [false, false],
    hasValueAll: false,
    isDone: false,
    values: new Array(2),
    err: null,
    o: o,
    fn: this.fn
  };

  return new BinaryDisposable(
    this.source.subscribe(new SourceObserver(state)),
    this.subject.subscribe(new SubjectObserver(state))
  );
};

function combineLatestSource(source, subject, fn) {
  return new CombineLatestObservable(source, subject, fn);
}

function PausableBufferedObserver(o) {
  this._o = o;
  this._q = [];
  this._previousShouldFire = null;
  AbstractObserver.call(this);
}

inherits(PausableBufferedObserver, AbstractObserver);

PausableBufferedObserver.prototype.drainQueue = function () {
  while (this._q.length > 0) { this._o.onNext(this._q.shift()); }
};

PausableBufferedObserver.prototype.next = function (x) {
  if (this._previousShouldFire !== null && x.shouldFire !== this._previousShouldFire) {
    this._previousShouldFire = x.shouldFire;
    // change in shouldFire
    if (x.shouldFire) { this.drainQueue(); }
  } else {
    this._previousShouldFire = x.shouldFire;
    // new data
    if (x.shouldFire) {
      this._o.onNext(x.data);
    } else {
      this._q.push(x.data);
    }
  }
};

PausableBufferedObserver.prototype.error = function (e) {
  this.drainQueue();
  this._o.onError(e);
};

PausableBufferedObserver.prototype.completed = function () {
  this.drainQueue();
  this._o.onCompleted();
};

function PausableBufferedObservable(source, pauser) {
  this.source = source;
  this.controller = new Subject();

  if (pauser && pauser.subscribe) {
    this.pauser = merge(this.controller, pauser);
  } else {
    this.pauser = this.controller;
  }

  Observable.call(this);
}

inherits(PausableBufferedObservable, Observable);

function selectorFn(data, shouldFire) {
  return { data: data, shouldFire: shouldFire };
}

PausableBufferedObservable.prototype._subscribe = function (o) {

  return combineLatestSource(
      this.source,
      distinctUntilChanged(startWith(this.pauser, false)),
      selectorFn)
    .subscribe(new PausableBufferedObserver(o));
};

PausableBufferedObservable.prototype.pause = function () {
  this.controller.onNext(false);
};

PausableBufferedObservable.prototype.resume = function () {
  this.controller.onNext(true);
};

module.exports = function pausableBuffered (source, pauser) {
  return new PausableBufferedObservable(source, pauser);
};
