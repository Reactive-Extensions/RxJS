'use strict';

var ObservableBase = require('./observablebase');
var Disposable = require('../disposable');
var Scheduler = require('../scheduler');
var inherits = require('inherits');

global._Rx || (global._Rx = {});
if (!global._Rx.immediateScheduler) {
  require('../scheduler/immediatescheduler');
}

function scheduleItem(s, state) {
  var e = state[0], o = state[1];
  o.onError(e);
  return Disposable.empty;
}

function ThrowObservable(error, scheduler) {
  this._error = error;
  this._scheduler = scheduler;
  ObservableBase.call(this);
}

inherits(ThrowObservable, ObservableBase);

ThrowObservable.prototype.subscribeCore = function (o) {
  var state = [this._error, o];
  return this._scheduler === global._Rx.immediateScheduler ?
    scheduleItem(null, state) :
    this._scheduler.schedule(state, scheduleItem);
};

module.exports = function throwError(error, scheduler) {
  Scheduler.isScheduler(scheduler) || (scheduler = global._Rx.immediateScheduler);
  return new ThrowObservable(error, scheduler);
};
