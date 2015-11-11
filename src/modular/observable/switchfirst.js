'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var CompositeDisposable = require('../compositedisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var inherits = require('util').inherits;

function InnerObserver(state, inner) {
  this._s = state;
  this._i = inner;
  AbstractObserver.call(this);
}

inherits(InnerObserver, AbstractObserver);

InnerObserver.prototype.next = function (x) { this._s.o.onNext(x); };
InnerObserver.prototype.error = function (e) { this._s.o.onError(e); };
InnerObserver.prototype.completed = function () {
  this._s.g.remove(this._i);
  this._s.hasCurrent = false;
  this._s.isStopped && this._s.g.length === 1 && this._s.o.onCompleted();
};

function SwitchFirstObserver(state) {
  this._s = state;
  AbstractObserver.call(this);
}

inherits(SwitchFirstObserver, AbstractObserver);

SwitchFirstObserver.prototype.next = function (x) {
  if (!this._s.hasCurrent) {
    this._s.hasCurrent = true;
    isPromise(x) && (x = fromPromise(x));
    var inner = new SingleAssignmentDisposable();
    this._s.g.add(inner);
    inner.setDisposable(x.subscribe(new InnerObserver(this._s, inner)));
  }
};

SwitchFirstObserver.prototype.error = function (e) {
  this._s.o.onError(e);
};

SwitchFirstObserver.prototype.completed = function () {
  this._s.isStopped = true;
  !this._s.hasCurrent && this._s.g.length === 1 && this._s.o.onCompleted();
};

function SwitchFirstObservable(source) {
  this.source = source;
  ObservableBase.call(this);
}

inherits(SwitchFirstObservable, ObservableBase);

SwitchFirstObservable.prototype.subscribeCore = function (o) {
  var m = new SingleAssignmentDisposable(),
    g = new CompositeDisposable(),
    state = {
      hasCurrent: false,
      isStopped: false,
      o: o,
      g: g
    };

  g.add(m);
  m.setDisposable(this.source.subscribe(new SwitchFirstObserver(state)));
  return g;
};

/**
 * Performs a exclusive waiting for the first to finish before subscribing to another observable.
 * Observables that come in between subscriptions will be dropped on the floor.
 * @returns {Observable} A exclusive observable with only the results that happen when subscribed.
 */
module.exports = function switchFirst (source) {
  return new SwitchFirstObservable(source);
};
