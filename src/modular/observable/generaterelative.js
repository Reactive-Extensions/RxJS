'use strict';

var ObservableBase = require('./observablebase');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var isScheduler = require('../scheduler').isScheduler;
var inherits = require('inherits');

global._Rx || (global._Rx = {});
if (!global._Rx.defaultScheduler) {
  require('../scheduler/defaultscheduler');
}

function GenerateRelativeObservable(state, cndFn, itrFn, resFn, timeFn, s) {
  this._state = state;
  this._cndFn = cndFn;
  this._itrFn = itrFn;
  this._resFn = resFn;
  this._timeFn = timeFn;
  this._s = s;
  ObservableBase.call(this);
}

inherits(GenerateRelativeObservable, ObservableBase);

function scheduleRecursive(state, recurse) {
  state.hasResult && state.o.onNext(state.result);

  if (state.first) {
    state.first = false;
  } else {
    state.newState = tryCatch(state.self._itrFn)(state.newState);
    if (state.newState === global._Rx.errorObj) { return state.o.onError(state.newState.e); }
  }
  state.hasResult = tryCatch(state.self._cndFn)(state.newState);
  if (state.hasResult === global._Rx.errorObj) { return state.o.onError(state.hasResult.e); }
  if (state.hasResult) {
    state.result = tryCatch(state.self._resFn)(state.newState);
    if (state.result === global._Rx.errorObj) { return state.o.onError(state.result.e); }
    var time = tryCatch(state.self._timeFn)(state.newState);
    if (time === global._Rx.errorObj) { return state.o.onError(time.e); }
    recurse(state, time);
  } else {
    state.o.onCompleted();
  }
}

GenerateRelativeObservable.prototype.subscribeCore = function (o) {
  var state = {
    o: o,
    self: this,
    newState: this._state,
    first: true,
    hasResult: false
  };
  return this._s.scheduleRecursiveFuture(state, 0, scheduleRecursive);
};

module.exports = function generateRelative (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
  isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
  return new GenerateRelativeObservable(initialState, condition, iterate, resultSelector, timeSelector, scheduler);
};
