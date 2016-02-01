'use strict';

var ObservableBase = require('./observablebase');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var isScheduler = require('../scheduler').isScheduler;
var inherits = require('inherits');

global._Rx || (global._Rx = {});
if (!global._Rx.currentThreadScheduler) {
  require('../scheduler/currentthreadscheduler');
}

function GenerateObservable(state, cndFn, itrFn, resFn, s) {
  this._initialState = state;
  this._cndFn = cndFn;
  this._itrFn = itrFn;
  this._resFn = resFn;
  this._s = s;
  ObservableBase.call(this);
}

inherits(GenerateObservable, ObservableBase);

function scheduleRecursive(state, recurse) {
  if (state.first) {
    state.first = false;
  } else {
    state.newState = tryCatch(state.self._itrFn)(state.newState);
    if (state.newState === global._Rx.errorObj) { return state.o.onError(state.newState.e); }
  }
  var hasResult = tryCatch(state.self._cndFn)(state.newState);
  if (hasResult === global._Rx.errorObj) { return state.o.onError(hasResult.e); }
  if (hasResult) {
    var result = tryCatch(state.self._resFn)(state.newState);
    if (result === global._Rx.errorObj) { return state.o.onError(result.e); }
    state.o.onNext(result);
    recurse(state);
  } else {
    state.o.onCompleted();
  }
}

GenerateObservable.prototype.subscribeCore = function (o) {
  var state = {
    o: o,
    self: this,
    first: true,
    newState: this._initialState,
  };
  return this._s.scheduleRecursive(state, scheduleRecursive);
};

module.exports = function generate (initialState, condition, iterate, resultSelector, scheduler) {
  isScheduler(scheduler) || (scheduler = global._Rx.currentThreadScheduler);
  return new GenerateObservable(initialState, condition, iterate, resultSelector, scheduler);
};
