'use strict';

var ObservableBase = require('./observablebase');
var fromArray = require('./fromarray');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var AbstractObserver = require('../observer/abstractobserver');
var CompositeDisposable = require('../compositedisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var CompositeError = require('../internal/errors').CompositeError;
var inherits = require('inherits');

function setCompletion(o, errors) {
  if (errors.length === 0) {
    o.onCompleted();
  } else if (errors.length === 1) {
    o.onError(errors[0]);
  } else {
    o.onError(new CompositeError(errors));
  }
}

function InnerObserver(inner, group, state) {
  this._inner = inner;
  this._group = group;
  this._state = state;
  AbstractObserver.call(this);
}

inherits(InnerObserver, AbstractObserver);

InnerObserver.prototype.next = function (x) { this._state.o.onNext(x); };
InnerObserver.prototype.error = function (e) {
  this._state.errors.push(e);
  this._group.remove(this._inner);
  this._state.isStopped && this._group.length === 1 && setCompletion(this._state.o, this._state.errors);
};
InnerObserver.prototype.completed = function () {
  this._group.remove(this._inner);
  this._state.isStopped && this._group.length === 1 && setCompletion(this._state.o, this._state.errors);
};

function MergeDelayErrorObserver(group, state) {
  this._group = group;
  this._state = state;
  AbstractObserver.call(this);
}

inherits(MergeDelayErrorObserver, AbstractObserver);

MergeDelayErrorObserver.prototype.next = function (x) {
  var inner = new SingleAssignmentDisposable();
  this._group.add(inner);

  // Check for promises support
  isPromise(x) && (x = fromPromise(x));
  inner.setDisposable(x.subscribe(new InnerObserver(inner, this._group, this._state)));
};

MergeDelayErrorObserver.prototype.error = function (e) {
  this._state.errors.push(e);
  this._state.isStopped = true;
  this._group.length === 1 && setCompletion(this._state.o, this._state.errors);
};

MergeDelayErrorObserver.prototype.completed = function () {
  this._state.isStopped = true;
  this._group.length === 1 && setCompletion(this._state.o, this._state.errors);
};

function MergeDelayErrorObservable(source) {
  this.source = source;
  ObservableBase.call(this);
}

inherits(MergeDelayErrorObservable, ObservableBase);

MergeDelayErrorObservable.prototype.subscribeCore = function (o) {
  var group = new CompositeDisposable(),
    m = new SingleAssignmentDisposable(),
    state = { isStopped: false, errors: [], o: o };

  group.add(m);
  m.setDisposable(this.source.subscribe(new MergeDelayErrorObserver(group, state)));

  return group;
};

/**
* Flattens an Observable that emits Observables into one Observable, in a way that allows an Observer to
* receive all successfully emitted items from all of the source Observables without being interrupted by
* an error notification from one of them.
*
* This behaves like Observable.prototype.mergeAll except that if any of the merged Observables notify of an
* error via the Observer's onError, mergeDelayError will refrain from propagating that
* error notification until all of the merged Observables have finished emitting items.
* @param {Array | Arguments} args Arguments or an array to merge.
* @returns {Observable} an Observable that emits all of the items emitted by the Observables emitted by the Observable
*/
module.exports = function mergeDelayError()  {
  var len = arguments.length, args = new Array(len);
  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
  return new MergeDelayErrorObservable(fromArray(args));
};
