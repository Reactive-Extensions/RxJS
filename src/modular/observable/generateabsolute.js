'use strict';

var ObservableBase = require('./observablebase');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var isScheduler = require('../scheduler').isScheduler;
var inherits = require('inherits');

global.Rx || (global.Rx = {});
if (!global.Rx.defaultScheduler) {
  require('../scheduler/defaultscheduler');
}

function GenerateAbsoluteObservable(state, cndFn, itrFn, resFn, timeFn, s) {
  this._state = state;
  this._cndFn = cndFn;
  this._itrFn = itrFn;
  this._resFn = resFn;
  this._timeFn = timeFn;
  this._s = s;
  ObservableBase.call(this);
}

inherits(GenerateAbsoluteObservable, ObservableBase);

function scheduleRecursive(state, recurse) {
  state.hasResult && state.o.onNext(state.newState);

  if (state.first) {
    state.first = false;
  } else {
    state.newState = tryCatch(state.self._itrFn)(state.newState);
    if (state.newState === global.Rx.errorObj) { return state.o.onError(state.newState.e); }
  }
  state.hasResult = tryCatch(state.self._cndFn)(state.newState);
  if (state.hasResult === global.Rx.errorObj) { return state.o.onError(state.hasResult.e); }
  if (state.hasResult) {
    var result = tryCatch(state.self._resFn)(state.newState);
    if (result === global.Rx.errorObj) { return state.o.onError(result.e); }
    var time = tryCatch(state.self._timeFn)(state.newState);
    if (time === global.Rx.errorObj) { return state.o.onError(time.e); }
    recurse(state, time);
  } else {
    state.o.onCompleted();
  }
}

GenerateAbsoluteObservable.prototype.subscribeCore = function (o) {
  var state = {
    o: o,
    self: this,
    newState: this._state,
    first: true,
    hasValue: false
  };
  return this._s.scheduleRecursiveFuture(state, new Date(this._s.now()), scheduleRecursive);
};


module.exports = function generateAbsolute (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
  isScheduler(scheduler) || (scheduler = global.Rx.defaultScheduler);
  return new GenerateAbsoluteObservable(initialState, condition, iterate, resultSelector, timeSelector, scheduler);
};
